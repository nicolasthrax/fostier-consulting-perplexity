import { ageLabel, commissionOptions, labelFor, pipelineStages, workAuthorizationOptions, type ApplicationRecord } from "./config";

/**
 * One CSV cell. Values a spreadsheet would run as a formula (=, +, -, @, tab, CR)
 * get a leading apostrophe, because candidates type these fields themselves.
 */
export function csvCell(value: string) {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return /[",\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

const columns: [string, (a: ApplicationRecord) => string][] = [
  ["Reference", (a) => a.id],
  ["Submitted", (a) => a.submittedAt],
  ["Position", (a) => a.jobTitle],
  ["Status", (a) => labelFor([...pipelineStages], a.status)],
  ["Full name", (a) => a.fullName],
  ["Email", (a) => a.email],
  ["Phone", (a) => a.phone],
  ["LinkedIn", (a) => a.linkedinUrl],
  ["Portfolio / GitHub", (a) => a.portfolioUrl],
  ["University", (a) => a.university ?? ""],
  ["18 or over", (a) => ageLabel(a)],
  ["Work authorisation", (a) => labelFor(workAuthorizationOptions, a.workAuthorization)],
  ["Commission-only pay", (a) => labelFor(commissionOptions, a.commissionOnly)],
  ["Screening flags", (a) => a.knockouts.join("; ")],
  ["Language", (a) => a.lang],
  ["CV file", (a) => a.cv?.originalName ?? ""],
];

/** The applications as CSV, with a BOM so Excel reads accented names correctly. */
export function applicationsCsv(apps: ApplicationRecord[]) {
  const rows = [columns.map(([h]) => h), ...apps.map((a) => columns.map(([, get]) => get(a)))];
  return `﻿${rows.map((r) => r.map(csvCell).join(",")).join("\r\n")}\r\n`;
}
