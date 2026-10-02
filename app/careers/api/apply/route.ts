import { after, NextResponse } from "next/server";
import { blockedAsBot } from "@/lib/careers/botid";
import {
  CV_TYPES,
  initialStatus,
  knockoutsFor,
  openJob,
  validateCvMeta,
  validateFields,
  type ApplicationInput,
  type ApplicationRecord,
  type CvExtension,
} from "@/lib/careers/config";
import { DEFAULT_CAREERS_LOCALE, careersCopy, isCareersLocale } from "@/lib/careers/i18n";
import { addApplication, newId, storageAvailable } from "@/lib/careers/storage";
import { forwardToWebhook, webhookUrl } from "@/lib/careers/webhook";
import { sendApplicationEmails } from "@/lib/careers/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FIELDS: (keyof ApplicationInput)[] = [
  "fullName", "email", "phone", "linkedinUrl", "portfolioUrl",
  "workAuthorization", "commissionOnly", "adult", "university",
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
    return NextResponse.json({ error: careersCopy.en.errors.unreadable }, { status: 400 });
  }
  const lang = isCareersLocale(form.get("lang")) ? (form.get("lang") as "en" | "fr") : DEFAULT_CAREERS_LOCALE;
  const m = careersCopy[lang].errors;

  // BotID (see CareersShell): scripted submissions could otherwise fill the Blob store with 4 MB files
  // and use the form to send confirmation emails to any address. A person wrongly flagged can still apply by email.
  if (await blockedAsBot("apply")) return NextResponse.json({ error: m.saveFailed, fallbackEmail: true }, { status: 403 });

  // Honeypot: real candidates never see this field.
  if (String(form.get("company_website") ?? "")) return NextResponse.json({ ok: true, id: "received" });
  if (form.get("consent") !== "yes") return NextResponse.json({ error: m.declaration }, { status: 400 });

  const job = openJob(String(form.get("job") ?? ""));
  if (!job) return NextResponse.json({ error: m.jobClosed }, { status: 400 });

  const input = Object.fromEntries(FIELDS.map((k) => [k, String(form.get(k) ?? "").trim()])) as ApplicationInput;
  const errors = validateFields(input, lang);
  if (Object.keys(errors).length) return NextResponse.json({ error: m.attention, errors }, { status: 400 });

  const file = form.get("cv");
  if (!(file instanceof File)) return NextResponse.json({ error: m.cvMissing }, { status: 400 });
  const cvError = validateCvMeta(file.name, file.size, lang);
  if (cvError) return NextResponse.json({ error: cvError }, { status: 400 });
  const ext = file.name.split(".").pop()!.toLowerCase() as CvExtension;
  const data = Buffer.from(await file.arrayBuffer());
  if (!sniff(data, ext)) return NextResponse.json({ error: m.cvInvalid }, { status: 400 });

  const id = newId();
  const now = new Date().toISOString();
  const status = initialStatus(input);
  const record: ApplicationRecord = {
    ...input,
    id,
    lang,
    jobSlug: job.slug,
    jobTitle: job.title.en,
    submittedAt: now,
    updatedAt: now,
    status,
    knockouts: knockoutsFor(input),
    cv: null,
    history: [{ at: now, by: "system", from: null, to: status }],
  };

  record.cv = { file: `${id}.${ext}`, originalName: file.name.slice(0, 200), size: file.size, type: CV_TYPES[ext] };
  let storedLocally = false;
  if (storageAvailable()) {
    try {
      // Also drops expired applications in the same write.
      await addApplication(record, data);
      storedLocally = true;
    } catch (err) {
      console.error("[careers] save failed:", (err as Error).message);
    }
  } else {
    console.error("[careers] no storage configured: connect a Vercel Blob store or set CAREERS_WEBHOOK_URL");
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
    return NextResponse.json({ error: m.saveFailed, fallbackEmail: true }, { status: 503 });
  // After the response, so a slow mail provider never delays the candidate.
  after(() => sendApplicationEmails(record, job.title[lang]));
  return NextResponse.json({ ok: true, id });
}
