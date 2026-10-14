import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { adminEnabled, currentAdmin, namedLogins } from "@/lib/careers/auth";
import { readDeletionLog } from "@/lib/careers/storage";
import { DELETION_LOG_DAYS, RETENTION_DAYS, labelFor, pipelineStages, publicBase, type DeletionEntry } from "@/lib/careers/config";
import { DEFAULT_CAREERS_LOCALE } from "@/lib/careers/i18n";
import { AdminLogin } from "@/components/careers/AdminLogin";

export const metadata: Metadata = { title: "Deletion log" };
export const dynamic = "force-dynamic";

const dateTimeFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Hong_Kong",
});
const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Hong_Kong" });

const REASONS: Record<DeletionEntry["reason"], string> = { admin: "Deleted by an admin", retention: "Retention period" };

/** Who erased which application and when, for answering erasure requests. Holds no candidate data (see DeletionEntry). */
export default async function DeletionLogPage() {
  const adminBase = `${publicBase(DEFAULT_CAREERS_LOCALE)}/admin`;
  // The admin page explains how to turn the admin on.
  if (!adminEnabled()) redirect(adminBase);
  if (!(await currentAdmin())) return <AdminLogin named={namedLogins()} />;

  let entries: DeletionEntry[] = [];
  let error = "";
  try {
    entries = await readDeletionLog();
  } catch (err) {
    error = `The deletion log couldn't be read: ${(err as Error).message}`;
  }

  return (
    <div className="container-site max-w-admin py-8 sm:py-12">
      <Link href={adminBase} className="focus-ring inline-flex items-center gap-1.5 text-sm font-semibold text-navy">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        <span className="link-underline">All candidates</span>
      </Link>

      <h1 className="h-serif mt-4 text-3xl sm:text-4xl">Deletion log</h1>
      <p className="mt-2 max-w-3xl text-slate">
        Applications erased by an admin or after {RETENTION_DAYS} days, so you can show an erasure request was carried
        out. It holds no candidate personal data, only the reference from their confirmation email, and entries are
        kept for {Math.round(DELETION_LOG_DAYS / 365)} years.
      </p>

      {error ? (
        <p role="alert" className="mt-6 rounded-sm border border-fred-700/30 bg-white px-4 py-3 text-sm text-fred-700">{error}</p>
      ) : entries.length === 0 ? (
        <p className="mt-6 rounded-sm bg-white px-4 py-6 text-sm text-muted">No applications have been deleted yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-sm bg-white">
          <table className="w-full min-w-[48rem] text-left text-sm">
            <thead className="border-b border-line text-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Deleted (Hong Kong time)</th>
                <th scope="col" className="px-3 py-3 font-medium">By</th>
                <th scope="col" className="px-3 py-3 font-medium">Reason</th>
                <th scope="col" className="px-3 py-3 font-medium">Reference</th>
                <th scope="col" className="px-3 py-3 font-medium">Job</th>
                <th scope="col" className="px-3 py-3 font-medium">Submitted</th>
                <th scope="col" className="px-3 py-3 font-medium">Stage</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr key={`${e.id}-${e.at}-${i}`} className="border-b border-line last:border-0">
                  <td className="tabular whitespace-nowrap px-4 py-3 text-ink">{dateTimeFmt.format(new Date(e.at))}</td>
                  <td className="px-3 py-3 font-semibold text-ink">{e.by}</td>
                  <td className="px-3 py-3 text-slate">{REASONS[e.reason] ?? e.reason}</td>
                  <td className="tabular whitespace-nowrap px-3 py-3 text-slate">{e.id}</td>
                  <td className="px-3 py-3 text-slate">{e.jobTitle}</td>
                  <td className="tabular whitespace-nowrap px-3 py-3 text-slate">{dateFmt.format(new Date(e.submittedAt))}</td>
                  <td className="px-3 py-3 text-slate">{labelFor([...pipelineStages], e.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
