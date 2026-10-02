import { NextResponse } from "next/server";
import { currentAdmin } from "@/lib/careers/auth";
import { markAllViewed } from "@/lib/careers/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** "Mark all as read": clears the new-application notifications. */
export async function POST() {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  return NextResponse.json({ ok: true, cleared: await markAllViewed(admin) });
}
