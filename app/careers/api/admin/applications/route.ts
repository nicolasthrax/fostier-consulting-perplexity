import { NextResponse } from "next/server";
import { currentAdmin, sameOrigin } from "@/lib/careers/auth";
import { isStage, toSummary } from "@/lib/careers/config";
import { etagMatches } from "@/lib/careers/list";
import { deleteApplications, isSafeId, readApplicationList, updateStatus } from "@/lib/careers/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "private, no-store" };
/** Most applications one bulk status change or delete can touch. */
const MAX_BULK_IDS = 500;

const unauthorised = () => NextResponse.json({ error: "Unauthorised." }, { status: 401, headers: NO_STORE });
const badRequest = (error: string) => NextResponse.json({ error }, { status: 400, headers: NO_STORE });
const forbidden = () => NextResponse.json({ error: "Forbidden." }, { status: 403, headers: NO_STORE });

/**
 * All applications, newest first, without history and notes: the admin dashboard
 * polls this for new arrivals. An unchanged list answers an empty 304 (ETag).
 */
export async function GET(request: Request) {
  if (!(await currentAdmin())) return unauthorised();
  const { body, etag } = await readApplicationList();
  const headers = { ...NO_STORE, ETag: etag };
  if (etagMatches(request.headers.get("If-None-Match"), etag)) return new NextResponse(null, { status: 304, headers });
  return new NextResponse(body, { headers: { ...headers, "Content-Type": "application/json" } });
}

/** Bulk status change from the table view: `{ ids, status }`, saved in one write. */
export async function PATCH(request: Request) {
  if (!sameOrigin(request)) return forbidden();
  const admin = await currentAdmin();
  if (!admin) return unauthorised();
  const body = (await request.json().catch(() => null)) as { ids?: unknown; status?: unknown } | null;
  const { ids, status } = body ?? {};
  if (!Array.isArray(ids) || !ids.length) return badRequest("Choose at least one application.");
  if (ids.length > MAX_BULK_IDS) return badRequest(`At most ${MAX_BULK_IDS} applications at a time.`);
  if (!ids.every((id): id is string => typeof id === "string" && isSafeId(id))) return badRequest("Unknown application.");
  if (!isStage(status)) return badRequest("Unknown status.");
  const applications = await updateStatus([...new Set(ids)], status, admin);
  return NextResponse.json({ ok: true, applications: applications.map(toSummary) }, { headers: NO_STORE });
}

/** Bulk delete from the table view: `{ ids }`, saved in one write and logged under the admin's name. Answers the IDs actually deleted. */
export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return forbidden();
  const admin = await currentAdmin();
  if (!admin) return unauthorised();
  const body = (await request.json().catch(() => null)) as { ids?: unknown } | null;
  const ids = body?.ids;
  if (!Array.isArray(ids) || !ids.length) return badRequest("Choose at least one application.");
  if (ids.length > MAX_BULK_IDS) return badRequest(`At most ${MAX_BULK_IDS} applications at a time.`);
  if (!ids.every((id): id is string => typeof id === "string" && isSafeId(id))) return badRequest("Unknown application.");
  const deleted = await deleteApplications([...new Set(ids)], admin);
  return NextResponse.json({ ok: true, deleted }, { headers: NO_STORE });
}
