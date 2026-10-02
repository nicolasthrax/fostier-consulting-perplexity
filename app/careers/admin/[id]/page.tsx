import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AlertTriangle, ArrowLeft, Download, ExternalLink, FileText } from "lucide-react";
import { isAdmin } from "@/lib/careers/auth";
import { isSafeId, readApplication } from "@/lib/careers/storage";
import { API_BASE, commissionOptions, labelFor, pipelineStages, publicBase, workAuthorizationOptions } from "@/lib/careers/config";
import { AdminActions } from "@/components/careers/AdminActions";
import { DEFAULT_CAREERS_LOCALE } from "@/lib/careers/i18n";

export const metadata: Metadata = { title: "Candidate" };
export const dynamic = "force-dynamic";

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Hong_Kong",
});

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
  if (!(await isAdmin())) redirect(adminBase);
  const { id } = await params;
  if (!isSafeId(id)) notFound();
  const app = await readApplication(id);
  if (!app) notFound();

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
  const answers: [string, string][] = [
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
