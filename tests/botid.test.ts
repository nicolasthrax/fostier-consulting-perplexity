import { afterEach, describe, expect, it, vi } from "vitest";

const checkBotId = vi.fn();
vi.mock("botid/server", () => ({ checkBotId: () => checkBotId() }));

const { blockedAsBot } = await import("@/lib/careers/botid");

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  checkBotId.mockReset();
});

describe("blockedAsBot", () => {
  it("skips the check off Vercel, where BotID can't run", async () => {
    vi.stubEnv("VERCEL", "");
    expect(await blockedAsBot("apply", "block")).toBe(false);
    expect(checkBotId).not.toHaveBeenCalled();
  });

  it("on Vercel, blocks what BotID calls a bot", async () => {
    vi.stubEnv("VERCEL", "1");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    checkBotId.mockResolvedValue({ isBot: true });
    expect(await blockedAsBot("apply", "block")).toBe(true);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("BotID blocked a request to apply"));
    checkBotId.mockResolvedValue({ isBot: false });
    expect(await blockedAsBot("login", "allow")).toBe(false);
  });

  it("on Vercel, a failed check follows the route's onError, and is logged", async () => {
    vi.stubEnv("VERCEL", "1");
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    checkBotId.mockRejectedValue(new Error("Unexpected token '<' in JSON"));
    expect(await blockedAsBot("apply", "block")).toBe(true);
    expect(error).toHaveBeenLastCalledWith(expect.stringContaining("BotID check failed for apply; the request was refused"), expect.any(String));
    expect(await blockedAsBot("login", "allow")).toBe(false);
    expect(error).toHaveBeenLastCalledWith(expect.stringContaining("BotID check failed for login; the request was let through"), expect.any(String));
  });
});
