import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { del, get, list, put } from "@vercel/blob";
import { RETENTION_DAYS, type ApplicationRecord, type Stage } from "./config";

/**
 * Application storage, server code only. Two backends, picked automatically:
 *
 * - Vercel Blob (private store) when BLOB_READ_WRITE_TOKEN or BLOB_STORE_ID is
 *   set, which Vercel does when a Blob store is connected to the project. Needed
 *   on Vercel, whose filesystem is read-only. One JSON blob per application
 *   under careers/apps/ and one blob per CV under careers/cvs/.
 * - Local files otherwise (self-hosted / dev): one JSON file of records plus a
 *   folder of CVs under CAREERS_DATA_DIR (default ./data, git-ignored).
 */
export const storageBackend = () =>
  process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID ? "blob" : "local";

/** Whether this deployment can store applications at all. */
export const storageAvailable = () => storageBackend() === "blob" || !process.env.VERCEL;

export const newId = () => `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}`;

/** IDs are generated here, so anything else is rejected before it can reach a path. */
const SAFE_ID = /^[a-z0-9]+-[a-f0-9]{12}$/;
export const isSafeId = (id: string) => SAFE_ID.test(id);

/** Submission time, read from the ID itself so expiry checks need no extra reads. */
const idTime = (id: string) => parseInt(id.split("-")[0], 36);

// ——— Vercel Blob ———

const APPS = "careers/apps/";
const CVS = "careers/cvs/";
const appPath = (id: string) => `${APPS}${id}.json`;

async function blobText(pathname: string) {
  const res = await get(pathname, { access: "private", useCache: false });
  return res?.statusCode === 200 ? new Response(res.stream).text() : null;
}

async function blobList(prefix: string) {
  const out: { pathname: string; url: string }[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix, cursor, limit: 1000 });
    out.push(...page.blobs.map(({ pathname, url }) => ({ pathname, url })));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return out;
}

const putJson = (record: ApplicationRecord) =>
  put(appPath(record.id), JSON.stringify(record), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });

const blob = {
  async readAll(): Promise<ApplicationRecord[]> {
    const items = await blobList(APPS);
    const texts = await Promise.all(items.map((b) => blobText(b.pathname).catch(() => null)));
    return texts.filter((t): t is string => !!t).map((t) => JSON.parse(t) as ApplicationRecord);
  },
  async readOne(id: string) {
    const text = await blobText(appPath(id));
    return text ? (JSON.parse(text) as ApplicationRecord) : null;
  },
  async add(record: ApplicationRecord, cv: Buffer) {
    await put(`${CVS}${record.cv!.file}`, cv, {
      access: "private",
      contentType: record.cv!.type,
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    await putJson(record);
  },
  async readCv(file: string) {
    const res = await get(`${CVS}${path.basename(file)}`, { access: "private", useCache: false });
    return res?.statusCode === 200 ? Buffer.from(await new Response(res.stream).arrayBuffer()) : null;
  },
  async update(record: ApplicationRecord) {
    await putJson(record);
  },
  async remove(ids: string[]) {
    if (!ids.length) return;
    const set = new Set(ids);
    const cvs = (await blobList(CVS)).filter((b) => set.has(path.basename(b.pathname).replace(/\.[^.]+$/, "")));
    await del([...ids.map(appPath), ...cvs.map((b) => b.pathname)]);
  },
  async allIds() {
    return (await blobList(APPS)).map((b) => path.basename(b.pathname, ".json"));
  },
};

// ——— Local files ———

const DATA_DIR = path.resolve(process.env.CAREERS_DATA_DIR || path.join(process.cwd(), "data"));
const APPLICATIONS_DIR = path.join(DATA_DIR, "applications");
const CV_DIR = path.join(DATA_DIR, "cvs");
const DB_FILE = path.join(APPLICATIONS_DIR, "applications.json");

// Serialise writes within this process so concurrent submissions don't clobber each other.
let queue: Promise<unknown> = Promise.resolve();
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

async function ensureDirs() {
  await fs.mkdir(APPLICATIONS_DIR, { recursive: true, mode: 0o700 });
  await fs.mkdir(CV_DIR, { recursive: true, mode: 0o700 });
}

async function localReadAll(): Promise<ApplicationRecord[]> {
  try {
    return JSON.parse(await fs.readFile(DB_FILE, "utf8")) as ApplicationRecord[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function localWriteAll(records: ApplicationRecord[]) {
  await ensureDirs();
  // Write then rename, so a crash never leaves a half-written database.
  const tmp = `${DB_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(records, null, 2), { mode: 0o600 });
  await fs.rename(tmp, DB_FILE);
}

const local = {
  readAll: localReadAll,
  async readOne(id: string) {
    return (await localReadAll()).find((r) => r.id === id) ?? null;
  },
  add(record: ApplicationRecord, cv: Buffer) {
    return withLock(async () => {
      await ensureDirs();
      await fs.writeFile(path.join(CV_DIR, record.cv!.file), cv, { mode: 0o600 });
      const all = await localReadAll();
      all.push(record);
      await localWriteAll(all);
    });
  },
  async readCv(file: string) {
    return fs.readFile(path.join(CV_DIR, path.basename(file))).catch(() => null);
  },
  update(record: ApplicationRecord) {
    return withLock(async () => {
      const all = await localReadAll();
      await localWriteAll(all.map((r) => (r.id === record.id ? record : r)));
    });
  },
  remove(ids: string[]) {
    return withLock(async () => {
      const set = new Set(ids);
      const all = await localReadAll();
      for (const r of all) if (set.has(r.id) && r.cv) await fs.rm(path.join(CV_DIR, path.basename(r.cv.file)), { force: true });
      await localWriteAll(all.filter((r) => !set.has(r.id)));
    });
  },
  async allIds() {
    return (await localReadAll()).map((r) => r.id);
  },
};

const backend = () => (storageBackend() === "blob" ? blob : local);

// ——— Public API ———

export const readApplications = () => backend().readAll();
export const readApplication = (id: string) => backend().readOne(id);
export const readCv = (file: string) => backend().readCv(file);

/** Stores the CV and the record; `record.cv` must already describe the file. */
export const addApplication = (record: ApplicationRecord, cv: Buffer) => backend().add(record, cv);

export async function updateStatus(id: string, status: Stage) {
  const rec = await readApplication(id);
  if (!rec) return null;
  rec.status = status;
  rec.updatedAt = new Date().toISOString();
  await backend().update(rec);
  return rec;
}

/** Deletes one application and its CV (withdrawal or erasure request). */
export async function deleteApplication(id: string) {
  if (!(await readApplication(id))) return false;
  await backend().remove([id]);
  return true;
}

/**
 * Enforces the retention period promised in the candidate privacy notice: deletes
 * applications (and CVs) submitted more than RETENTION_DAYS ago. Runs on each new
 * submission and each admin page load, so no scheduler is needed.
 */
export async function purgeExpired(now = Date.now()) {
  const cutoff = now - RETENTION_DAYS * 24 * 60 * 60 * 1000;
  const expired = (await backend().allIds()).filter((id) => idTime(id) < cutoff);
  await backend().remove(expired);
  return expired.length;
}
