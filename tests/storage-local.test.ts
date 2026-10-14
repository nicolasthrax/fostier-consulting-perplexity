import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { ApplicationRecord, DeletionEntry } from "@/lib/careers/config";
import { clearStorageEnv } from "./env";
import { freshId, idDaysAgo, record } from "./fixtures";

type Storage = typeof import("@/lib/careers/storage");
let storage: Storage;
let dir: string;
const dbFile = () => path.join(dir, "applications", "applications.json");
const logFile = () => path.join(dir, "applications", "deletions.json");
const readLog = async () => JSON.parse(await fs.readFile(logFile(), "utf8")) as DeletionEntry[];
const cvPath = (file: string) => path.join(dir, "cvs", file);
const exists = (p: string) => fs.access(p).then(() => true, () => false);

beforeAll(async () => {
  clearStorageEnv();
  dir = await fs.mkdtemp(path.join(os.tmpdir(), "careers-test-"));
  process.env.CAREERS_DATA_DIR = dir;
  vi.resetModules();
  storage = await import("@/lib/careers/storage");
  expect(storage.storageBackend()).toBe("local");
});

afterAll(async () => {
  await fs.rm(dir, { recursive: true, force: true });
  delete process.env.CAREERS_DATA_DIR;
});

beforeEach(async () => {
  // Each test starts from an empty store.
  await fs.rm(path.join(dir, "applications"), { recursive: true, force: true });
  await fs.rm(path.join(dir, "cvs"), { recursive: true, force: true });
});

const add = async (over: Partial<ApplicationRecord> = {}) => {
  const rec = record(over);
  await storage.addApplication(rec, Buffer.from("%PDF"));
  return rec;
};

/** Writes records straight to the database file, bypassing addApplication's purge. */
const seed = async (records: ApplicationRecord[]) => {
  await fs.mkdir(path.dirname(dbFile()), { recursive: true });
  await fs.mkdir(path.join(dir, "cvs"), { recursive: true });
  await fs.writeFile(dbFile(), JSON.stringify(records));
  for (const r of records) if (r.cv) await fs.writeFile(cvPath(r.cv.file), "cv");
};

