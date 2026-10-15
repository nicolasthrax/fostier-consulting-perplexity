import { NextResponse } from "next/server";
import { currentAdmin, sameOrigin } from "@/lib/careers/auth";
import { isStage } from "@/lib/careers/config";
import { deleteApplication, isSafeId, readApplication, updateStatus } from "@/lib/careers/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const unauthorised = () => NextResponse.json({ error: "Unauthorised." }, { status: 401 });
const notFound = () => NextResponse.json({ error: "Not found." }, { status: 404 });
const forbidden = () => NextResponse.json({ error: "Forbidden." }, { status: 403 });

/** Moves the candidate to another stage; the change is recorded in their history under the admin's name. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request)) return forbidden();
  const admin = await currentAdmin();
  if (!admin) return unauthorised();
  const { id } = await params;
  if (!isSafeId(id)) return notFound();
  const body = (await request.json().catch(() => ({}))) as { status?: unknown };
  if (!isStage(body.status)) return NextResponse.json({ error: "Unknown status." }, { status: 400 });
  const [rec] = await updateStatus([id], body.status, admin);
  if (!rec) return notFound();
  return NextResponse.json(
    { ok: true, status: rec.status, updatedAt: rec.updatedAt, history: rec.history ?? [] },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}

/** The candidate's whole record as JSON (notes and history included), for answering a data access request. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await currentAdmin())) return unauthorised();
  const { id } = await params;
  if (!isSafeId(id)) return notFound();
  const rec = await readApplication(id);
  if (!rec) return notFound();
  return new NextResponse(JSON.stringify(rec, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="application-${id}.json"`,
      "Cache-Control": "private, no-store",
    },
  });
}

/** Deletes the application and CV (withdrawal or erasure request), recorded in the deletion log under the admin's name. */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request)) return forbidden();
  const admin = await currentAdmin();
  if (!admin) return unauthorised();
  const { id } = await params;
  if (!isSafeId(id) || !(await deleteApplication(id, admin))) return notFound();
  return NextResponse.json({ ok: true });
}
