/**
 * Fostier Consulting careers portal → Google Sheet + Drive (free).
 * Deploy as a web app (execute as: Me, access: Anyone) and use its /exec URL
 * as CAREERS_WEBHOOK_URL. See docs/careers-portal.md.
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
    sheet.appendRow(["Submitted", "ID", "Name", "Email", "Phone", "LinkedIn", "Portfolio",
      "Job", "Work authorisation", "Commission only OK", "Knockouts", "CV", "Status"]);
  }
  sheet.appendRow([a.submittedAt || new Date().toISOString(), a.id || "", a.fullName, a.email, a.phone,
    a.linkedinUrl, a.portfolioUrl, a.jobTitle || a.jobSlug, a.workAuthorization, a.commissionOnly,
    (a.knockouts || []).join("; "), cvUrl, a.status || "applied"]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}