describe("local storage", () => {
  it("reads back an added application and stores its CV", async () => {
    expect(await storage.readApplications()).toEqual([]);
    const rec = await add();
    expect(await storage.readApplications()).toEqual([rec]);
    expect(await storage.readApplication(rec.id)).toEqual(rec);
    expect((await storage.readCv(rec.cv!.file))?.toString()).toBe("%PDF");
  });

  it("updateStatus records who moved the candidate and returns the updated record", async () => {
    const rec = await add();
    const [updated, ...rest] = await storage.updateStatus([rec.id], "interview", "alice");
    expect(rest).toEqual([]);
    expect(updated.status).toBe("interview");
    expect(updated.history).toEqual([{ at: expect.any(String), by: "alice", from: "applied", to: "interview" }]);
    expect((await storage.readApplication(rec.id))?.status).toBe("interview");
  });

  it("updateStatus to the current status adds no history", async () => {
    const rec = await add({ status: "reviewing" });
    const out = await storage.updateStatus([rec.id], "reviewing", "alice");
    expect(out).toHaveLength(1);
    expect(out[0].status).toBe("reviewing");
    expect(out[0].history ?? []).toEqual([]);
    expect((await storage.readApplication(rec.id))?.history ?? []).toEqual([]);
  });

  it("updateStatus changes several applications at once and leaves others alone", async () => {
    const a = await add();
    const b = await add({ status: "screened" });
    const c = await add();
    const out = await storage.updateStatus([a.id, b.id], "rejected", "bob");
    expect(out.map((r) => r.id).sort()).toEqual([a.id, b.id].sort());
    const all = await storage.readApplications();
    expect(all.find((r) => r.id === a.id)?.history?.at(-1)).toMatchObject({ by: "bob", from: "applied", to: "rejected" });
    expect(all.find((r) => r.id === b.id)?.history?.at(-1)).toMatchObject({ by: "bob", from: "screened", to: "rejected" });
    expect(all.find((r) => r.id === c.id)?.status).toBe("applied");
  });

  it("addNote appends a note, and returns null for an unknown application", async () => {
    const rec = await add();
    const note = await storage.addNote(rec.id, "Strong candidate", "alice");
    expect(note).toMatchObject({ by: "alice", text: "Strong candidate", id: expect.stringMatching(/^[a-f0-9]{12}$/) });
    await storage.addNote(rec.id, "Second", "bob");
    expect((await storage.readApplication(rec.id))?.notes?.map((n) => n.text)).toEqual(["Strong candidate", "Second"]);
    expect(await storage.addNote(freshId(), "x", "alice")).toBeNull();
  });

  it("markViewed sets viewedBy once and leaves other applications new", async () => {
    const a = await add();
    const b = await add();
    await storage.markViewed(a.id, "alice");
    await storage.markViewed(a.id, "bob"); // already seen: unchanged
    expect((await storage.readApplication(a.id))?.viewedBy).toBe("alice");
    expect((await storage.readApplication(b.id))?.viewedAt).toBeUndefined();
  });

  it("deleteApplication removes the record and its CV", async () => {
    const a = await add();
    const b = await add();
    expect(await exists(cvPath(a.cv!.file))).toBe(true);
    expect(await storage.deleteApplication(a.id, "alice")).toBe(true);
    expect((await storage.readApplications()).map((r) => r.id)).toEqual([b.id]);
    expect(await exists(cvPath(a.cv!.file))).toBe(false);
    expect(await exists(cvPath(b.cv!.file))).toBe(true);
    expect(await storage.deleteApplication(a.id, "alice")).toBe(false);
  });

  it("deleteApplications removes several records and their CVs in one write, ignoring unknown ids", async () => {
    const a = await add();
    const b = await add();
    const c = await add();
    const unknown = freshId();
    const writes = vi.spyOn(fs, "rename");
    const deleted = await storage.deleteApplications([a.id, unknown, b.id], "alice");
    // One write of the records, one of the deletion log.
    expect(writes.mock.calls.map(([, to]) => path.basename(String(to)))).toEqual(["applications.json", "deletions.json"]);
    writes.mockRestore();
    expect(deleted.sort()).toEqual([a.id, b.id].sort());
    expect((await storage.readApplications()).map((r) => r.id)).toEqual([c.id]);
    expect(await exists(cvPath(a.cv!.file))).toBe(false);
    expect(await exists(cvPath(b.cv!.file))).toBe(false);
    expect(await exists(cvPath(c.cv!.file))).toBe(true);
  });

  it("deleteApplications with no matching id writes nothing", async () => {
    const a = await add();
    const writes = vi.spyOn(fs, "rename");
    expect(await storage.deleteApplications([freshId(), freshId()], "alice")).toEqual([]);
    expect(writes).not.toHaveBeenCalled();
    writes.mockRestore();
    expect(await exists(logFile())).toBe(false);
    expect((await storage.readApplications()).map((r) => r.id)).toEqual([a.id]);
    expect(await exists(cvPath(a.cv!.file))).toBe(true);
  });

  it("isExpired: past the retention period unless offered or hired", () => {
    expect(storage.isExpired(record({ id: idDaysAgo(400) }))).toBe(true);
    expect(storage.isExpired(record({ id: idDaysAgo(400), status: "rejected" }))).toBe(true);
    expect(storage.isExpired(record({ id: idDaysAgo(400), status: "offer" }))).toBe(false);
    expect(storage.isExpired(record({ id: idDaysAgo(400), status: "hired" }))).toBe(false);
    expect(storage.isExpired(record({ id: idDaysAgo(300) }))).toBe(false);
    expect(storage.isExpired(record({ id: idDaysAgo(300) }), Date.now() + 100 * 86_400_000)).toBe(true);
  });

  it("purgeExpired deletes old applications and their CVs, keeping offers and hires", async () => {
    const old = record({ id: idDaysAgo(400, "a") });
    const offer = record({ id: idDaysAgo(400, "b"), status: "offer" });
    const hired = record({ id: idDaysAgo(400, "c"), status: "hired" });
    const recent = record({ id: idDaysAgo(10, "d") });
    await seed([old, offer, hired, recent]);
    for (const r of [old, offer, hired, recent]) expect(storage.isSafeId(r.id)).toBe(true);

    expect(await storage.purgeExpired()).toBe(1);
    expect((await storage.readApplications()).map((r) => r.id).sort()).toEqual([offer.id, hired.id, recent.id].sort());
    expect(await exists(cvPath(old.cv!.file))).toBe(false);
    expect(await exists(cvPath(offer.cv!.file))).toBe(true);
    expect(await storage.purgeExpired()).toBe(0);
  });

  it("readApplicationListPurged lists what's left after the purge, newest first, and the purge is saved", async () => {
    const old = record({ id: idDaysAgo(400, "a") });
    const hired = record({ id: idDaysAgo(400, "b"), status: "hired" });
    const recent = record({ id: idDaysAgo(10, "c") });
    await seed([old, hired, recent]);

    const first = await storage.readApplicationListPurged();
    expect(first.applications.map((r) => r.id).sort()).toEqual([hired.id, recent.id].sort());
    expect((await storage.readApplications()).map((r) => r.id).sort()).toEqual([hired.id, recent.id].sort());
    expect(await exists(cvPath(old.cv!.file))).toBe(false);
    // Nothing left to purge: the same list, and the same version as the API reports.
    const again = await storage.readApplicationListPurged();
    expect(again).toEqual(first);
    expect((await storage.readApplicationList()).etag).toBe(first.etag);
  });

  it("addApplication drops expired applications and their CVs in the same write", async () => {
    const old = record({ id: idDaysAgo(400, "e") });
    const hired = record({ id: idDaysAgo(400, "f"), status: "hired" });
    await seed([old, hired]);
    const rec = await add();
    expect((await storage.readApplications()).map((r) => r.id).sort()).toEqual([hired.id, rec.id].sort());
    expect(await exists(cvPath(old.cv!.file))).toBe(false);
  });

  it("deleteApplications logs who deleted what, with no candidate data", async () => {
    const a = await add({ status: "interview" });
    const b = await add();
    await storage.deleteApplications([a.id, b.id], "alice");
    const log = await readLog();
    expect(log).toHaveLength(2);
    expect(log.find((e) => e.id === a.id)).toEqual({
      at: expect.any(String),
      by: "alice",
      reason: "admin",
      id: a.id,
      jobTitle: a.jobTitle,
      submittedAt: a.submittedAt,
      status: "interview",
    });
    const text = await fs.readFile(logFile(), "utf8");
    for (const personal of [a.fullName, a.email, a.phone, a.university, a.cv!.originalName]) expect(text).not.toContain(personal);
    if (process.platform !== "win32") expect((await fs.stat(logFile())).mode & 0o777).toBe(0o600);

    // Newest first, and each later batch appends.
    const c = await add();
    await new Promise((r) => setTimeout(r, 5));
    expect(await storage.deleteApplication(c.id, "bob")).toBe(true);
    const read = await storage.readDeletionLog();
    expect(read.map((e) => e.by)).toEqual(["bob", "alice", "alice"]);
    expect(read[0].id).toBe(c.id);
  });

  it("retention purges log a \"system\" entry, and only when something expired", async () => {
    const old = record({ id: idDaysAgo(400, "a"), status: "rejected" });
    const recent = record({ id: idDaysAgo(10, "b") });
    await seed([old, recent]);
    expect(await storage.purgeExpired()).toBe(1);
    expect(await readLog()).toEqual([
      { at: expect.any(String), by: "system", reason: "retention", id: old.id, jobTitle: old.jobTitle, submittedAt: old.submittedAt, status: "rejected" },
    ]);
    const writes = vi.spyOn(fs, "rename");
    expect(await storage.purgeExpired()).toBe(0);
    await storage.readApplicationListPurged();
    expect(writes).not.toHaveBeenCalled();
    writes.mockRestore();
    expect(await readLog()).toHaveLength(1);
  });

  it("readApplicationListPurged and addApplication log what they purge", async () => {
    const first = record({ id: idDaysAgo(400, "a") });
    await seed([first]);
    await storage.readApplicationListPurged();
    expect((await readLog()).map((e) => [e.id, e.reason, e.by])).toEqual([[first.id, "retention", "system"]]);

    const second = record({ id: idDaysAgo(400, "b") });
    await seed([second]);
    await add();
    expect((await readLog()).map((e) => e.id)).toEqual([first.id, second.id]);
  });

  it("a failed log write doesn't stop or undo the deletion", async () => {
    const a = await add();
    const realRename = fs.rename.bind(fs);
    const rename = vi.spyOn(fs, "rename").mockImplementation(async (from, to) => {
      if (String(to).endsWith("deletions.json")) throw new Error("disk full");
      return realRename(from, to);
    });
    const logged = vi.spyOn(console, "error").mockImplementation(() => undefined);
    try {
      expect(await storage.deleteApplications([a.id], "alice")).toEqual([a.id]);
      expect(logged).toHaveBeenCalledWith(expect.stringContaining(a.id), "disk full");
    } finally {
      rename.mockRestore();
      logged.mockRestore();
    }
    expect(await storage.readApplications()).toEqual([]);
    expect(await exists(cvPath(a.cv!.file))).toBe(false);
  });

  it("the log drops entries older than two years when it is written", async () => {
    const day = 86_400_000;
    const entry = (daysAgo: number, id: string): DeletionEntry => ({
      at: new Date(Date.now() - daysAgo * day).toISOString(),
      by: "alice",
      reason: "admin",
      id,
      jobTitle: "Job",
      submittedAt: "2024-01-01T00:00:00.000Z",
      status: "applied",
    });
    const tooOld = idDaysAgo(900, "a");
    const kept = idDaysAgo(800, "b");
    await fs.mkdir(path.dirname(logFile()), { recursive: true });
    await fs.writeFile(logFile(), JSON.stringify([entry(731, tooOld), entry(700, kept)]));
    const rec = await add();
    await storage.deleteApplication(rec.id, "bob");
    expect((await readLog()).map((e) => e.id)).toEqual([kept, rec.id]);
  });
});
