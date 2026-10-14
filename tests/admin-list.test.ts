import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { ApplicationRecord, ApplicationSummary } from "@/lib/careers/config";
import { clearStorageEnv } from "./env";
import { idDaysAgo, record } from "./fixtures";

const auth = vi.hoisted(() => ({ admin: "alice" as string | null }));
vi.mock("@/lib/careers/auth", () => ({ currentAdmin: async () => auth.admin }));

type Route = typeof import("@/app/careers/api/admin/applications/route");
type Storage = typeof import("@/lib/careers/storage");
let route: Route;
let storage: Storage;
let dir: string;

const URL_ = "http://localhost/careers/api/admin/applications";
const get = (etag?: string) => route.GET(new Request(URL_, { headers: etag ? { "If-None-Match": etag } : {} }));
const patch = (ids: string[], status: string) =>
  route.PATCH(new Request(URL_, { method: "PATCH", body: JSON.stringify({ ids, status }), headers: { "Content-Type": "application/json" } }));
const listOf = async (res: Response) => ((await res.json()) as { applications: ApplicationSummary[] }).applications;

const seed = async (records: ApplicationRecord[]) => {
  await fs.mkdir(path.join(dir, "applications"), { recursive: true });
  await fs.writeFile(path.join(dir, "applications", "applications.json"), JSON.stringify(records));
};

beforeAll(async () => {
  clearStorageEnv();
  dir = await fs.mkdtemp(path.join(os.tmpdir(), "careers-list-test-"));
  process.env.CAREERS_DATA_DIR = dir;
  vi.resetModules();
  storage = await import("@/lib/careers/storage");
  route = await import("@/app/careers/api/admin/applications/route");
  expect(storage.storageBackend()).toBe("local");
});

afterAll(async () => {
  await fs.rm(dir, { recursive: true, force: true });
  delete process.env.CAREERS_DATA_DIR;
});

beforeEach(async () => {
  auth.admin = "alice";
  await fs.rm(path.join(dir, "applications"), { recursive: true, force: true });
});

let older: ApplicationRecord;
let newer: ApplicationRecord;
const fixtures = () => {
  older = record({
    id: idDaysAgo(3, "a"),
    submittedAt: "2026-01-01T00:00:00.000Z",
    history: [{ at: "2026-01-01T00:00:00.000Z", by: "system", from: null, to: "applied" }],
    notes: [{ id: "a".repeat(12), at: "2026-01-02T00:00:00.000Z", by: "bob", text: "Private interview note" }],
  });
  newer = record({ id: idDaysAgo(1, "b"), submittedAt: "2026-02-01T00:00:00.000Z" });
  return [older, newer];
};

describe("admin list API", () => {
  it("rejects anyone not signed in, without revealing a version", async () => {
    auth.admin = null;
    const res = await get();
    expect(res.status).toBe(401);
    expect(res.headers.get("ETag")).toBeNull();
  });

  it("lists every application newest first, without history or notes, privately and uncached", async () => {
    await seed(fixtures());
    const res = await get();
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe("private, no-store");
    expect(res.headers.get("ETag")).toMatch(/^"[\w-]+"$/);
    const apps = await listOf(res);
    expect(apps.map((a) => a.id)).toEqual([newer.id, older.id]);
    for (const a of apps) {
      expect(a).not.toHaveProperty("history");
      expect(a).not.toHaveProperty("notes");
    }
    // What the board and the CSV export show is still there.
    expect(apps[1]).toMatchObject({ email: older.email, phone: older.phone, cv: older.cv, status: "applied" });
  });

  it("answers an unchanged poll with an empty 304", async () => {
    await seed(fixtures());
    const etag = (await get()).headers.get("ETag")!;
    const again = await get(etag);
    expect(again.status).toBe(304);
    expect(await again.text()).toBe("");
    expect(again.headers.get("ETag")).toBe(etag);
    expect(again.headers.get("Cache-Control")).toBe("private, no-store");
    // A proxy may have weakened the ETag on the way.
    expect((await get(`W/${etag}`)).status).toBe(304);
  });

  it("matches the version the board's first render was given", async () => {
    await seed(fixtures());
    const { etag } = await storage.readApplicationListPurged();
    expect((await get(etag)).status).toBe(304);
  });

  it("sends the full list again after any change, including another admin's", async () => {
    await seed(fixtures());
    const etag = (await get()).headers.get("ETag")!;
    // Another admin's change: notes aren't listed, but status is.
    await storage.updateStatus([older.id], "interview", "bob");
    const res = await get(etag);
    expect(res.status).toBe(200);
    expect(res.headers.get("ETag")).not.toBe(etag);
    expect((await listOf(res)).find((a) => a.id === older.id)?.status).toBe("interview");
  });

  it("keeps both of two concurrent bulk changes, and the next poll shows both", async () => {
    await seed(fixtures());
    const etag = (await get()).headers.get("ETag")!;
    const [one, two] = await Promise.all([patch([older.id], "reviewing"), patch([newer.id], "rejected")]);
    expect(one.status).toBe(200);
    expect(two.status).toBe(200);
    // The bulk response is summaries too.
    const [moved] = ((await one.json()) as { applications: ApplicationSummary[] }).applications;
    expect(moved).toMatchObject({ id: older.id, status: "reviewing" });
    expect(moved).not.toHaveProperty("history");

    const res = await get(etag);
    expect(res.status).toBe(200);
    const statuses = Object.fromEntries((await listOf(res)).map((a) => [a.id, a.status]));
    expect(statuses).toEqual({ [older.id]: "reviewing", [newer.id]: "rejected" });
    // History is still recorded, only not listed.
    expect((await storage.readApplication(older.id))?.history?.map((h) => h.to)).toEqual(["applied", "reviewing"]);
  });
});

describe("etagMatches", () => {
  it("accepts the same tag, weak or strong, in a list or as *", async () => {
    const { etagMatches } = await import("@/lib/careers/list");
    expect(etagMatches('"abc"', '"abc"')).toBe(true);
    expect(etagMatches('W/"abc"', '"abc"')).toBe(true);
    expect(etagMatches('"x", "abc"', '"abc"')).toBe(true);
    expect(etagMatches("*", '"abc"')).toBe(true);
    expect(etagMatches('"abd"', '"abc"')).toBe(false);
    expect(etagMatches(null, '"abc"')).toBe(false);
  });
});
