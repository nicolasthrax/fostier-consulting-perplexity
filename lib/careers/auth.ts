import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Admin access: a single shared password from CAREERS_ADMIN_PASSWORD. A successful
 * login sets an HttpOnly cookie holding an expiry signed with that password, so
 * changing the password signs everyone out. With no password set, the admin is off.
 */
export const ADMIN_COOKIE = "fc_careers_admin";
const SESSION_SECONDS = 60 * 60 * 8;

const secret = () => process.env.CAREERS_ADMIN_PASSWORD || "";
export const adminEnabled = () => secret().length >= 8;

const sign = (payload: string) => createHmac("sha256", `careers-admin:${secret()}`).update(payload).digest("hex");

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function checkPassword(input: string) {
  if (!adminEnabled()) return false;
  // Compare digests so the comparison is constant-time whatever the input length.
  return safeEqual(sign(`pw:${input}`), sign(`pw:${secret()}`));
}

export function createSessionToken() {
  const expires = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  return { value: `${expires}.${sign(expires)}`, maxAge: SESSION_SECONDS };
}

function verifyToken(token: string | undefined) {
  if (!token || !adminEnabled()) return false;
  const [expires, mac] = token.split(".");
  if (!expires || !mac || !safeEqual(mac, sign(expires))) return false;
  return Number(expires) > Date.now() / 1000;
}

export async function isAdmin() {
  const jar = await cookies();
  return verifyToken(jar.get(ADMIN_COOKIE)?.value);
}

// Naive in-memory throttle for login attempts: enough to stop casual guessing on a single instance.
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
