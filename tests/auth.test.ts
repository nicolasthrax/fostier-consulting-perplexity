import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { adminUsers, checkLogin, clientIp, createSessionToken, namedLogins, sameOrigin, sessionSecret, verifyToken } from "@/lib/careers/auth";

const setUsers = (users: Record<string, unknown> | string | undefined, shared?: string) => {
  if (users === undefined) delete process.env.CAREERS_ADMIN_USERS;
  else process.env.CAREERS_ADMIN_USERS = typeof users === "string" ? users : JSON.stringify(users);
  if (shared === undefined) delete process.env.CAREERS_ADMIN_PASSWORD;
  else process.env.CAREERS_ADMIN_PASSWORD = shared;
};

const SECRET = "s".repeat(32);

beforeEach(() => {
  setUsers(undefined);
  process.env.CAREERS_SESSION_SECRET = SECRET;
});
afterEach(() => {
  setUsers(undefined);
  delete process.env.CAREERS_SESSION_SECRET;
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

describe("session secret", () => {
  beforeEach(() => setUsers({ nicolas: "nicolas-password" }));

  it("needs 32+ characters", () => {
    expect(sessionSecret()).toBe(SECRET);
    process.env.CAREERS_SESSION_SECRET = "s".repeat(31);
    expect(sessionSecret()).toBeNull();
  });

  it("signs everyone out when it is rotated", () => {
    const token = createSessionToken("nicolas").value;
    process.env.CAREERS_SESSION_SECRET = "t".repeat(32);
    expect(verifyToken(token)).toBeNull();
    expect(verifyToken(createSessionToken("nicolas").value)).toBe("nicolas");
  });

  it("without one, falls back to signing with the password, with a warning, and those sessions end once it is set", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    delete process.env.CAREERS_SESSION_SECRET;
    const fallback = createSessionToken("nicolas").value;
    expect(verifyToken(fallback)).toBe("nicolas");
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("CAREERS_SESSION_SECRET"));
    process.env.CAREERS_SESSION_SECRET = SECRET;
    expect(verifyToken(fallback)).toBeNull();
  });
});

describe("sameOrigin", () => {
  const req = (headers: Record<string, string>) =>
    new Request("https://www.fostierconsulting.com/careers/api/admin/applications", { method: "PATCH", headers });

  it("accepts this site's own origin", () => {
    expect(sameOrigin(req({ Origin: "https://www.fostierconsulting.com", Host: "www.fostierconsulting.com" }))).toBe(true);
    // Behind a proxy that only sets X-Forwarded-Host.
    expect(sameOrigin(new Request("http://internal/x", { headers: { Origin: "https://a.test", "X-Forwarded-Host": "a.test" } }))).toBe(true);
  });

  it("refuses another site, a sibling subdomain, and Origin: null", () => {
    expect(sameOrigin(req({ Origin: "https://evil.example" }))).toBe(false);
    expect(sameOrigin(req({ Origin: "https://blog.fostierconsulting.com" }))).toBe(false);
    expect(sameOrigin(req({ Origin: "null" }))).toBe(false);
  });

  it("without Origin, goes by Sec-Fetch-Site, and lets non-browser clients through", () => {
    expect(sameOrigin(req({ "Sec-Fetch-Site": "same-origin" }))).toBe(true);
    expect(sameOrigin(req({ "Sec-Fetch-Site": "same-site" }))).toBe(false);
    expect(sameOrigin(req({ "Sec-Fetch-Site": "cross-site" }))).toBe(false);
    expect(sameOrigin(req({}))).toBe(true);
  });

  it("refuses this host under a scheme other than HTTP(S)", () => {
    expect(sameOrigin(req({ Origin: "ftp://www.fostierconsulting.com", Host: "www.fostierconsulting.com" }))).toBe(false);
  });

  it("in production, refuses plain HTTP except on localhost", async () => {
    vi.resetModules();
    vi.stubEnv("NODE_ENV", "production");
    try {
      const { sameOrigin: prodSameOrigin } = await import("@/lib/careers/auth");
      expect(prodSameOrigin(req({ Origin: "http://www.fostierconsulting.com", Host: "www.fostierconsulting.com" }))).toBe(false);
      expect(prodSameOrigin(req({ Origin: "https://www.fostierconsulting.com", Host: "www.fostierconsulting.com" }))).toBe(true);
      expect(prodSameOrigin(new Request("http://localhost:3000/x", { headers: { Origin: "http://localhost:3000" } }))).toBe(true);
    } finally {
      vi.unstubAllEnvs();
      vi.resetModules();
    }
  });
});

describe("clientIp", () => {
  const req = (headers: Record<string, string>) => new Request("https://www.fostierconsulting.com/careers/api/admin/login", { headers });
  afterEach(() => vi.unstubAllEnvs());

  it("off Vercel, uses the entry the nearest proxy appended, not one the client sent", () => {
    vi.stubEnv("VERCEL", "");
    expect(clientIp(req({ "X-Forwarded-For": "1.1.1.1, 203.0.113.7" }))).toBe("203.0.113.7");
    expect(clientIp(req({}))).toBe("local");
  });

  it("on Vercel, uses the address Vercel sets", () => {
    vi.stubEnv("VERCEL", "1");
    expect(clientIp(req({ "X-Real-IP": "203.0.113.7", "X-Forwarded-For": "203.0.113.7" }))).toBe("203.0.113.7");
    expect(clientIp(req({ "X-Forwarded-For": "203.0.113.8, 10.0.0.1" }))).toBe("203.0.113.8");
  });
});
