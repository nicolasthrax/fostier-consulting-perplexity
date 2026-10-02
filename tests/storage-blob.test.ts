import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ApplicationRecord } from "@/lib/careers/config";
import { clearStorageEnv } from "./env";
import { idDaysAgo, record } from "./fixtures";

/** In-memory stand-in for a private Vercel Blob store, with ETags and conditional writes. */
const fake = vi.hoisted(() => {
  class BlobPreconditionFailedError extends Error {
    constructor() {
      super("Precondition failed: ETag mismatch.");
      this.name = "BlobPreconditionFailedError";
    }
  }
  const store = new Map<string, { text: string; etag: string }>();
  let n = 0;
  const nextEtag = () => `"etag-${++n}"`;
  const state = {
    BlobPreconditionFailedError,
    store,
    /** Runs once just before the next put of this pathname is checked, to simulate a concurrent writer. */
    beforePut: null as null | ((pathname: string) => void),
    write(pathname: string, text: string) {
      const etag = nextEtag();
      store.set(pathname, { text, etag });
      return etag;
    },
    put: vi.fn(async (pathname: string, body: string | Buffer, opts: { allowOverwrite?: boolean; ifMatch?: string }) => {
      const hook = state.beforePut;
      if (hook) {
        state.beforePut = null;
        hook(pathname);
      }
      const existing = store.get(pathname);
      if (opts.ifMatch !== undefined && existing?.etag !== opts.ifMatch) throw new BlobPreconditionFailedError();
      if (opts.allowOverwrite === false && existing) throw new Error("This blob already exists");
      const etag = state.write(pathname, typeof body === "string" ? body : body.toString());
      return { pathname, etag, url: `https://blob.test/${pathname}` };
    }),
    get: vi.fn(async (pathname: string, opts: { ifNoneMatch?: string }) => {
      const b = store.get(pathname);
      if (!b) return null;
      if (opts.ifNoneMatch !== undefined && opts.ifNoneMatch === b.etag)
        return { statusCode: 304, stream: null, blob: { etag: b.etag, pathname } };
      return {
        statusCode: 200,
        stream: new Response(b.text).body as ReadableStream<Uint8Array>,
        blob: { etag: b.etag, pathname, size: b.text.length },
      };
    }),
    list: vi.fn(async (opts: { prefix?: string }) => ({
      blobs: [...store.keys()].filter((k) => k.startsWith(opts.prefix ?? "")).map((pathname) => ({ pathname })),
      hasMore: false,
      cursor: undefined,
    })),
    del: vi.fn(async (paths: string | string[]) => {
      for (const p of [paths].flat()) store.delete(p);
    }),
  };
  return state;
});

vi.mock("@vercel/blob", () => ({
  BlobPreconditionFailedError: fake.BlobPreconditionFailedError,
  put: fake.put,
  get: fake.get,
  list: fake.list,
  del: fake.del,
}));

const INDEX = "careers/index.json";
type Storage = typeof import("@/lib/careers/storage");
let storage: Storage;

const index = () => JSON.parse(fake.store.get(INDEX)!.text) as ApplicationRecord[];
const indexPuts = () => fake.put.mock.calls.filter(([p]) => p === INDEX);

beforeEach(async () => {
  clearStorageEnv();
  process.env.BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_test";
  fake.store.clear();
  fake.beforePut = null;
  vi.clearAllMocks();
  // Fresh module per test, so its in-memory index cache starts empty.
  vi.resetModules();
  storage = await import("@/lib/careers/storage");
  expect(storage.storageBackend()).toBe("blob");
});

