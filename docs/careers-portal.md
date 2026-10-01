# Recruitment portal (unlisted)

A self-contained, zero-cost application portal. It is **not linked** from the
header, footer, sitemap or robots.txt, every response carries
`X-Robots-Tag: noindex, nofollow` and the page head has
`<meta name="robots" content="noindex, nofollow">`. Share the URL directly
with candidates.

| Path | What |
| --- | --- |
| `/careers` (or `/<CAREERS_PORTAL_SLUG>`) | List of open positions |
| `/careers/jobs/<job-slug>` | Job description and 4-step application form |
| `/careers/admin` (or `/<slug>/admin`) | Password-protected candidate pipeline |
| `/careers/api/*` | Submission and admin endpoints |

## Configuration (environment variables)

| Variable | Required | Purpose |
| --- | --- | --- |
| `CAREERS_ADMIN_PASSWORD` | for admin | Shared admin password (8+ chars). Unset = admin disabled. |
| `CAREERS_PORTAL_SLUG` | no | Serve the portal at an unguessable path, e.g. `join-7f3k2q`. `/careers` pages then 404. Don't use `fr`, `en` or `zh`. |
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
- `data/cvs/<id>.pdf|docx` — uploaded CVs (type checked by extension *and* file signature, max 5 MB)

`/data/` is git-ignored and files are written with `0600` permissions. Back the
folder up, and delete records after 12 months (the retention period candidates
agree to).

### Vercel / read-only hosting

Vercel's filesystem is read-only and per-instance, so local storage won't
persist there. Set `CAREERS_WEBHOOK_URL` and each application is forwarded to it;
the admin board is then only useful on a self-hosted instance. Vercel also caps
request bodies at 4.5 MB, so CVs close to 5 MB will be rejected there.

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
