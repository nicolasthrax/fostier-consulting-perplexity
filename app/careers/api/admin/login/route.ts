import { NextResponse } from "next/server";
import { blockedAsBot } from "@/lib/careers/botid";
import {
  ADMIN_COOKIE,
  adminEnabled,
  checkLogin,
  clearLoginFailures,
  createSessionToken,
  loginThrottled,
  recordLoginFailure,
} from "@/lib/careers/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!adminEnabled()) return NextResponse.json({ error: "The admin is not configured." }, { status: 404 });
  // BotID stops scripted password guessing across every instance; the throttle below only sees this one.
  if (await blockedAsBot("login")) return NextResponse.json({ error: "Sign-in blocked. Try again from a normal browser." }, { status: 403 });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (loginThrottled(ip)) return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });

  const body = (await request.json().catch(() => ({}))) as { name?: unknown; password?: unknown };
  const name = typeof body.name === "string" ? body.name : "";
  const admin = typeof body.password === "string" ? checkLogin(name, body.password) : null;
  if (!admin) {
    recordLoginFailure(ip);
    return NextResponse.json({ error: name ? "Incorrect name or password." : "Incorrect password." }, { status: 401 });
  }
  clearLoginFailures(ip);
  const { value, maxAge } = createSessionToken(admin);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, value, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
  return res;
}
