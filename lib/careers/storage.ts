import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { BlobPreconditionFailedError, del, get, list, put } from "@vercel/blob";
import { RETAINED_STAGES, RETENTION_DAYS, type ApplicationRecord, type Note, type Stage } from "./config";

/**
 * Application storage, server code only. Two backends, picked automatically:
 *
 * - Vercel Blob (private store) when a Blob store is connected to the project,
 *   which adds BLOB_READ_WRITE_TOKEN (or <PREFIX>_READ_WRITE_TOKEN if a custom
 *   prefix was chosen), or BLOB_STORE_ID with OIDC. Needed on Vercel, whose
 *   filesystem is read-only. Every record lives in one JSON blob,
 *   careers/index.json, and each CV in its own blob under careers/cvs/.
 * - Local files otherwise (self-hosted / dev): one JSON file of records plus a
 *   folder of CVs under CAREERS_DATA_DIR (default ./data, git-ignored).
 *
 * The Hobby plan includes 2,000 advanced Blob operations (put, list) a month and
 * blocks the store for 30 days past that, so reads never list: they fetch the
 * index, and only when it changed (ETag). Writes replace the index only if no one
 * else wrote it in between (ifMatch), and retry otherwise, so two admins acting
 * at once can't undo each other's changes.
 */

/** Blob credentials, found under the default names or any custom prefix. */
function blobAuth(): { token: string } | { storeId: string } | null {
  const env = process.env;
  if (env.BLOB_READ_WRITE_TOKEN) return { token: env.BLOB_READ_WRITE_TOKEN };
  const token = Object.entries(env).find(([k, v]) => k.endsWith("_READ_WRITE_TOKEN") && v?.startsWith("vercel_blob_rw_"))?.[1];
  if (token) return { token };
  if (env.BLOB_STORE_ID) return { storeId: env.BLOB_STORE_ID };
  const storeId = Object.entries(env).find(([k, v]) => k.endsWith("_STORE_ID") && v?.startsWith("store_"))?.[1];
  return storeId ? { storeId } : null;
}

export const storageBackend = () => (blobAuth() ? "blob" : "local");

/** Whether this deployment can store applications at all. */
export const storageAvailable = () => storageBackend() === "blob" || !process.env.VERCEL;

export const newId = () => `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}`;

/** IDs are generated here, so anything else is rejected before it can reach a path. */
const SAFE_ID = /^[a-z0-9]+-[a-f0-9]{12}$/;
export const isSafeId = (id: string) => SAFE_ID.test(id);

/** Submission time, read from the ID itself. */
const idTime = (id: string) => parseInt(id.split("-")[0], 36);

/** The records and the version they were read at (Blob ETag; null for local files). */
type Snapshot = { records: ApplicationRecord[]; version: string | null };

type Backend = {
  load(): Promise<Snapshot>;
  /**
   * Applies `change` to the latest records and saves them, unless it returns
   * null (nothing to save). Resolves to whatever `change` returned.
   */
  mutate<T>(change: (records: ApplicationRecord[]) => { records: ApplicationRecord[]; result: T } | null): Promise<T | null>;
  putCv(file: string, data: Buffer, type: string): Promise<void>;
  readCv(file: string): Promise<Buffer | null>;
  removeCvs(files: string[]): Promise<void>;
};

// ——— Vercel Blob ———

const INDEX = "careers/index.json";
const CVS = "careers/cvs/";
/** Per-application records written by earlier versions, moved into the index on first read. */
const LEGACY_APPS = "careers/apps/";
const MAX_WRITE_ATTEMPTS = 6;

const cvFiles = (records: ApplicationRecord[]) => records.flatMap((r) => (r.cv ? [r.cv.file] : []));

/** Last index this instance read or wrote; a re-read only downloads it if it changed. */
let cached: Snapshot | null = null;
const copy = (s: Snapshot): Snapshot => ({ records: structuredClone(s.records), version: s.version });

async function blobText(pathname: string) {
  const res = await get(pathname, { access: "private", useCache: false, ...blobAuth() });
  return res?.statusCode === 200 ? new Response(res.stream).text() : null;
}

