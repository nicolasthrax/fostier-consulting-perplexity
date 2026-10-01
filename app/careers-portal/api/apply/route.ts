import { NextResponse } from "next/server";
import {
  CV_TYPES,
  knockoutsFor,
  validateCvMeta,
  validateFields,
  type ApplicationInput,
  type ApplicationRecord,
  type CvExtension,
} from "@/lib/careers/config";
import { addApplication, newId, saveCv } from "@/lib/careers/storage";
import { forwardToWebhook, webhookUrl } from "@/lib/careers/webhook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FIELDS: (keyof ApplicationInput)[] = [
  "fullName", "email", "phone", "linkedinUrl", "portfolioUrl",
  "workAuthorization", "role", "yearsExperience", "motivation",
];

/** Checks the file's first bytes, so a renamed executable isn't stored as a "PDF". */
function sniff(buf: Buffer, ext: CvExtension) {
  if (ext === "pdf") return buf.subarray(0, 5).toString("latin1") === "%PDF-";
  return buf[0] === 0x50 && buf[1] === 0x4b && buf[2] === 0x03 && buf[3] === 0x04; // ZIP (DOCX)
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "The submission could not be read." }, { status: 400 });
  }

  // Honeypot: real candidates never see this field.
  if (String(form.get("company_website") ?? "")) return NextResponse.json({ ok: true, id: "received" });
  if (form.get("consent") !== "yes")
    return NextResponse.json({ error: "Consent to data processing is required." }, { status: 400 });

  const input = Object.fromEntries(FIELDS.map((k) => [k, String(form.get(k) ?? "").trim()])) as ApplicationInput;
  const errors = validateFields(input);
  if (Object.keys(errors).length) return NextResponse.json({ error: "Some answers need attention.", errors }, { status: 400 });

  const file = form.get("cv");
  if (!(file instanceof File)) return NextResponse.json({ error: "Attach your CV." }, { status: 400 });
  const cvError = validateCvMeta(file.name, file.size);
  if (cvError) return NextResponse.json({ error: cvError }, { status: 400 });
  const ext = file.name.split(".").pop()!.toLowerCase() as CvExtension;
  const data = Buffer.from(await file.arrayBuffer());
  if (!sniff(data, ext)) return NextResponse.json({ error: "That file doesn't look like a valid PDF or DOCX." }, { status: 400 });

  const id = newId();
  const now = new Date().toISOString();
  const yearsExperience = Number(input.yearsExperience);
  const record: ApplicationRecord = {
    ...input,
    id,
    yearsExperience,
    submittedAt: now,
    updatedAt: now,
    status: "applied",
    knockouts: knockoutsFor({ ...input, yearsExperience }),
    cv: null,
  };

  let storedLocally = false;
  try {
    const stored = await saveCv(id, ext, data);
    record.cv = { file: stored, originalName: file.name.slice(0, 200), size: file.size, type: CV_TYPES[ext] };
    await addApplication(record);
    storedLocally = true;
  } catch (err) {
    // Expected on read-only hosts; the webhook below is then the only copy.
    console.error("[careers] local save failed:", (err as Error).message);
  }

  let forwarded = false;
  if (webhookUrl()) {
    try {
      forwarded = await forwardToWebhook(record, { name: file.name, type: CV_TYPES[ext], data });
    } catch (err) {
      console.error("[careers] webhook failed:", (err as Error).message);
    }
  }

  if (!storedLocally && !forwarded)
    return NextResponse.json({ error: "We couldn't save your application. Please try again later." }, { status: 503 });
  return NextResponse.json({ ok: true, id });
}
