# Recruitment portal

A self-contained, zero-cost application portal. It is linked from the site
footer ("Carrières" / "Careers" / "招聘"), but kept out of the sitemap and
search results: every response carries `X-Robots-Tag: noindex, nofollow` and
the page head has `<meta name="robots" content="noindex, nofollow">`.

| Path | What |
| --- | --- |
| `/careers` (or `/<CAREERS_PORTAL_SLUG>`) | Open positions, French (default) |
| `/careers/en` | Open positions, English |
| `/careers[/en]/jobs/<job-slug>` | Job description and 4-step application form |
| `/careers[/en]/privacy` | Candidate privacy notice (PICS) |
| `/careers/admin` (or `/<slug>/admin`) | Password-protected candidate pipeline |
| `/careers/api/*` | Submission and admin endpoints |

## Configuration (environment variables)

| Variable | Required | Purpose |
| --- | --- | --- |
| `CAREERS_ADMIN_PASSWORD` | for admin | Shared admin password (8+ chars). Unset = admin disabled. |
| `CAREERS_PORTAL_SLUG` | no | Serve the portal at an unguessable path, e.g. `join-7f3k2q`. `/careers` pages then 404. Don't use `fr`, `en` or `zh`. Read at build time: redeploy after changing it. |
| `CAREERS_DATA_DIR` | no | Where records and CVs are stored. Default `./data`. |
| `CAREERS_WEBHOOK_URL` | no | Server-side copy of each application (JSON + base64 CV) to a free endpoint. |
| `CAREERS_WEBHOOK_SECRET` | no | Sent as `secret` in the webhook payload so the receiver can reject forgeries. |
| `NEXT_PUBLIC_CAREERS_WEBHOOK_URL` | no | Browser fallback used only when the API route is missing (static hosting). Public by nature: don't put secrets in it. |

Job listings, screening questions, knockout answers and pipeline stages are in
[`lib/careers/config.ts`](../lib/careers/config.ts). There are no general
applications: candidates apply through a specific listing, and you can share a
listing's URL directly. Set a listing's `open` to `false` to stop applications
(its page then 404s; past candidates stay on the admin board).

Screening questions (step 3):

- Work authorisation in Hong Kong. "Would need visa sponsorship" and "remote only" are flagged.
- Comfortable with commission-only pay and no base salary? "No" is flagged.

Flagged answers are not rejected; they show as knockouts on the admin board.

## Storage

When the app runs on a Node server (`next start`, a VPS, Docker…):

- `data/applications/applications.json` — candidate records and pipeline status
- `data/cvs/<id>.pdf|docx` — uploaded CVs (type checked by extension *and* file signature, max 4 MB)

`/data/` is git-ignored and files are written with `0600` permissions. Back the
folder up, and delete records after 12 months (the retention period candidates
agree to).

### Vercel: connect a private Blob store (free tier)

Vercel's filesystem is read-only, so on Vercel applications are stored in
**Vercel Blob**. One-time setup, about a minute:

1. Vercel dashboard → this project → **Storage** → **Create Database** → **Blob**.
2. Choose **Private** access (CVs must not be publicly reachable) and region `hkg1`.
3. Connect it to the project (Production and Preview). Vercel adds
   `BLOB_READ_WRITE_TOKEN` automatically.
4. Redeploy.

The portal switches to Blob automatically when that variable exists: one
private JSON blob per application in `careers/apps/` and the CV in
`careers/cvs/`. The admin board, CV downloads, status changes, exports,
deletions and the 12-month purge all work the same as locally.

Until storage is connected, submissions fail with a message inviting the
candidate to apply by email (with their answers prefilled), and the admin page
shows a warning. CVs are capped at 4 MB because Vercel rejects larger request
bodies.

On fully static hosting (no API routes), the form posts directly to
`NEXT_PUBLIC_CAREERS_WEBHOOK_URL`.

## Free webhook: Google Apps Script

