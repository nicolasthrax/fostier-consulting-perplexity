/**
 * Fostier Consulting careers portal → Google Sheet + Drive (free).
 * Deploy as a web app (execute as: Me, access: Anyone) and use its /exec URL
 * as CAREERS_WEBHOOK_URL. See docs/careers-portal.md.
 *
 * Retention: the candidate privacy notice promises deletion 12 months after
 * application. Rows and Drive files are NOT purged automatically here: add a
 * time-driven trigger running purgeExpired() daily (Triggers → Add trigger).
 */
const FOLDER_ID = "PUT_DRIVE_FOLDER_ID_HERE";
const SHARED_SECRET = ""; // must equal CAREERS_WEBHOOK_SECRET; leave empty for the browser fallback

function doPost(e) {
  const payload = JSON.parse(e.postData.contents);
  if (SHARED_SECRET && payload.secret !== SHARED_SECRET) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false })).setMimeType(ContentService.MimeType.JSON);
  }
  const a = payload.application || {};
  let cvUrl = "";
  if (payload.cv && payload.cv.base64) {
    const blob = Utilities.newBlob(Utilities.base64Decode(payload.cv.base64), payload.cv.type, payload.cv.name);
    cvUrl = DriveApp.getFolderById(FOLDER_ID).createFile(blob).getUrl();
  }
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Submitted", "ID", "Language", "Name", "Email", "Phone", "LinkedIn", "Portfolio",
      "Job", "Age", "Work authorisation", "Commission only OK", "Knockouts", "CV", "Status", "University"]);
  }
  sheet.appendRow([a.submittedAt || new Date().toISOString(), a.id || "", a.lang || "", a.fullName, a.email, a.phone,
    a.linkedinUrl, a.portfolioUrl, a.jobTitle || a.jobSlug, a.age || "", a.workAuthorization, a.commissionOnly,
    (a.knockouts || []).join("; "), cvUrl, a.status || "applied", a.university || ""]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}

/** Deletes rows (and their CV files) older than 365 days. Run daily from a time-driven trigger. */
function purgeExpired() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const cutoff = Date.now() - 365 * 24 * 60 * 60 * 1000;
  const rows = sheet.getDataRange().getValues();
  const cvCol = rows[0].indexOf("CV");
  for (let i = rows.length - 1; i >= 1; i--) {
    if (new Date(rows[i][0]).getTime() >= cutoff) continue;
    const url = String(rows[i][cvCol] || "");
    const m = url.match(/[-\w]{25,}/);
    if (m) {
      try { DriveApp.getFileById(m[0]).setTrashed(true); } catch (e) {}
    }
    sheet.deleteRow(i + 1);
  }
}
