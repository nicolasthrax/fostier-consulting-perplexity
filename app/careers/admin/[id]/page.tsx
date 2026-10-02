import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { after } from "next/server";
import { AlertTriangle, ArrowLeft, Copy, Download, ExternalLink, FileText } from "lucide-react";
import { currentAdmin } from "@/lib/careers/auth";
import { isSafeId, markViewed, readApplications } from "@/lib/careers/storage";
import {
  API_BASE,
  ageLabel,
  commissionOptions,
  duplicatesOf,
  labelFor,
  pipelineStages,
  publicBase,
  workAuthorizationOptions,
  type ApplicationRecord,
} from "@/lib/careers/config";
import { matchTargetUniversities } from "@/lib/careers/universities";
import { AdminActions } from "@/components/careers/AdminActions";
import { AdminNotes } from "@/components/careers/AdminNotes";
import { UniversityBadges } from "@/components/careers/UniversityBadges";
import { DEFAULT_CAREERS_LOCALE } from "@/lib/careers/i18n";

export const metadata: Metadata = { title: "Candidate" };
export const dynamic = "force-dynamic";

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Hong_Kong",
});

const stageLabel = (value: string) => labelFor([...pipelineStages], value);

/** Status changes newest first, then when the application was first opened. */
function activityOf(app: ApplicationRecord) {
  const items: { at: string; text: React.ReactNode }[] = (app.history ?? []).map((h) => ({
    at: h.at,
    text:
      h.from === null ? (
        <>Application received → {stageLabel(h.to)}</>
      ) : (
        <>
          <span className="font-semibold">{h.by}</span> moved from {stageLabel(h.from)} to {stageLabel(h.to)}
        </>
      ),
  }));
  if (app.viewedAt)
    items.push({ at: app.viewedAt, text: <>Opened by <span className="font-semibold">{app.viewedBy ?? "an admin"}</span></> });
  return items.sort((a, b) => b.at.localeCompare(a.at));
}

function ExtLink({ href }: { href: string }) {
  if (!href) return <>—</>;
  // Only http(s) links are accepted at submission; re-check before rendering as a link.
  if (!/^https?:\/\//i.test(href)) return <>{href}</>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer nofollow" className="focus-ring inline-flex items-center gap-1 break-all text-navy link-underline">
      {href.replace(/^https?:\/\/(www\.)?/, "")}
      <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
    </a>
  );
}

