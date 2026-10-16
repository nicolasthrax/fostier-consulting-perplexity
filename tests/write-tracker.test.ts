import { describe, expect, it } from "vitest";
import { writeTracker } from "@/lib/careers/write-tracker";

/** A promise with its resolve exposed, to hold a save open. */
function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((r) => (resolve = r));
  return { promise, resolve };
}

describe("writeTracker", () => {
  it("keeps a refresh that overlapped no save", () => {
    const w = writeTracker();
    expect(w.begin()()).toBe(true);
  });

  it("drops a refresh started before a save that then finished", async () => {
    const w = writeTracker();
    const fresh = w.begin();
    await w.track(async () => {});
    expect(fresh()).toBe(false);
  });

  it("drops a refresh that started and ended inside one save", async () => {
    const w = writeTracker();
    const save = deferred();
    const saving = w.track(() => save.promise);
    const fresh = w.begin();
    expect(fresh()).toBe(false);
    save.resolve();
    await saving;
    expect(fresh()).toBe(false);
    expect(w.begin()()).toBe(true);
  });

  it("counts a failed save as finished", async () => {
    const w = writeTracker();
    await expect(w.track(async () => Promise.reject(new Error("offline")))).rejects.toThrow("offline");
    expect(w.begin()()).toBe(true);
  });
});
