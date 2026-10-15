import { NextResponse } from "next/server";
import { sameOrigin, sessionCookie } from "@/lib/careers/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(sessionCookie("", 0));
  return res;
}
