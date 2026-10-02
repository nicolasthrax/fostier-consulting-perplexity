import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Admin access, one login per person so status changes and notes show who made them:
 *
 * - CAREERS_ADMIN_USERS: a JSON object of name → password, e.g. {"nicolas":"…","alex":"…"}.
 * - CAREERS_ADMIN_PASSWORD: a single shared password, signing in as "admin" (older setup).
 *
 * Passwords need 8+ characters; shorter ones are ignored. A successful login sets an
 * HttpOnly cookie holding the name and an expiry, signed with that person's password,
 * so changing someone's password signs them out. With no valid user, the admin is off.
 */
export const ADMIN_COOKIE = "fc_careers_admin";
const SESSION_SECONDS = 60 * 60 * 8;
const MIN_PASSWORD = 8;
/** Name used for the shared CAREERS_ADMIN_PASSWORD login. */
export const SHARED_ADMIN_NAME = "admin";
const NAME_RE = /^[\p{L}\p{N} ._-]{1,40}$/u;

/** Configured logins, read on each call so tests and env changes take effect. */
export function adminUsers(): Map<string, string> {
  const users = new Map<string, string>();
  const raw = process.env.CAREERS_ADMIN_USERS;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed))
        for (const [name, pw] of Object.entries(parsed))
          if (NAME_RE.test(name) && typeof pw === "string" && pw.length >= MIN_PASSWORD) users.set(name.trim().toLowerCase(), pw);
    } catch {
      console.error("[careers] CAREERS_ADMIN_USERS is not valid JSON; named logins are off.");
    }
  }
  const shared = process.env.CAREERS_ADMIN_PASSWORD || "";
  if (shared.length >= MIN_PASSWORD && !users.has(SHARED_ADMIN_NAME)) users.set(SHARED_ADMIN_NAME, shared);
  return users;
}

export const adminEnabled = () => adminUsers().size > 0;
/** Whether the login form needs a name: only when someone other than the shared "admin" can sign in. */
export const namedLogins = () => [...adminUsers().keys()].some((n) => n !== SHARED_ADMIN_NAME);

const sign = (password: string, payload: string) => createHmac("sha256", `careers-admin:${password}`).update(payload).digest("hex");

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/** Returns the signed-in name, or null. An empty name means the shared "admin" login. */
export function checkLogin(name: string, input: string): string | null {
  const users = adminUsers();
  const key = (name.trim() || SHARED_ADMIN_NAME).toLowerCase();
  const password = users.get(key);
  // Compare digests so the comparison is constant-time whatever the input length;
  // an unknown name still costs the same work.
  const ok = safeEqual(sign(password ?? "unknown-user", `pw:${input}`), sign(password ?? "unknown-user", `pw:${password ?? "\0"}`));
  return password !== undefined && ok ? key : null;
}

export function createSessionToken(name: string) {
  const password = adminUsers().get(name);
  if (!password) throw new Error("Unknown admin");
  const expires = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  const who = Buffer.from(name).toString("base64url");
  return { value: `${who}.${expires}.${sign(password, `${who}.${expires}`)}`, maxAge: SESSION_SECONDS };
}

/** The admin a session token belongs to, or null if it is invalid, expired or the password changed. */
export function verifyToken(token: string | undefined): string | null {
  if (!token) return null;
  const [who, expires, mac] = token.split(".");
  if (!who || !expires || !mac) return null;
  const name = Buffer.from(who, "base64url").toString();
  const password = adminUsers().get(name);
  if (!password || !safeEqual(mac, sign(password, `${who}.${expires}`))) return null;
  return Number(expires) > Date.now() / 1000 ? name : null;
}

/** The signed-in admin's name, or null. */
export async function currentAdmin() {
  const jar = await cookies();
  return verifyToken(jar.get(ADMIN_COOKIE)?.value);
}

export const isAdmin = async () => (await currentAdmin()) !== null;

/**
 * Naive in-memory throttle for login attempts, per IP: it only sees one instance,
 * so BotID on the login route (see app/careers/api/admin/login) does the heavy lifting.
 */
const attempts = new Map<string, { count: number; until: number }>();
export function loginThrottled(ip: string) {
  const a = attempts.get(ip);
  return !!a && a.count >= 5 && a.until > Date.now();
}
export function recordLoginFailure(ip: string) {
  const a = attempts.get(ip);
  const fresh = !a || a.until < Date.now();
  attempts.set(ip, { count: fresh ? 1 : a!.count + 1, until: Date.now() + 15 * 60 * 1000 });
}
export const clearLoginFailures = (ip: string) => attempts.delete(ip);
