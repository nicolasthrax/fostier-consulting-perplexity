import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { record } from "./fixtures";

const storage = vi.hoisted(() => ({
  available: true,
  addApplication: vi.fn(async () => undefined),
}));
vi.mock("@/lib/careers/storage", () => ({
  storageAvailable: () => storage.available,
  addApplication: storage.addApplication,
}));

import { BACKUP_RETRY_MS, deliverApplication } from "@/lib/careers/deliver";

const CV_BYTES = Buffer.from("%PDF-1.7 synthetic test cv, not a real candidate");
const CV_BASE64 = CV_BYTES.toString("base64");
const cv = { name: "cv.pdf", type: "application/pdf", data: CV_BYTES };
const SECRET = "test-webhook-secret";

const fetchMock = vi.fn<typeof fetch>();
let deferred: (() => Promise<unknown>)[];
const defer = (task: () => Promise<unknown>) => void deferred.push(task);
let errors: ReturnType<typeof vi.spyOn>;

const ok = () => new Response("ok", { status: 200 });
const status = (code: number) => new Response("no", { status: code });
/** A webhook that only answers when told to. */
function slowWebhook() {
  let answer!: (r: Response) => void;
  fetchMock.mockImplementationOnce(() => new Promise<Response>((r) => (answer = r)));
  return () => answer(ok());
}

beforeEach(() => {
  storage.available = true;
  storage.addApplication.mockReset().mockResolvedValue(undefined);
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  process.env.CAREERS_WEBHOOK_URL = "https://webhook.test/hook";
  process.env.CAREERS_WEBHOOK_SECRET = SECRET;
  deferred = [];
  errors = vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
  delete process.env.CAREERS_WEBHOOK_URL;
  delete process.env.CAREERS_WEBHOOK_SECRET;
  errors.mockRestore();
});

/** Nothing logged may contain the CV or the webhook secret. */
const expectCleanLogs = () => {
  const logged = JSON.stringify(errors.mock.calls);
  expect(logged).not.toContain(CV_BASE64);
  expect(logged).not.toContain(SECRET);
};

describe("deliverApplication", () => {
  it("primary saved + slow webhook: succeeds without waiting, the backup runs after the response", async () => {
    const answer = slowWebhook();
    const rec = record();
    expect(await deliverApplication(rec, cv, defer)).toBe(true);
    expect(storage.addApplication).toHaveBeenCalledWith(rec, CV_BYTES);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(deferred).toHaveLength(1);

    const backup = deferred[0]();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0];
    expect(new Headers(init!.headers).get("Idempotency-Key")).toBe(rec.id);
    expect(JSON.parse(String(init!.body)).application.id).toBe(rec.id);
    answer();
    expect(await backup).toBe(true);
    expect(errors).not.toHaveBeenCalled();
  });

  it("primary saved + failing webhook: still succeeds; the failure is logged with the reference only", async () => {
    fetchMock.mockResolvedValue(status(500));
    const rec = record();
    expect(await deliverApplication(rec, cv, defer)).toBe(true);
    expect(await deferred[0]()).toBe(false);
    // A 500 may have been processed, so it isn't retried (no duplicate copy).
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(errors).toHaveBeenCalledTimes(1);
    expect(String(errors.mock.calls[0][0])).toContain(`webhook backup failed for ${rec.id}`);
    expectCleanLogs();
  });

  it("retries a backup once when the endpoint certainly didn't get it (503, then success)", async () => {
    vi.useFakeTimers();
    fetchMock.mockResolvedValueOnce(status(503)).mockResolvedValueOnce(ok());
    expect(await deliverApplication(record(), cv, defer)).toBe(true);
    const backup = deferred[0]();
    await vi.advanceTimersByTimeAsync(BACKUP_RETRY_MS);
    expect(await backup).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(errors).not.toHaveBeenCalled();
  });

  it("gives up after the one retry, and doesn't retry a timeout", async () => {
    vi.useFakeTimers();
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));
    expect(await deliverApplication(record(), cv, defer)).toBe(true);
    const backup = deferred[0]();
    await vi.advanceTimersByTimeAsync(BACKUP_RETRY_MS);
    expect(await backup).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(2);

    fetchMock.mockReset().mockRejectedValue(new DOMException("The operation timed out.", "TimeoutError"));
    expect(await deliverApplication(record(), cv, defer)).toBe(true);
    expect(await deferred[1]()).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectCleanLogs();
  });

  it("primary failed + webhook ok: waits for the webhook, which is then the only copy", async () => {
    storage.addApplication.mockRejectedValue(new Error("Blob unavailable"));
    fetchMock.mockResolvedValue(ok());
    expect(await deliverApplication(record(), cv, defer)).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(deferred).toHaveLength(0);
    expectCleanLogs();
  });

  it("no primary storage + webhook ok: waits for the webhook", async () => {
    storage.available = false;
    fetchMock.mockResolvedValue(ok());
    expect(await deliverApplication(record(), cv, defer)).toBe(true);
    expect(storage.addApplication).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(deferred).toHaveLength(0);
  });

  it("both fail: reports failure, so the candidate is never told it worked", async () => {
    storage.addApplication.mockRejectedValue(new Error("Blob unavailable"));
    fetchMock.mockResolvedValue(status(500));
    expect(await deliverApplication(record(), cv, defer)).toBe(false);
    expect(deferred).toHaveLength(0);
    expectCleanLogs();
  });

  it("webhook disabled: the result is primary storage's alone", async () => {
    delete process.env.CAREERS_WEBHOOK_URL;
    expect(await deliverApplication(record(), cv, defer)).toBe(true);
    storage.addApplication.mockRejectedValue(new Error("Blob unavailable"));
    expect(await deliverApplication(record(), cv, defer)).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(deferred).toHaveLength(0);
  });
});
