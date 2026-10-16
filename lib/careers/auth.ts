import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Admin access, one login per person so status changes and notes show who made them:
 *
 * - CAREERS_ADMIN_USERS: a JSON object of name → password, e.g. {"nicolas":"…","alex":"…"}.
 * - CAREERS_ADMIN_PASSWORD: a single shared password, signing in as "admin" (older setup).
 *
 * Passwords need 8+ characters; shorter ones are ignored. A successful login sets an
 * HttpOnly cookie holding the name and an expiry, signed with CAREERS_SESSION_SECRET
 * over that person's password too, so changing someone's password signs them out and
 * rotating the secret signs everyone out. With no valid user, the admin is off.
 */
const PRODUCTION = process.env.NODE_ENV === "production";
/**
 * In production the __Host- prefix makes the browser accept the cookie only over HTTPS,
 * for this exact host and path /, so no subdomain can set or overwrite it.
 */
export const ADMIN_COOKIE = PRODUCTION ? "__Host-fc_careers_admin" : "fc_careers_admin";
const SESSION_SECONDS = 60 * 60 * 8;
const MIN_PASSWORD = 8;
/** Shortest CAREERS_SESSION_SECRET accepted, e.g. `openssl rand -base64 32` (44 characters). */
const MIN_SECRET = 32;
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

/** CAREERS_SESSION_SECRET when long enough, read on each call like the logins. */
export function sessionSecret() {
  const secret = process.env.CAREERS_SESSION_SECRET || "";
  return secret.length >= MIN_SECRET ? secret : null;
}

let warnedNoSecret = false;

/**
 * The session cookie's signature. With CAREERS_SESSION_SECRET as the key, a copied cookie
 * gives nothing to guess a password from offline; the password is still part of what is
 * signed, so changing it signs that person out. Without a secret, it falls back to the
 * person's password as the key (the older setup), with a warning.
 */
function sessionMac(password: string, payload: string) {
  const secret = sessionSecret();
  if (secret) return createHmac("sha256", `careers-session:${secret}`).update(`${payload}\0${password}`).digest("hex");
  if (!warnedNoSecret) {
    warnedNoSecret = true;
    console.warn("[careers] CAREERS_SESSION_SECRET is not set (32+ characters): admin sessions are signed with the password instead.");
  }
  return sign(password, payload);
}

export function createSessionToken(name: string) {
  const password = adminUsers().get(name);
  if (!password) throw new Error("Unknown admin");
  const expires = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  const who = Buffer.from(name).toString("base64url");
  return { value: `${who}.${expires}.${sessionMac(password, `${who}.${expires}`)}`, maxAge: SESSION_SECONDS };
}

/** The admin a session token belongs to, or null if it is invalid, expired, or the password or secret changed. */
export function verifyToken(token: string | undefined): string | null {
  if (!token) return null;
  const [who, expires, mac] = token.split(".");
  if (!who || !expires || !mac) return null;
  const name = Buffer.from(who, "base64url").toString();
  const password = adminUsers().get(name);
  if (!password || !safeEqual(mac, sessionMac(password, `${who}.${expires}`))) return null;
  return Number(expires) > Date.now() / 1000 ? name : null;
}

/** Options for the session cookie; a maxAge of 0 clears it (a __Host- cookie must be cleared with the same attributes). */
export const sessionCookie = (value: string, maxAge: number) => ({
  name: ADMIN_COOKIE,
  value,
  httpOnly: true,
  sameSite: "strict" as const,
  secure: PRODUCTION,
  path: "/",
  maxAge,
});

/**
 * Whether a request that changes something comes from this site's own pages. The
 * SameSite=Strict cookie already keeps other sites out, but every subdomain counts as
 * the same site; Origin names the exact host. Browsers send Origin (or at least
 * Sec-Fetch-Site) on these requests; a client sending neither isn't a browser, so it
 * can't be riding on an admin's cookie.
 *
 * X-Forwarded-Host counts as this site's host, for proxies that only set that header: a
 * page on another site can't send it (it would need a CORS preflight, never granted here).
 * In production the Origin must also be HTTPS (the __Host- cookie needs it anyway),
 * except on localhost, so a plain-HTTP page on this host can't act either.
 */
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return (request.headers.get("sec-fetch-site") ?? "same-origin") === "same-origin";
  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    return false; // includes Origin: null
  }
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if (url.protocol !== "https:" && !(url.protocol === "http:" && (local || !PRODUCTION))) return false;
  const own = [request.headers.get("x-forwarded-host"), request.headers.get("host"), new URL(request.url).host];
  return own.includes(url.host);
}

/** The signed-in admin's name, or null. */
export async function currentAdmin() {
  const jar = await cookies();
  return verifyToken(jar.get(ADMIN_COOKIE)?.value);
}

export const isAdmin = async () => (await currentAdmin()) !== null;

/**
 * Proxies in front of a self-hosted portal that append to X-Forwarded-For, from
 * CAREERS_TRUSTED_PROXIES (default 1: one nginx). Behind a CDN and nginx, set 2, or every
 * visitor through the same CDN edge would share one login throttle.
 */
function trustedProxies() {
  const n = Number(process.env.CAREERS_TRUSTED_PROXIES ?? 1);
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

/**
 * The client's IP for the login throttle. Vercel sets X-Forwarded-For itself (a client's
 * own value is dropped), so its first entry is the client. Elsewhere a client can send its
 * own header, so the entry added by the outermost trusted proxy is used, counting from the
 * end: run a self-hosted portal behind proxies that append it (nginx's
 * $proxy_add_x_forwarded_for).
 */
export function clientIp(request: Request) {
  const forwarded = (request.headers.get("x-forwarded-for") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (process.env.VERCEL) return request.headers.get("x-real-ip") || forwarded[0] || "local";
  return forwarded[Math.max(0, forwarded.length - trustedProxies())] || "local";
}

/**
 * Naive in-memory throttle for login attempts, per IP: it only sees one instance,
 * so BotID on the login route (see app/careers/api/admin/login) does the heavy lifting.
 */
const MAX_ATTEMPTS = 5;
const THROTTLE_MS = 15 * 60 * 1000;
/** Past this many IPs, expired entries are dropped, so many addresses can't grow the map without limit. */
const PRUNE_AT = 1000;
const attempts = new Map<string, { count: number; until: number }>();
export function loginThrottled(ip: string) {
  const a = attempts.get(ip);
  return !!a && a.count >= MAX_ATTEMPTS && a.until > Date.now();
}
export function recordLoginFailure(ip: string) {
  const now = Date.now();
  if (attempts.size >= PRUNE_AT) for (const [k, v] of attempts) if (v.until < now) attempts.delete(k);
  const a = attempts.get(ip);
  const fresh = !a || a.until < now;
  attempts.set(ip, { count: fresh ? 1 : a!.count + 1, until: now + THROTTLE_MS });
}
export const clearLoginFailures = (ip: string) => attempts.delete(ip);
