import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/careers/auth";
import { isSafeId, readApplication, readCv } from "@/lib/careers/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return new NextResponse("Unauthorised", { status: 401 });
  const { id } = await params;
  if (!isSafeId(id)) return new NextResponse("Not found", { status: 404 });
  const rec = await readApplication(id);
  if (!rec?.cv) return new NextResponse("Not found", { status: 404 });

  const data = await readCv(rec.cv.file);
  if (!data) return new NextResponse("Not found", { status: 404 });
  const ext = rec.cv.file.split(".").pop();
  const inline = new URL(request.url).searchParams.get("inline") === "1" && ext === "pdf";
  const name = `${rec.fullName.replace(/[^\p{L}\p{N} _-]/gu, "").trim().replace(/\s+/g, "-") || "candidate"}-CV.${ext}`;
  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": rec.cv.type,
      // ?inline=1 shows a PDF in the browser (admin preview); everything else downloads.
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${name.replace(/[^\x20-\x7e]/g, "_")}"; filename*=UTF-8''${encodeURIComponent(name)}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      // Content-Security-Policy (with `sandbox`) is set in next.config.mjs, which would override one set here.
    },
  });
}
