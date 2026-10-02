import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { adminUsers, checkLogin, createSessionToken, namedLogins, verifyToken } from "@/lib/careers/auth";

const setUsers = (users: Record<string, unknown> | string | undefined, shared?: string) => {
  if (users === undefined) delete process.env.CAREERS_ADMIN_USERS;
  else process.env.CAREERS_ADMIN_USERS = typeof users === "string" ? users : JSON.stringify(users);
  if (shared === undefined) delete process.env.CAREERS_ADMIN_PASSWORD;
  else process.env.CAREERS_ADMIN_PASSWORD = shared;
};

beforeEach(() => setUsers(undefined));
afterEach(() => {
  setUsers(undefined);
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("adminUsers", () => {
  it("is empty with nothing configured", () => {
    expect(adminUsers().size).toBe(0);
    expect(namedLogins()).toBe(false);
  });

  it("parses named logins, lowercasing names and ignoring short passwords", () => {
    setUsers({ Nicolas: "long-enough-1", alex: "short", Sam: 12345678 });
    expect([...adminUsers()]).toEqual([["nicolas", "long-enough-1"]]);
  });

  it("ignores invalid JSON", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    setUsers("{not json", "shared-password");
    expect([...adminUsers()]).toEqual([["admin", "shared-password"]]);
  });

  it("adds the shared admin from CAREERS_ADMIN_PASSWORD when 8+ characters", () => {
    setUsers({ nicolas: "long-enough-1" }, "shared-password");
    expect([...adminUsers().keys()].sort()).toEqual(["admin", "nicolas"]);
    setUsers(undefined, "short");
    expect(adminUsers().size).toBe(0);
  });

  it("namedLogins is true only when someone other than admin can sign in", () => {
    setUsers(undefined, "shared-password");
    expect(namedLogins()).toBe(false);
    setUsers({ nicolas: "long-enough-1" });
    expect(namedLogins()).toBe(true);
  });
});

describe("checkLogin", () => {
  beforeEach(() => setUsers({ Nicolas: "nicolas-password" }, "shared-password"));

  it("signs in a named user, case-insensitively, returning the lowercased name", () => {
    expect(checkLogin("nicolas", "nicolas-password")).toBe("nicolas");
    expect(checkLogin("  NICOLAS ", "nicolas-password")).toBe("nicolas");
  });

  it("treats an empty name as the shared admin", () => {
    expect(checkLogin("", "shared-password")).toBe("admin");
    expect(checkLogin("  ", "shared-password")).toBe("admin");
  });

  it("rejects a wrong password or unknown user", () => {
    expect(checkLogin("nicolas", "wrong-password")).toBeNull();
    expect(checkLogin("nicolas", "")).toBeNull();
    expect(checkLogin("", "nicolas-password")).toBeNull();
    expect(checkLogin("ghost", "nicolas-password")).toBeNull();
    expect(checkLogin("ghost", "\0")).toBeNull();
  });
});

describe("session tokens", () => {
  beforeEach(() => setUsers({ nicolas: "nicolas-password", alex: "alex-password" }));

  it("round-trips the name", () => {
    const { value, maxAge } = createSessionToken("nicolas");
    expect(maxAge).toBe(8 * 60 * 60);
    expect(verifyToken(value)).toBe("nicolas");
    expect(verifyToken(createSessionToken("alex").value)).toBe("alex");
  });

  it("refuses to create a token for an unknown admin", () => {
    expect(() => createSessionToken("ghost")).toThrow();
  });

  it("stops verifying once that user's password changes, but not others'", () => {
    const nicolas = createSessionToken("nicolas").value;
    const alex = createSessionToken("alex").value;
    setUsers({ nicolas: "a-new-password", alex: "alex-password" });
    expect(verifyToken(nicolas)).toBeNull();
    expect(verifyToken(alex)).toBe("alex");
  });

  it("stops verifying once the user is removed", () => {
    const token = createSessionToken("nicolas").value;
    setUsers({ alex: "alex-password" });
    expect(verifyToken(token)).toBeNull();
  });

  it("expires after the session length", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-02T09:00:00Z"));
    const token = createSessionToken("nicolas").value;
    vi.setSystemTime(new Date("2026-10-02T16:59:00Z"));
    expect(verifyToken(token)).toBe("nicolas");
    vi.setSystemTime(new Date("2026-10-02T17:00:01Z"));
    expect(verifyToken(token)).toBeNull();
  });

  it("rejects tampered or malformed tokens", () => {
    const token = createSessionToken("nicolas").value;
    const [who, expires, mac] = token.split(".");
    const alex = Buffer.from("alex").toString("base64url");
    expect(verifyToken(`${alex}.${expires}.${mac}`)).toBeNull();
    expect(verifyToken(`${who}.${Number(expires) + 3600}.${mac}`)).toBeNull();
    expect(verifyToken(`${who}.${expires}.${mac.slice(0, -1)}${mac.endsWith("0") ? "1" : "0"}`)).toBeNull();
    expect(verifyToken(`${who}.${expires}`)).toBeNull();
    expect(verifyToken("")).toBeNull();
    expect(verifyToken(undefined)).toBeNull();
  });
});
