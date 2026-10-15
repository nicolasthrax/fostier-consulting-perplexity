import type { ApplicationRecord } from "./config";

/**
 * Optional copy of each application sent to a free endpoint (a Google Apps Script
 * web app, Make/Zapier free tier, a Discord/Slack webhook relay…). Set
 * CAREERS_WEBHOOK_URL to enable it. On hosts with a read-only filesystem (Vercel),
 * this is where applications end up when no Blob store is connected. See
 * docs/careers-portal.md.
 *
 * The same application can arrive twice (a retry after a lost reply), so receivers
 * should treat `application.id` (also sent as the Idempotency-Key header) as unique.
 */
export const webhookUrl = () => process.env.CAREERS_WEBHOOK_URL || "";

export type WebhookCv = { name: string; type: string; data: Buffer };

/** The endpoint answered with an error status. */
export class WebhookResponseError extends Error {
  constructor(readonly status: number) {
    super(`Webhook responded ${status}`);
    this.name = "WebhookResponseError";
  }
}

export async function forwardToWebhook(record: ApplicationRecord, cv: WebhookCv | null) {
  const url = webhookUrl();
  if (!url) return false;
  const res = await fetch(url, {
    method: "POST",
    // text/plain avoids a CORS preflight and is what Apps Script reads most easily.
    headers: { "Content-Type": "text/plain;charset=utf-8", "Idempotency-Key": record.id },
    body: JSON.stringify({
      source: "fostier-careers-portal",
      secret: process.env.CAREERS_WEBHOOK_SECRET || undefined,
      application: record,
      cv: cv ? { name: cv.name, type: cv.type, base64: cv.data.toString("base64") } : null,
    }),
    redirect: "follow",
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new WebhookResponseError(res.status);
  // Apps Script always answers 200: the receiver in docs/google-apps-script.gs reports a
  // refusal (wrong or missing secret) as {"ok": false}, which must not count as saved.
  if (res.headers.get("content-type")?.includes("json")) {
    const body = (await res.json().catch(() => null)) as { ok?: unknown } | null;
    if (body?.ok === false) throw new WebhookRefusedError();
  }
  return true;
}

/** The endpoint answered but said it didn't keep the application (its secret doesn't match). */
export class WebhookRefusedError extends Error {
  constructor() {
    super("Webhook refused the application (ok: false): check that CAREERS_WEBHOOK_SECRET matches the receiver's secret");
    this.name = "WebhookRefusedError";
  }
}

/**
 * Whether a failed forward certainly didn't reach the endpoint's handler, so trying
 * again can't create a second copy: refused or unreachable (429, 502–504, network
 * error). A timeout or another error status may have been processed, so it isn't retried.
 */
export function safeToRetry(err: unknown) {
  if (err instanceof WebhookResponseError) return err.status === 429 || (err.status >= 502 && err.status <= 504);
  return err instanceof TypeError; // fetch() failing to connect
}