[`google-apps-script.gs`](google-apps-script.gs) appends each application to a
Google Sheet and saves the CV to a Drive folder.

1. Create a Google Sheet, then **Extensions → Apps Script** and paste the file.
2. Set `FOLDER_ID` (a Drive folder for CVs) and `SHARED_SECRET` (match `CAREERS_WEBHOOK_SECRET`).
3. **Deploy → New deployment → Web app**, execute as *Me*, access *Anyone*.
4. Use the `/exec` URL as `CAREERS_WEBHOOK_URL`.

For the browser fallback leave `SHARED_SECRET` empty (a browser can't keep a secret).

## Languages

Candidate pages are in French by default (`/careers`) and in English
(`/careers/en`), with a language link in the header. Old `/careers/fr/...`
links redirect to `/careers/...`. The default is `DEFAULT_CAREERS_LOCALE` in `i18n.ts`. Wording is in
[`lib/careers/i18n.ts`](../lib/careers/i18n.ts); job texts are in `config.ts`
with an `en` and `fr` version of each field. The admin board is English only.

## Legal and compliance

What the portal does, and what stays with you:

| Requirement | Where |
| --- | --- |
| PDPO DPP1(3) collection statement, given before collection | Short notice at the top of step 1, full notice at `/careers/privacy` (FR) and `/careers/en/privacy` (EN) |
| GDPR Art. 13 information (applicants in the EU/EEA) | Same notice: controller, purposes, legal bases, recipients, transfers, retention, rights, CNIL |
| Automatic screening disclosed, with human review (GDPR Art. 22 safeguards) | "No" to commission-only pay starts in **Rejected**; the notice says so, staff see every application and can move it back, and candidates can ask for reconsideration. Other knockouts are only flagged |
| Data minimisation (PCPD Code of Practice on Human Resource Management) | No HKID/passport collected; candidates are asked to leave them and sensitive data out of CVs |
| Retention: unsuccessful applications kept ≤ 2 years under the PCPD code; notice promises 12 months | `RETENTION_DAYS` in `config.ts`; local records and CVs are purged automatically on every submission and admin load. For Google Sheets, add the daily trigger in `google-apps-script.gs` |
| Access, correction and erasure requests (PDPO; GDPR) | Admin → candidate → **Export data** (JSON) and **Delete** |
| Anti-discrimination ordinances (SDO, DDO, FSDO, RDO) | Equal-opportunity statement on every listing; no questions on age, sex, family or ethnicity |
| Job ad pay, licensing and conduct transparency | "Pay and conduct" block on each listing (`terms` in `config.ts`) |
| Main site privacy policy consistency | `/privacy` now mentions job applications and points to the separate notice |

**For the owner to confirm**

- *Engagement type for commission-only roles.* If the person is an **employee**,
  Hong Kong's Minimum Wage Ordinance applies: commission must at least equal the
  statutory minimum wage for hours worked, otherwise the difference must be paid.
  A zero-base arrangement is only straightforward for genuinely self-employed
  agents/consultants. Get the contract reviewed before hiring.
- *Licensing.* Advising on insurance or investment products requires an IA or
  SFC licence (and MPF intermediary registration for MPF). The listing says so;
  adjust it to how you actually onboard and sponsor licences.
- *Google Workspace.* The notice lists Google as a processor "where we use it".
  If you never set up the webhook, you may remove that line.

## Admin notifications

- New applications show a red **New** badge and count in the bell until an
  admin opens them (or uses **Mark all as read**). This is stored with each
  application, so it is shared by everyone who uses the admin.
- The bell panel lists unread applications, marking auto-rejected (declined
  commission) and flagged ones.
- While the dashboard is open it checks for new applications every minute and
  when the tab regains focus, shows a pop-up, and puts the unread count in the
  tab title. **Turn on desktop alerts** in the bell panel adds system
  notifications when the tab is in the background (browser permission
  required). Nothing is sent when the dashboard is closed.
