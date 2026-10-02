import { NextResponse } from "next/server";
import { currentAdmin } from "@/lib/careers/auth";
import { isStage } from "@/lib/careers/config";
import { isSafeId, readApplications, updateStatus } from "@/lib/careers/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "private, no-store" };
/** Most applications one bulk status change can move. */
const MAX_BULK_IDS = 500;

const unauthorised = () => NextResponse.json({ error: "Unauthorised." }, { status: 401, headers: NO_STORE });
const badRequest = (error: string) => NextResponse.json({ error }, { status: 400, headers: NO_STORE });

/** All applications, newest first: the admin dashboard polls this for new arrivals. */
export async function GET() {
  if (!(await currentAdmin())) return unauthorised();
  const apps = (await readApplications()).sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  return NextResponse.json({ applications: apps }, { headers: NO_STORE });
}

/** Bulk status change from the table view: `{ ids, status }`, saved in one write. */
export async function PATCH(request: Request) {
  const admin = await currentAdmin();
  if (!admin) return unauthorised();
  const body = (await request.json().catch(() => null)) as { ids?: unknown; status?: unknown } | null;
  const { ids, status } = body ?? {};
  if (!Array.isArray(ids) || !ids.length) return badRequest("Choose at least one application.");
  if (ids.length > MAX_BULK_IDS) return badRequest(`At most ${MAX_BULK_IDS} applications at a time.`);
  if (!ids.every((id): id is string => typeof id === "string" && isSafeId(id))) return badRequest("Unknown application.");
  if (!isStage(status)) return badRequest("Unknown status.");
  const applications = await updateStatus([...new Set(ids)], status, admin);
  return NextResponse.json({ ok: true, applications }, { headers: NO_STORE });
}
