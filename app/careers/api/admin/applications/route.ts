import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/careers/auth";
import { readApplications } from "@/lib/careers/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** All applications, newest first: the admin dashboard polls this for new arrivals. */
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  const apps = (await readApplications()).sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  return NextResponse.json({ applications: apps }, { headers: { "Cache-Control": "private, no-store" } });
}
