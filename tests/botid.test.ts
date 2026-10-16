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
    expect(await blockedAsBot("apply")).toBe(false);
    expect(checkBotId).not.toHaveBeenCalled();
  });

  it("on Vercel, blocks what BotID calls a bot", async () => {
    vi.stubEnv("VERCEL", "1");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    checkBotId.mockResolvedValue({ isBot: true });
    expect(await blockedAsBot("apply")).toBe(true);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("BotID blocked a request to apply"));
    checkBotId.mockResolvedValue({ isBot: false });
    expect(await blockedAsBot("login")).toBe(false);
  });

  it("on Vercel, lets the request through and logs when the check fails", async () => {
    vi.stubEnv("VERCEL", "1");
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    checkBotId.mockRejectedValue(new Error("The 'x-vercel-oidc-token' header is missing"));
    expect(await blockedAsBot("login")).toBe(false);
    expect(error).toHaveBeenCalledWith(expect.stringContaining("BotID check failed for login"), expect.any(String));
  });
});