export default async function CandidatePage({ params }: { params: Promise<{ id: string }> }) {
  const adminBase = `${publicBase(DEFAULT_CAREERS_LOCALE)}/admin`;
  const admin = await currentAdmin();
  if (!admin) redirect(adminBase);
  const { id } = await params;
  if (!isSafeId(id)) notFound();
  // One read of the index serves both this record and its duplicates.
  const all = await readApplications();
  const app = all.find((a) => a.id === id);
  if (!app) notFound();
  // Opening an application clears its "new" notification; shown in Activity straight away.
  // The write (a re-read plus a full index upload to Blob) runs after the response, so it doesn't hold up the page.
  if (!app.viewedAt) {
    after(() => markViewed(app.id, admin).catch(() => undefined));
    app.viewedAt = new Date().toISOString();
    app.viewedBy = admin;
  }
  const duplicates = duplicatesOf(app, all);
  const activity = activityOf(app);

  const cvUrl = `${API_BASE}/admin/cv/${app.id}`;
  const isPdf = app.cv?.file.endsWith(".pdf");
  const rows: [string, React.ReactNode][] = [
    ["Email", <a key="e" className="focus-ring break-all text-navy link-underline" href={`mailto:${app.email}`}>{app.email}</a>],
    ["Phone", <a key="p" className="focus-ring tabular text-navy link-underline" href={`tel:${app.phone.replace(/[^\d+]/g, "")}`}>{app.phone}</a>],
    ["LinkedIn", <ExtLink key="l" href={app.linkedinUrl} />],
    ["Portfolio / GitHub", <ExtLink key="f" href={app.portfolioUrl} />],
    ["Applied in", app.lang === "fr" ? "French" : "English"],
    ["Submitted", dateFmt.format(new Date(app.submittedAt))],
  ];
  const answers: [string, React.ReactNode][] = [
    ["18 or over", ageLabel(app)],
    [
      "University",
      app.university ? (
        <span key="u" className="flex flex-wrap items-center gap-2">
          {app.university}
          <UniversityBadges codes={matchTargetUniversities(app.university)} />
        </span>
      ) : "—",
    ],
    ["Work authorisation in Hong Kong", labelFor(workAuthorizationOptions, app.workAuthorization)],
    ["Comfortable with commission-only pay, no base salary?", labelFor(commissionOptions, app.commissionOnly)],
  ];

  return (
    <div className="container-site py-8 sm:py-12">
      <Link href={adminBase} className="focus-ring inline-flex items-center gap-1.5 text-sm font-semibold text-navy">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        <span className="link-underline">All candidates</span>
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="h-serif text-3xl sm:text-4xl">{app.fullName}</h1>
          <p className="mt-1 text-slate">{app.jobTitle}</p>
        </div>
      </div>

      <AdminActions id={app.id} name={app.fullName} status={app.status} stages={[...pipelineStages]} adminBase={adminBase} />

      {app.knockouts.length > 0 && (
        <div className="mt-6 flex gap-3 rounded-sm border border-fred-700/30 bg-white px-4 py-3 text-sm text-fred-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">Screening flags</p>
            <ul className="mt-1 list-disc pl-5">{app.knockouts.map((k) => <li key={k}>{k}</li>)}</ul>
          </div>
        </div>
      )}

      {duplicates.length > 0 && (
        <div className="mt-4 flex gap-3 rounded-sm border border-navy/30 bg-mist px-4 py-3 text-sm text-ink">
          <Copy className="mt-0.5 h-4 w-4 shrink-0 text-navy" aria-hidden="true" />
          <div>
            <p className="font-semibold">Possible duplicate</p>
            <p className="mt-0.5 text-slate">
              {app.email} also applied for this role {duplicates.length === 1 ? "once more" : `${duplicates.length} more times`}:
            </p>
            <ul className="mt-1 list-disc pl-5">
              {duplicates.map((d) => (
                <li key={d.id}>
                  <Link href={`${adminBase}/${d.id}`} className="focus-ring text-navy link-underline">
                    {dateFmt.format(new Date(d.submittedAt))}
                  </Link>{" "}
                  · {stageLabel(d.status)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[22rem_1fr]">
        <div className="space-y-6">
          <section className="rounded-sm bg-white p-5" aria-labelledby="h-contact">
            <h2 id="h-contact" className="font-serif text-xl text-ink">Contact</h2>
            <dl className="mt-3 space-y-3">
              {rows.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-sm text-muted">{k}</dt>
                  <dd className="text-[15px] text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="rounded-sm bg-white p-5" aria-labelledby="h-answers">
            <h2 id="h-answers" className="font-serif text-xl text-ink">Screening answers</h2>
            <dl className="mt-3 space-y-3">
              {answers.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-sm text-muted">{k}</dt>
                  <dd className="text-[15px] font-medium text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="rounded-sm bg-white p-5" aria-labelledby="h-notes">
            <h2 id="h-notes" className="font-serif text-xl text-ink">Notes</h2>
            <p className="mt-1 text-sm text-muted">Internal, never shown to the candidate. Included in a data access export.</p>
            <AdminNotes id={app.id} notes={app.notes ?? []} adminBase={adminBase} />
          </section>
          <section className="rounded-sm bg-white p-5" aria-labelledby="h-activity">
            <h2 id="h-activity" className="font-serif text-xl text-ink">Activity</h2>
            {activity.length === 0 ? (
              <p className="mt-3 text-sm text-muted">No recorded activity.</p>
            ) : (
              <ol className="mt-3 space-y-3 border-l border-line pl-4">
                {activity.map((item, i) => (
                  <li key={`${item.at}-${i}`} className="text-[15px] text-ink">
                    <span className="tabular text-sm text-muted">{dateFmt.format(new Date(item.at))}</span> · {item.text}
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        <section className="rounded-sm bg-white p-5" aria-labelledby="h-cv">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="h-cv" className="font-serif text-xl text-ink">CV</h2>
            {app.cv && (
              <div className="flex flex-wrap gap-2">
                {isPdf && (
                  <a href={`${cvUrl}?inline=1`} target="_blank" rel="noopener" className="btn-outline focus-ring !py-2.5">
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    Open
                  </a>
                )}
                <a href={cvUrl} className="btn-primary focus-ring !py-2.5">
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download
                </a>
              </div>
            )}
          </div>
          {!app.cv ? (
            <p className="mt-3 text-sm text-muted">No CV stored.</p>
          ) : isPdf ? (
            <iframe src={`${cvUrl}?inline=1`} title={`CV of ${app.fullName}`} className="mt-4 h-[75vh] w-full rounded-sm border border-line" />
          ) : (
            <p className="mt-3 text-sm text-muted">{app.cv.originalName} — Word file, use Download to open it.</p>
          )}
        </section>
      </div>
    </div>
  );
}
