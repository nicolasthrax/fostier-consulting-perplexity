import { createHash } from "node:crypto";
import { toSummary, type ApplicationRecord } from "./config";

/**
 * The admin board's list, newest first, as summaries, with the exact JSON body the
 * API sends and an ETag of it. The dashboard sends the ETag back when it polls, and
 * gets an empty 304 while nothing changed instead of every application again.
 */
export function adminList(records: readonly ApplicationRecord[]) {
  const applications = [...records].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)).map(toSummary);
  const body = JSON.stringify({ applications });
  return { applications, body, etag: `"${createHash("sha256").update(body).digest("base64url")}"` };
}

/** Whether an If-None-Match header names this ETag (weak or strong, as proxies may rewrite it). */
export function etagMatches(header: string | null, etag: string) {
  if (!header) return false;
  const bare = (t: string) => t.trim().replace(/^W\//, "");
  return header.split(",").some((t) => t.trim() === "*" || bare(t) === bare(etag));
}