const putIndex = (records: ApplicationRecord[], options: { ifMatch?: string; allowOverwrite: boolean }) =>
  put(INDEX, JSON.stringify(records), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    ...options,
    ...blobAuth(),
  });

async function listAll(prefix: string) {
  const out: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix, cursor, limit: 1000, ...blobAuth() });
    out.push(...page.blobs.map((b) => b.pathname));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return out;
}

/** A CV this young may belong to a submission still being saved, so cleanup leaves it alone. */
const ORPHAN_GRACE_MS = 60 * 60 * 1000;

/**
 * First read on a store without an index: builds it from any legacy records, and
 * deletes CVs no record points to (earlier versions could leave one behind when a
 * save failed, and the purge only follows records). Two lists, once.
 */
async function createIndex(): Promise<Snapshot> {
  const legacy = await listAll(LEGACY_APPS);
  const texts = await Promise.all(legacy.map((p) => blobText(p)));
  const records = texts.filter((t): t is string => !!t).map((t) => JSON.parse(t) as ApplicationRecord);
  try {
    const res = await putIndex(records, { allowOverwrite: false });
    cached = { records, version: res.etag };
  } catch (err) {
    // Another request created the index first: use theirs.
    const again = await get(INDEX, { access: "private", useCache: false, ...blobAuth() });
    if (again?.statusCode !== 200) throw err;
    cached = { records: JSON.parse(await new Response(again.stream).text()), version: again.blob.etag };
    return copy(cached);
  }
  // Deletes are free; the old copies must go so the retention purge covers everything.
  const referenced = new Set(cvFiles(records).map((f) => `${CVS}${path.basename(f)}`));
  const orphans = (await listAll(CVS).catch(() => [])).filter(
    (p) => !referenced.has(p) && idTime(path.basename(p)) < Date.now() - ORPHAN_GRACE_MS
  );
  const stale = [...legacy, ...orphans];
  if (stale.length) await del(stale, { ...blobAuth() }).catch(() => undefined);
  return copy(cached);
}

const blob: Backend = {
  async load() {
    const res = await get(INDEX, { access: "private", useCache: false, ifNoneMatch: cached?.version ?? undefined, ...blobAuth() });
    if (!res) return createIndex();
    if (res.statusCode === 304 && cached) return copy(cached);
    if (res.statusCode !== 200) throw new Error(`Unexpected Blob response ${res.statusCode}`);
    cached = { records: JSON.parse(await new Response(res.stream).text()), version: res.blob.etag };
    return copy(cached);
  },
  async mutate(change) {
    for (let attempt = 1; ; attempt++) {
      const { records, version } = await blob.load();
      const out = change(records);
      if (!out) return null;
      try {
        const res = await putIndex(out.records, { ifMatch: version ?? undefined, allowOverwrite: true });
        cached = { records: structuredClone(out.records), version: res.etag };
        return out.result;
      } catch (err) {
        if (!(err instanceof BlobPreconditionFailedError) || attempt >= MAX_WRITE_ATTEMPTS) throw err;
        // Someone else saved in between: start again from their version.
        cached = null;
        await new Promise((r) => setTimeout(r, 50 * attempt + Math.random() * 100));
      }
    }
  },
  async putCv(file, data, type) {
    await put(`${CVS}${path.basename(file)}`, data, {
      access: "private",
      contentType: type,
      addRandomSuffix: false,
      allowOverwrite: true,
      ...blobAuth(),
    });
  },
  async readCv(file) {
    const res = await get(`${CVS}${path.basename(file)}`, { access: "private", useCache: false, ...blobAuth() });
    return res?.statusCode === 200 ? Buffer.from(await new Response(res.stream).arrayBuffer()) : null;
  },
  async removeCvs(files) {
    if (files.length) await del(files.map((f) => `${CVS}${path.basename(f)}`), { ...blobAuth() });
  },
};

// ——— Local files ———

const DATA_DIR = path.resolve(process.env.CAREERS_DATA_DIR || path.join(process.cwd(), "data"));
const APPLICATIONS_DIR = path.join(DATA_DIR, "applications");
const CV_DIR = path.join(DATA_DIR, "cvs");
const DB_FILE = path.join(APPLICATIONS_DIR, "applications.json");

