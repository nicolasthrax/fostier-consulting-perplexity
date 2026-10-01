import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/careers/auth";
import { isStage } from "@/lib/careers/config";
import { isSafeId, updateStatus } from "@/lib/careers/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  const { id } = await params;
  if (!isSafeId(id)) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const body = (await request.json().catch(() => ({}))) as { status?: unknown };
  if (!isStage(body.status)) return NextResponse.json({ error: "Unknown status." }, { status: 400 });
  const rec = await updateStatus(id, body.status);
  if (!rec) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true, status: rec.status, updatedAt: rec.updatedAt });
}
