import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { RETENTION_DAYS, type ApplicationRecord, type Stage } from "./config";

/**
 * Local-first storage: one JSON file of records plus a folder of CV files,
 * both under DATA_DIR (default ./data, git-ignored). Server code only.
 */
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

export async function readApplications(): Promise<ApplicationRecord[]> {
  try {
    return JSON.parse(await fs.readFile(DB_FILE, "utf8")) as ApplicationRecord[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function writeApplications(records: ApplicationRecord[]) {
  await ensureDirs();
  // Write then rename, so a crash never leaves a half-written database.
  const tmp = `${DB_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(records, null, 2), { mode: 0o600 });
  await fs.rename(tmp, DB_FILE);
}

export const newId = () => `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}`;

/** IDs are generated here, so anything else is rejected before it can reach a file path. */
const SAFE_ID = /^[a-z0-9]+-[a-f0-9]{12}$/;
export const isSafeId = (id: string) => SAFE_ID.test(id);

export async function saveCv(id: string, ext: string, data: Buffer): Promise<string> {
  await ensureDirs();
  const file = `${id}.${ext}`;
  await fs.writeFile(path.join(CV_DIR, file), data, { mode: 0o600 });
  return file;
}

export async function readCv(file: string): Promise<Buffer> {
  // `file` comes from the database, but guard against traversal anyway.
  const full = path.join(CV_DIR, path.basename(file));
  return fs.readFile(full);
}

export function addApplication(record: ApplicationRecord) {
  return withLock(async () => {
    const all = await readApplications();
    all.push(record);
    await writeApplications(all);
  });
}

export function updateStatus(id: string, status: Stage) {
  return withLock(async () => {
    const all = await readApplications();
    const rec = all.find((r) => r.id === id);
    if (!rec) return null;
    rec.status = status;
    rec.updatedAt = new Date().toISOString();
    await writeApplications(all);
    return rec;
  });
}

async function removeCv(rec: ApplicationRecord) {
  if (!rec.cv) return;
  await fs.rm(path.join(CV_DIR, path.basename(rec.cv.file)), { force: true });
}

/** Deletes one application and its CV (withdrawal or erasure request). */
export function deleteApplication(id: string) {
  return withLock(async () => {
    const all = await readApplications();
    const rec = all.find((r) => r.id === id);
    if (!rec) return false;
    await removeCv(rec);
    await writeApplications(all.filter((r) => r.id !== id));
    return true;
  });
}

/**
 * Enforces the retention period promised in the candidate privacy notice: deletes
 * applications (and CVs) submitted more than RETENTION_DAYS ago. Runs on each new
 * submission and each admin page load, so no scheduler is needed.
 */
export function purgeExpired(now = Date.now()) {
  return withLock(async () => {
    const all = await readApplications();
    const cutoff = now - RETENTION_DAYS * 24 * 60 * 60 * 1000;
    const expired = all.filter((r) => Date.parse(r.submittedAt) < cutoff);
    if (!expired.length) return 0;
    for (const rec of expired) await removeCv(rec);
    await writeApplications(all.filter((r) => !expired.includes(r)));
    return expired.length;
  });
}
