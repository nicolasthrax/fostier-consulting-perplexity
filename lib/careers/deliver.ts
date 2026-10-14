import type { ApplicationRecord } from "./config";
import { addApplication, storageAvailable } from "./storage";
import { forwardToWebhook, safeToRetry, webhookUrl, type WebhookCv } from "./webhook";

/** Wait before the one retry of a backup copy that certainly didn't arrive. */
export const BACKUP_RETRY_MS = 5_000;

const reason = (err: unknown) => (err instanceof Error ? err.message : String(err));

/**
 * The webhook as a backup of an application already in primary storage: tried
 * once more if it certainly didn't arrive, then logged with the reference only
 * (never the CV or the secret). The record stays in primary storage either way,
 * so a copy that never arrived can be re-sent from the admin's data export.
 */
export async function forwardBackup(record: ApplicationRecord, cv: WebhookCv) {
  for (let attempt = 1; ; attempt++) {
    try {
      await forwardToWebhook(record, cv);
      return true;
    } catch (err) {
      if (attempt < 2 && safeToRetry(err)) {
        await new Promise((r) => setTimeout(r, BACKUP_RETRY_MS));
        continue;
      }
      console.error(`[careers] webhook backup failed for ${record.id} (saved in primary storage): ${reason(err)}`);
      return false;
    }
  }
}

/**
 * Saves an application: primary storage (Blob or local files), plus the optional
 * webhook copy. Resolves to whether at least one durable copy was saved, the only
 * case in which the candidate may be told it worked.
 *
 * Once primary storage has it, the webhook is only a backup and runs through
 * `defer` (Next.js `after()`), so a slow endpoint can't hold up the candidate. When
 * primary storage is missing or failed, the webhook is the only copy and is awaited.
 * `after()` is not a durable queue: a backup that fails for good is logged (see
 * forwardBackup), not retried later.
 */
export async function deliverApplication(
  record: ApplicationRecord,
  cv: WebhookCv,
  defer: (task: () => Promise<unknown>) => void
): Promise<boolean> {
  let stored = false;
  if (storageAvailable()) {
    try {
      // Also drops expired applications in the same write.
      await addApplication(record, cv.data);
      stored = true;
    } catch (err) {
      console.error("[careers] save failed:", reason(err));
    }
  } else {
    console.error("[careers] no storage configured: connect a Vercel Blob store or set CAREERS_WEBHOOK_URL");
  }

  if (!webhookUrl()) return stored;
  if (stored) {
    defer(() => forwardBackup(record, cv));
    return true;
  }
  try {
    return await forwardToWebhook(record, cv);
  } catch (err) {
    console.error("[careers] webhook failed:", reason(err));
    return false;
  }
}