describe("Blob storage", () => {
  it("migrates legacy per-application blobs into the index on first read, then deletes them", async () => {
    const a = record({ id: idDaysAgo(1, "a") });
    const b = record({ id: idDaysAgo(2, "b") });
    fake.write(`careers/apps/${a.id}.json`, JSON.stringify(a));
    fake.write(`careers/apps/${b.id}.json`, JSON.stringify(b));

    const all = await storage.readApplications();
    expect(all.map((r) => r.id).sort()).toEqual([a.id, b.id].sort());
    expect(index().map((r) => r.id).sort()).toEqual([a.id, b.id].sort());
    expect([...fake.store.keys()].filter((k) => k.startsWith("careers/apps/"))).toEqual([]);
    // Once each for legacy records and CVs, only on this first read.
    expect(fake.list).toHaveBeenCalledTimes(2);
  });

  it("deletes CVs no record points to while migrating, but not ones young enough to be mid-save", async () => {
    const kept = record({ id: idDaysAgo(1, "a") });
    fake.write(`careers/apps/${kept.id}.json`, JSON.stringify(kept));
    fake.write(`careers/cvs/${kept.cv!.file}`, "%PDF-");
    const orphan = `careers/cvs/${idDaysAgo(3, "d")}.pdf`;
    fake.write(orphan, "%PDF-");
    const inFlight = `careers/cvs/${Date.now().toString(36)}-${"e".repeat(12)}.pdf`;
    fake.write(inFlight, "%PDF-");

    await storage.readApplications();
    expect(fake.store.has(`careers/cvs/${kept.cv!.file}`)).toBe(true);
    expect(fake.store.has(orphan)).toBe(false);
    expect(fake.store.has(inFlight)).toBe(true);
  });

  it("creates an empty index on a fresh store", async () => {
    expect(await storage.readApplications()).toEqual([]);
    expect(index()).toEqual([]);
  });

  it("later reads never list and only re-download the index when its ETag changed", async () => {
    await storage.readApplications();
    const etag = fake.store.get(INDEX)!.etag;
    fake.get.mockClear();

    fake.list.mockClear();

    expect(await storage.readApplications()).toEqual([]);
    expect(await storage.readApplications()).toEqual([]);
    expect(fake.list).not.toHaveBeenCalled();
    const indexGets = fake.get.mock.calls.filter(([p]) => p === INDEX);
    expect(indexGets).toHaveLength(2);
    for (const [, opts] of indexGets) expect(opts).toMatchObject({ ifNoneMatch: etag });
    const results = await Promise.all(fake.get.mock.results.map((r) => r.value));
    expect(results.every((r) => r?.statusCode === 304)).toBe(true);

    // Someone else writes the index: the next read picks it up.
    const other = record({ id: idDaysAgo(1, "c") });
    fake.write(INDEX, JSON.stringify([other]));
    expect((await storage.readApplications()).map((r) => r.id)).toEqual([other.id]);
    expect(fake.list).not.toHaveBeenCalled();
  });

  it("returns copies, so callers can't corrupt the cached index", async () => {
    await storage.addApplication(record({ id: idDaysAgo(1, "d") }), Buffer.from("%PDF"));
    const first = await storage.readApplications();
    first[0].status = "hired";
    expect((await storage.readApplications())[0].status).toBe("applied");
  });

  it("retries a write that lost a race, keeping both changes", async () => {
    const a = record({ id: idDaysAgo(1, "a") });
    const b = record({ id: idDaysAgo(1, "b") });
    fake.write(INDEX, JSON.stringify([a, b]));
    await storage.readApplications();

    // Between this mutate's load and its put, another admin adds a note to b.
    fake.beforePut = (pathname) => {
      expect(pathname).toBe(INDEX);
      const now = index();
      now[1] = { ...now[1], notes: [{ id: "f".repeat(12), at: "2026-01-01T00:00:00Z", by: "bob", text: "From bob" }] };
      fake.write(INDEX, JSON.stringify(now));
    };
    const out = await storage.updateStatus([a.id], "interview", "alice");
    expect(out.map((r) => r.status)).toEqual(["interview"]);

    expect(indexPuts()).toHaveLength(2);
    const saved = index();
    expect(saved.find((r) => r.id === a.id)?.status).toBe("interview");
    expect(saved.find((r) => r.id === b.id)?.notes?.map((n) => n.text)).toEqual(["From bob"]);
    // And this instance sees the merged result too.
    expect((await storage.readApplication(b.id))?.notes).toHaveLength(1);
  });

  it("purge with nothing expired writes nothing", async () => {
    fake.write(INDEX, JSON.stringify([record({ id: idDaysAgo(10, "a") }), record({ id: idDaysAgo(400, "b"), status: "hired" })]));
    expect(await storage.purgeExpired()).toBe(0);
    expect(fake.put).not.toHaveBeenCalled();
    expect(fake.del).not.toHaveBeenCalled();
  });

  it("purge deletes expired records and their CV blobs", async () => {
    const old = record({ id: idDaysAgo(400, "a") });
    const recent = record({ id: idDaysAgo(10, "b") });
    fake.write(INDEX, JSON.stringify([old, recent]));
    fake.write(`careers/cvs/${old.cv!.file}`, "cv");
    fake.write(`careers/cvs/${recent.cv!.file}`, "cv");

    expect(await storage.purgeExpired()).toBe(1);
    expect(index().map((r) => r.id)).toEqual([recent.id]);
    expect(fake.store.has(`careers/cvs/${old.cv!.file}`)).toBe(false);
    expect(fake.store.has(`careers/cvs/${recent.cv!.file}`)).toBe(true);
  });

  it("addApplication stores the CV blob and appends the record", async () => {
    const rec = record({ id: idDaysAgo(0, "a") });
    await storage.addApplication(rec, Buffer.from("%PDF"));
    expect(fake.store.get(`careers/cvs/${rec.cv!.file}`)?.text).toBe("%PDF");
    expect(index()).toEqual([rec]);
    expect((await storage.readCv(rec.cv!.file))?.toString()).toBe("%PDF");
  });
});
