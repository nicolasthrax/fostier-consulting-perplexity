import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminEnabled,
  checkPassword,
  clearLoginFailures,
  createSessionToken,
  loginThrottled,
  recordLoginFailure,
} from "@/lib/careers/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!adminEnabled()) return NextResponse.json({ error: "The admin is not configured." }, { status: 404 });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (loginThrottled(ip)) return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });

  const body = (await request.json().catch(() => ({}))) as { password?: unknown };
  if (typeof body.password !== "string" || !checkPassword(body.password)) {
    recordLoginFailure(ip);
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }
  clearLoginFailures(ip);
  const { value, maxAge } = createSessionToken();
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