// Serialise writes within this process so concurrent requests don't clobber each other.
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

const local: Backend = {
  async load() {
    return { records: await localReadAll(), version: null };
  },
  mutate(change) {
    return withLock(async () => {
      const out = change(await localReadAll());
      if (!out) return null;
      await localWriteAll(out.records);
      return out.result;
    });
  },
  async putCv(file, data) {
    await ensureDirs();
    await fs.writeFile(path.join(CV_DIR, path.basename(file)), data, { mode: 0o600 });
  },
  async readCv(file) {
    return fs.readFile(path.join(CV_DIR, path.basename(file))).catch(() => null);
  },
  async removeCvs(files) {
    for (const f of files) await fs.rm(path.join(CV_DIR, path.basename(f)), { force: true });
  },
};

const backend = () => (storageBackend() === "blob" ? blob : local);

// ——— Public API ———

export const readApplications = async () => (await backend().load()).records;
export const readApplication = async (id: string) => (await readApplications()).find((r) => r.id === id) ?? null;
export const readCv = (file: string) => backend().readCv(file);

/** Applications past the retention period, except offers and hires (see RETAINED_STAGES). */
export const isExpired = (record: ApplicationRecord, now = Date.now()) =>
  !RETAINED_STAGES.includes(record.status) && idTime(record.id) < now - RETENTION_DAYS * 24 * 60 * 60 * 1000;

/**
 * Stores the CV and the record (`record.cv` must already describe the file). The
 * same write drops expired applications, so the purge costs nothing extra.
 */
export async function addApplication(record: ApplicationRecord, cv: Buffer) {
  const b = backend();
  await b.putCv(record.cv!.file, cv, record.cv!.type);
  const expired = await b
    .mutate((records) => {
      const gone = records.filter((r) => isExpired(r));
      return { records: [...records.filter((r) => !isExpired(r)), record], result: gone };
    })
    .catch(async (err) => {
      // No record points at the CV now, so the purge would never delete it.
      await b.removeCvs([record.cv!.file]).catch(() => undefined);
      throw err;
    });
  await b.removeCvs(cvFiles(expired ?? [])).catch(() => undefined);
}

/** Changes the status of one or more applications, recording who did it. Returns the updated records. */
export async function updateStatus(ids: string[], status: Stage, by: string) {
  const set = new Set(ids);
  const now = new Date().toISOString();
  // Already in that status: reported as they are, without a write.
  let unchanged: ApplicationRecord[] = [];
  const changed = await backend().mutate((records) => {
    const out: ApplicationRecord[] = [];
    const next = records.map((r) => {
      if (!set.has(r.id) || r.status === status) return r;
      const rec: ApplicationRecord = {
        ...r,
        status,
        updatedAt: now,
        history: [...(r.history ?? []), { at: now, by, from: r.status, to: status }],
      };
      out.push(rec);
      return rec;
    });
    unchanged = records.filter((r) => set.has(r.id) && r.status === status);
    return out.length ? { records: next, result: out } : null;
  });
  return changed ?? unchanged;
}

/** Adds an internal note. Returns the note, or null when the application doesn't exist. */
export async function addNote(id: string, text: string, by: string) {
  const note: Note = { id: randomBytes(6).toString("hex"), at: new Date().toISOString(), by, text };
  return backend().mutate((records) => {
    if (!records.some((r) => r.id === id)) return null;
    return { records: records.map((r) => (r.id === id ? { ...r, notes: [...(r.notes ?? []), note] } : r)), result: note };
  });
}

/** Deletes one application and its CV (withdrawal or erasure request). */
export async function deleteApplication(id: string) {
  const b = backend();
  const removed = await b.mutate((records) => {
    const rec = records.find((r) => r.id === id);
    return rec ? { records: records.filter((r) => r.id !== id), result: rec } : null;
  });
  if (!removed) return false;
  await b.removeCvs(cvFiles([removed]));
  return true;
}

/**
 * Enforces the retention period promised in the candidate privacy notice: deletes
 * applications (and CVs) submitted more than RETENTION_DAYS ago, except offers and
 * hires. Runs on each new submission and each admin page load, so no scheduler is
 * needed; it only writes when something expired.
 */
