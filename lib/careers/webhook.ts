import type { ApplicationRecord } from "./config";

/**
 * Optional copy of each application sent to a free endpoint (a Google Apps Script
 * web app, Make/Zapier free tier, a Discord/Slack webhook relay…). Set
 * CAREERS_WEBHOOK_URL to enable it. On hosts with a read-only filesystem (Vercel),
 * this is where applications end up. See docs/careers-portal.md.
 */
export const webhookUrl = () => process.env.CAREERS_WEBHOOK_URL || "";

export async function forwardToWebhook(
  record: ApplicationRecord,
  cv: { name: string; type: string; data: Buffer } | null
) {
  const url = webhookUrl();
  if (!url) return false;
  const res = await fetch(url, {
    method: "POST",
    // text/plain avoids a CORS preflight and is what Apps Script reads most easily.
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      source: "fostier-careers-portal",
      secret: process.env.CAREERS_WEBHOOK_SECRET || undefined,
      application: record,
      cv: cv ? { name: cv.name, type: cv.type, base64: cv.data.toString("base64") } : null,
    }),
    redirect: "follow",
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  return true;
}
