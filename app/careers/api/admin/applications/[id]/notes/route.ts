import { NextResponse } from "next/server";
import { currentAdmin } from "@/lib/careers/auth";
import { NOTE_MAX_LENGTH } from "@/lib/careers/config";
import { addNote, isSafeId } from "@/lib/careers/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } });

/** Adds an internal note to a candidate, signed with the admin's name. Notes are never shown to the candidate. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await currentAdmin();
  if (!admin) return json({ error: "Unauthorised." }, 401);
  const { id } = await params;
  if (!isSafeId(id)) return json({ error: "Not found." }, 404);
  const body = (await request.json().catch(() => ({}))) as { text?: unknown };
  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) return json({ error: "Write a note before saving." }, 400);
  if (text.length > NOTE_MAX_LENGTH) return json({ error: `Notes can be at most ${NOTE_MAX_LENGTH} characters.` }, 400);
  const note = await addNote(id, text, admin);
  if (!note) return json({ error: "Not found." }, 404);
  return json({ ok: true, note });
}
