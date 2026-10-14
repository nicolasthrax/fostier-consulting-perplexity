/**
 * Synthetic read/write costs of the careers store at growing sizes, against an
 * in-memory stand-in for Vercel Blob (no network, so these are CPU and payload
 * figures, not production latencies). Run with `npm run bench:careers`.
 */
import { gzipSync } from "node:zlib";
import { it, vi } from "vitest";
import type { ApplicationRecord } from "@/lib/careers/config";

const fake = vi.hoisted(() => {
  class BlobPreconditionFailedError extends Error {}
  const store = new Map<string, { text: string; etag: string }>();
  let n = 0;
  return {
    BlobPreconditionFailedError, store,
    put: async (p: string, body: string | Buffer, o: { ifMatch?: string }) => {
      const e = store.get(p);
      if (o.ifMatch !== undefined && e?.etag !== o.ifMatch) throw new BlobPreconditionFailedError();
      const etag = `"e${++n}"`;
      store.set(p, { text: typeof body === "string" ? body : body.toString(), etag });
      return { pathname: p, etag };
    },
    get: async (p: string, o: { ifNoneMatch?: string }) => {
      const b = store.get(p);
      if (!b) return null;
      if (o.ifNoneMatch === b.etag) return { statusCode: 304, stream: null, blob: { etag: b.etag } };
      return { statusCode: 200, stream: new Response(b.text).body, blob: { etag: b.etag } };
    },
  };
});
vi.mock("@vercel/blob", () => ({ BlobPreconditionFailedError: fake.BlobPreconditionFailedError, put: fake.put, get: fake.get, list: async () => ({ blobs: [], hasMore: false }), del: async () => {} }));

const rec = (i: number): ApplicationRecord => {
  const id = `${(Date.now() - i * 60_000).toString(36)}-${i.toString(16).padStart(12, "0")}`;
  const at = new Date(Date.now() - i * 60_000).toISOString();
  return {
    fullName: `Candidate ${i}`, email: `c${i % Math.max(1, Math.floor(i / 3) + 1)}@example.com`, phone: "+852 6123 4567",
    linkedinUrl: "https://www.linkedin.com/in/someone-" + i, portfolioUrl: "", workAuthorization: "hk-permanent", commissionOnly: "yes",
    adult: "yes", university: "The University of Hong Kong", id, lang: "en", jobSlug: i % 2 ? "financial-consultant" : "private-client-acquisition",
    jobTitle: "Financial consultant (internship)", submittedAt: at, updatedAt: at, status: (["applied", "screening", "interview", "rejected"] as const)[i % 4],
    knockouts: [], cv: { file: `${id}.pdf`, originalName: "My CV 2026.pdf", size: 240_000, type: "application/pdf" },
    viewedAt: i % 3 ? at : undefined, viewedBy: i % 3 ? "lucie" : undefined,
    history: [{ at, by: "system", from: null, to: "applied" }, { at, by: "lucie", from: "applied", to: "screening" }, { at, by: "nicolas", from: "screening", to: "interview" }],
    notes: [{ id: "a1b2c3d4e5f6", at, by: "lucie", text: "Called, strong motivation, available from June. Follow up after the interview with the second partner." }, { id: "f6e5d4c3b2a1", at, by: "nicolas", text: "Asked for references." }],
  } as ApplicationRecord;
};

const time = async (fn: () => Promise<unknown> | unknown, runs = 5) => {
  await fn();
  const t: number[] = [];
  for (let i = 0; i < runs; i++) { const s = performance.now(); await fn(); t.push(performance.now() - s); }
  return +(t.sort((a, b) => a - b)[Math.floor(runs / 2)]).toFixed(2);
};
const kb = (s: string) => `${(Buffer.byteLength(s) / 1024).toFixed(0)}/${(gzipSync(s).length / 1024).toFixed(0)}gz`;

it("synthetic careers store", async () => {
  process.env.BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_test";
  const rows: Record<string, unknown>[] = [];
  let flips = 0;
  for (const N of [100, 1_000, 5_000, 20_000]) {
    vi.resetModules();
    fake.store.clear();
    const all = Array.from({ length: N }, (_, i) => rec(i));
    fake.store.set("careers/index.json", { text: JSON.stringify(all), etag: '"seed"' });
    const s = await import("@/lib/careers/storage");
    // Present once the board lists summaries; absent on older code, so this runs on either.
    const config = (await import("@/lib/careers/config")) as { toSummary?: (r: ApplicationRecord) => unknown };
    const target = all[Math.floor(N / 2)].id;
    await s.readApplications(); // warm cache
    const fullList = JSON.stringify({ applications: await s.readApplications() });
    const sumList = config.toSummary ? JSON.stringify({ applications: (await s.readApplications()).map(config.toSummary) }) : "";
    rows.push({
      N,
      "index KB/gz": kb(fake.store.get("careers/index.json")!.text),
      "readAll 304 ms": await time(() => s.readApplications()),
      "readOne 304 ms": await time(() => s.readApplication(target)),
      "list API 304 ms": "readApplicationList" in s ? await time(() => (s as { readApplicationList: () => Promise<unknown> }).readApplicationList()) : "-",
      // Alternates, so every run really writes the index.
      "updateStatus ms": await time(() => s.updateStatus([target], ++flips % 2 ? "offer" : "interview", "bench")),
      "list API KB/gz full": kb(fullList),
      "list API KB/gz summary": sumList ? kb(sumList) : "-",
    });
  }
  console.table(rows);
});
