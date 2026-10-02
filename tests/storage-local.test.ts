import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { ApplicationRecord } from "@/lib/careers/config";
import { clearStorageEnv } from "./env";
import { freshId, idDaysAgo, record } from "./fixtures";

type Storage = typeof import("@/lib/careers/storage");
let storage: Storage;
let dir: string;
const dbFile = () => path.join(dir, "applications", "applications.json");
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
    expect(await storage.deleteApplication(a.id)).toBe(true);
    expect((await storage.readApplications()).map((r) => r.id)).toEqual([b.id]);
    expect(await exists(cvPath(a.cv!.file))).toBe(false);
    expect(await exists(cvPath(b.cv!.file))).toBe(true);
    expect(await storage.deleteApplication(a.id)).toBe(false);
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

  it("readApplicationsPurged returns what's left after the purge, and the purge is saved", async () => {
    const old = record({ id: idDaysAgo(400, "a") });
    const hired = record({ id: idDaysAgo(400, "b"), status: "hired" });
    const recent = record({ id: idDaysAgo(10, "c") });
    await seed([old, hired, recent]);

    expect((await storage.readApplicationsPurged()).map((r) => r.id).sort()).toEqual([hired.id, recent.id].sort());
    expect((await storage.readApplications()).map((r) => r.id).sort()).toEqual([hired.id, recent.id].sort());
    expect(await exists(cvPath(old.cv!.file))).toBe(false);
    // Nothing left to purge: the same records, unchanged.
    expect((await storage.readApplicationsPurged()).map((r) => r.id).sort()).toEqual([hired.id, recent.id].sort());
  });

  it("addApplication drops expired applications and their CVs in the same write", async () => {
    const old = record({ id: idDaysAgo(400, "e") });
    const hired = record({ id: idDaysAgo(400, "f"), status: "hired" });
    await seed([old, hired]);
    const rec = await add();
    expect((await storage.readApplications()).map((r) => r.id).sort()).toEqual([hired.id, rec.id].sort());
    expect(await exists(cvPath(old.cv!.file))).toBe(false);
  });
});