export async function purgeExpired(now = Date.now()) {
  const b = backend();
  const expired = await b.mutate((records) => {
    const gone = records.filter((r) => isExpired(r, now));
    return gone.length ? { records: records.filter((r) => !isExpired(r, now)), result: gone } : null;
  });
  await b.removeCvs(cvFiles(expired ?? []));
  return expired?.length ?? 0;
}

/** All applications, after dropping expired ones: what the admin board shows, for the price of one read. */
export async function readApplicationsPurged(now = Date.now()) {
  const b = backend();
  let kept: ApplicationRecord[] = [];
  const expired = await b.mutate((records) => {
    kept = records.filter((r) => !isExpired(r, now));
    return kept.length < records.length ? { records: kept, result: records.filter((r) => isExpired(r, now)) } : null;
  });
  await b.removeCvs(cvFiles(expired ?? [])).catch(() => undefined);
  return kept;
}

/**
 * Writes, reads back and deletes a tiny private blob (or local file), so the admin
 * page can show why storage fails. It costs an advanced operation, so it only runs
 * after a read has failed.
 */
export function storageSelfTest(): Promise<{ backend: string; ok: boolean; detail: string }> {
  // Hard cap: the Blob SDK can keep retrying when the network is unreachable.
  const timeout = new Promise<{ backend: string; ok: boolean; detail: string }>((resolve) =>
    setTimeout(() => resolve({ backend: storageBackend(), ok: false, detail: "Timed out reaching Vercel Blob after 10 seconds." }), 10_000)
  );
  return Promise.race([runSelfTest(), timeout]);
}

async function runSelfTest(): Promise<{ backend: string; ok: boolean; detail: string }> {
  const backend = storageBackend();
  if (backend === "local" && process.env.VERCEL)
    return { backend: "none", ok: false, detail: "No Vercel Blob store is connected to this deployment (no *_READ_WRITE_TOKEN or BLOB_STORE_ID variable found)." };
  try {
    if (backend === "blob") {
      const p = `careers/_selftest-${Date.now()}.txt`;
      // Bounded, so a broken connection shows an error instead of hanging the admin page.
      const abortSignal = AbortSignal.timeout(8000);
      await put(p, "ok", { access: "private", contentType: "text/plain", addRandomSuffix: false, allowOverwrite: true, abortSignal, ...blobAuth() });
      const res = await get(p, { access: "private", useCache: false, abortSignal, ...blobAuth() });
      const text = res?.statusCode === 200 ? await new Response(res.stream).text() : null;
      await del(p, { abortSignal, ...blobAuth() });
      if (text !== "ok") return { backend, ok: false, detail: "Wrote a test file but could not read it back." };
      return { backend, ok: true, detail: "Vercel Blob (private) is connected and working." };
    }
    await ensureDirs();
    const p = path.join(APPLICATIONS_DIR, ".selftest");
    await fs.writeFile(p, "ok");
    await fs.rm(p, { force: true });
    return { backend, ok: true, detail: `Local files in ${DATA_DIR}.` };
  } catch (err) {
    return { backend, ok: false, detail: (err as Error).message };
  }
}

// ——— Admin notifications ———

/** Marks an application as seen, so it stops showing as new. */
export async function markViewed(id: string, by: string) {
  const now = new Date().toISOString();
  await backend().mutate((records) => {
    if (!records.some((r) => r.id === id && !r.viewedAt)) return null;
    return { records: records.map((r) => (r.id === id ? { ...r, viewedAt: now, viewedBy: by } : r)), result: true };
  });
}

/** Marks every unseen application as seen ("Mark all as read"), in one write. */
export async function markAllViewed(by: string) {
  const now = new Date().toISOString();
  return (
    (await backend().mutate((records) => {
      const unseen = records.filter((r) => !r.viewedAt).length;
      if (!unseen) return null;
      return { records: records.map((r) => (r.viewedAt ? r : { ...r, viewedAt: now, viewedBy: by })), result: unseen };
    })) ?? 0
  );
}
