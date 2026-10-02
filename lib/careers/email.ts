import { site } from "@/lib/site";
import { pipelineStages, labelFor, publicBase, type ApplicationRecord } from "./config";
import { DEFAULT_CAREERS_LOCALE, careersCopy } from "./i18n";

/**
 * Emails sent on each new application, through Resend (Vercel Marketplace
 * integration, free tier). Both are optional and off until RESEND_API_KEY and
 * CAREERS_EMAIL_FROM are set; a failure is logged and never fails the submission.
 *
 * - To the team (CAREERS_NOTIFY_EMAIL, default site.email): who applied, flags,
 *   and a link to the admin page. No CV or contact details beyond the name, so
 *   nothing sensitive sits in mailboxes.
 * - To the candidate: a confirmation with the reference. It contains nothing the
 *   candidate typed (not even their name), so the form can't be used to send
 *   arbitrary text to someone else's address.
 */
const RESEND_URL = "https://api.resend.com/emails";

export const emailEnabled = () => !!(process.env.RESEND_API_KEY && process.env.CAREERS_EMAIL_FROM);

async function send(message: { to: string; subject: string; text: string; replyTo?: string }) {
  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CAREERS_EMAIL_FROM,
      to: [message.to],
      subject: message.subject,
      text: message.text,
      ...(message.replyTo ? { reply_to: message.replyTo } : {}),
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

/** Header-safe single line: candidate text in a subject can't add lines or run on. */
const oneLine = (s: string, max = 80) => s.replace(/[\r\n\t]+/g, " ").trim().slice(0, max);

export function teamNotification(record: ApplicationRecord) {
  const adminUrl = `${site.baseUrl}${publicBase(DEFAULT_CAREERS_LOCALE)}/admin/${record.id}`;
  const status = labelFor([...pipelineStages], record.status);
  return {
    to: process.env.CAREERS_NOTIFY_EMAIL || site.email,
    subject: `New application: ${oneLine(record.fullName)} · ${record.jobTitle}`,
    text: [
      `${oneLine(record.fullName, 120)} applied for ${record.jobTitle}.`,
      "",
      `Status: ${status}${record.status === "rejected" ? " (declined commission-only pay)" : ""}`,
      record.knockouts.length ? `Screening flags: ${record.knockouts.join("; ")}` : "Screening flags: none",
      record.university ? `University: ${oneLine(record.university, 150)}` : "",
      `Applied in: ${record.lang === "fr" ? "French" : "English"}`,
      `Reference: ${record.id}`,
      "",
      `Open the application: ${adminUrl}`,
    ]
      .filter((l, i, all) => l !== "" || all[i - 1] !== "")
      .join("\n"),
  };
}

export function candidateConfirmation(record: ApplicationRecord, jobTitle: string) {
  const t = careersCopy[record.lang].confirmation;
  return { to: record.email, subject: t.subject(jobTitle), text: t.text(jobTitle, record.id), replyTo: site.email };
}

/** Sends both emails; resolves once both have been tried. */
export async function sendApplicationEmails(record: ApplicationRecord, jobTitle: string) {
  if (!emailEnabled()) return;
  const results = await Promise.allSettled([send(teamNotification(record)), send(candidateConfirmation(record, jobTitle))]);
  for (const [i, r] of results.entries())
    if (r.status === "rejected") console.error(`[careers] ${i === 0 ? "team" : "candidate"} email failed:`, (r.reason as Error).message);
}
