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
| `/careers/admin` (or `/<slug>/admin`) | Candidate pipeline, one login per person |
| `/careers/api/*` | Submission and admin endpoints |

## Configuration (environment variables)

| Variable | Required | Purpose |
| --- | --- | --- |
| `CAREERS_ADMIN_USERS` | for admin | One login per person, as JSON: `{"nicolas":"…","lucie":"…"}` (passwords 8+ chars). Status changes, notes and "opened by" record the name. |
| `CAREERS_ADMIN_PASSWORD` | no | Older single shared password (8+ chars), signing in as `admin`. With neither variable set, the admin is disabled. |
| `CAREERS_PORTAL_SLUG` | no | Serve the portal at an unguessable path, e.g. `join-7f3k2q`. `/careers` pages then 404. Don't use `fr`, `en` or `zh`. Read at build time: redeploy after changing it. |
| `CAREERS_DATA_DIR` | no | Where records and CVs are stored. Default `./data`. |
| `CAREERS_WEBHOOK_URL` | no | Server-side copy of each application (JSON + base64 CV) to a free endpoint. |
| `CAREERS_WEBHOOK_SECRET` | no | Sent as `secret` in the webhook payload so the receiver can reject forgeries. |
| `RESEND_API_KEY` | for emails | Added by the Resend integration (see [Emails](#emails)). |
| `CAREERS_EMAIL_FROM` | for emails | Sender on a domain verified in Resend, e.g. `Fostier Consulting <careers@fostierconsulting.com>`. |
| `CAREERS_NOTIFY_EMAIL` | no | Where new-application alerts go. Default: the site's contact email. |

Job listings, screening questions, knockout answers and pipeline stages are in
[`lib/careers/config.ts`](../lib/careers/config.ts). There are no general
applications: candidates apply through a specific listing, and you can share a
listing's URL directly. Set a listing's `open` to `false` to stop applications
(its page then 404s; past candidates stay on the admin board).

Screening questions (step 3):

- 18 or over? Yes/No. Only this is asked, not the exact age (data
  minimisation); "No" is flagged, because minors need a parent's or guardian's
  agreement. Applications from before this change show the exact age they gave.
- University (optional, free text). Never flagged. The admin board highlights
  HKU, CUHK and HKUST in green (table, pipeline cards and candidate page),
  recognising abbreviations, full English, French and Chinese names, and
  dotted forms like "H.K.U.". The patterns are in
  [`lib/careers/universities.ts`](../lib/careers/universities.ts); HKU SPACE
  and other "… University of Hong Kong" names (CityU, EdUHK, Hang Seng…) don't match.
- Work authorisation in Hong Kong. "Would need visa sponsorship" and "remote only" are flagged.
- Comfortable with commission-only pay and no base salary? "No" is flagged and starts in **Rejected**.

Other flagged answers are not rejected; they show as knockouts on the admin board.

Pipeline stages: Applied → Reviewing → Screened → Interview → Decision → Offer →
Hired, plus Rejected. Each change is recorded with who made it and when, and
shows in the candidate's **Activity**. Admins can add internal **Notes** to a
candidate (never shown to them, but included in **Export data**). The board
marks a **Duplicate** when the same email applied to the same listing more than
once, and the table view can export the current filtered list as CSV or move
several candidates to a stage at once.

## Storage

When the app runs on a Node server (`next start`, a VPS, Docker…):

- `data/applications/applications.json` — candidate records and pipeline status
- `data/cvs/<id>.pdf|docx` — uploaded CVs (type checked by extension *and* file signature, max 4 MB)

`/data/` is git-ignored and files are written with `0600` permissions. Back the
folder up. Records are deleted automatically after 12 months (see Legal and compliance).

### Vercel: connect a private Blob store (free tier)

Vercel's filesystem is read-only, so on Vercel applications are stored in
**Vercel Blob**. One-time setup, about a minute:

1. Vercel dashboard → this project → **Storage** → **Create Database** → **Blob**.
2. Choose **Private** access (CVs must not be publicly reachable) and region `hkg1`.
3. Connect it to the project (Production and Preview). Vercel adds
   `BLOB_READ_WRITE_TOKEN` automatically.
4. Redeploy.

The portal switches to Blob automatically when that variable exists: every
record in one private JSON blob, `careers/index.json`, and each CV in
`careers/cvs/`. The admin board, CV downloads, status changes, exports,
deletions and the 12-month purge all work the same as locally. Records stored
one per blob in `careers/apps/` by earlier versions are moved into the index on
the first read, and CVs that no record points to (left behind when a save
failed) are deleted at the same time.

**Keeping within the free tier.** Hobby includes 2,000 advanced operations
(`put`, `list`) and 10,000 simple operations a month, and blocks the store for
30 days past either. So the portal never lists on reads: it fetches the index,
and a request that already has the latest copy gets a cheap "not modified".
Each submission costs two puts (CV and index), each status change, note, "mark
read" or first opening of a candidate one put. Writes are conditional on the
index's ETag and retried on conflict, so two admins acting at once don't undo
each other. The open dashboard checks for new applications every 3 minutes
(every 15 while the tab is in the background). Watch usage under Vercel →
Observability → Blob.

Until storage is connected, submissions fail with a message inviting the
candidate to apply by email (with their answers prefilled), and the admin page
shows a warning. CVs are capped at 4 MB because Vercel rejects larger request
bodies.

## Free webhook: Google Apps Script

[`google-apps-script.gs`](google-apps-script.gs) appends each application to a
Google Sheet and saves the CV to a Drive folder.

1. Create a Google Sheet, then **Extensions → Apps Script** and paste the file.
2. Set `FOLDER_ID` (a Drive folder for CVs) and `SHARED_SECRET` (match `CAREERS_WEBHOOK_SECRET`).
3. **Deploy → New deployment → Web app**, execute as *Me*, access *Anyone*.
4. Use the `/exec` URL as `CAREERS_WEBHOOK_URL`.

Sheets set up before the yes/no age question keep their old "Age" header; the
column now holds `yes`/`no` (or the exact age for older applications).

## Emails

On each application (once it's stored), the portal sends two emails through
[Resend](https://resend.com) (free tier, via the Vercel Marketplace):

- to the team (`CAREERS_NOTIFY_EMAIL`): name, listing, status, flags and a link
  to the candidate's admin page. No CV or contact details.
- to the candidate, in their language: a confirmation with their reference. It
  contains only our wording and the job title, nothing they typed, so the form
  can't be used to send arbitrary text to someone else's address.

Setup: run `vercel integration add resend/resend-email` (or add Resend from the
dashboard's Marketplace), verify the sending domain in Resend, set
`CAREERS_EMAIL_FROM`, and redeploy. Until both `RESEND_API_KEY` and
`CAREERS_EMAIL_FROM` are set, no email is sent. A failed email is logged and
never fails the application.

## Bot protection

[Vercel BotID](https://vercel.com/docs/botid) checks the application form and
the admin login (`CareersShell` loads its client on portal pages only;
`checkBotId()` runs in both routes). A request classified as a bot gets a 403;
on the form, the candidate is offered the email route instead. Every block is
logged as `[careers] BotID blocked a request to …`. Locally, BotID always reports
a human, so **test a Preview deployment after any change to the
Content-Security-Policy** in `next.config.mjs`: if the CSP stopped BotID's
browser script from running, every real candidate would be blocked too. The
candidate privacy notice discloses the check. The in-memory login throttle (5 attempts per IP per
15 minutes) only sees one server instance, so BotID is what stops distributed
guessing; for more, add a Vercel Firewall rate-limit rule on
`/careers/api/admin/login`.

CVs opened in the browser are served with `Content-Security-Policy: sandbox`,
so a crafted file can't run scripts on the site's origin.

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
| Retention: unsuccessful applications kept ≤ 2 years under the PCPD code; notice promises 12 months | `RETENTION_DAYS` in `config.ts`; records and CVs are purged automatically on every submission and admin load, except candidates at **Offer** or **Hired** (`RETAINED_STAGES`): move a hire's data to their personnel file, then delete it here. For Google Sheets, add the daily trigger in `google-apps-script.gs` |
| Access, correction and erasure requests (PDPO; GDPR) | Admin → candidate → **Export data** (JSON) and **Delete** |
| Anti-discrimination ordinances (SDO, DDO, FSDO, RDO) | Equal-opportunity statement on every listing; no questions on sex, family or ethnicity; age only as "18 or over?", needed for minors' parental agreement |
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
- *Resend.* The notice lists Resend as a processor for the emails. If you don't
  set up emails, you may remove that line.

## Admin notifications

- New applications show a red **New** badge and count in the bell until an
  admin opens them (or uses **Mark all as read**). This is stored with each
  application, so it is shared by everyone who uses the admin.
- The bell panel lists unread applications, marking auto-rejected (declined
  commission) and flagged ones.
- While the dashboard is open it checks for new applications every 3 minutes
  (15 in a background tab) and when the tab regains focus, shows a pop-up, and
  puts the unread count in the tab title. **Turn on desktop alerts** in the
  bell panel adds system notifications when the tab is in the background
  (browser permission required).
- With [emails](#emails) set up, the team also gets an email for each new
  application, whether or not the dashboard is open.
