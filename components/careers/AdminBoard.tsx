"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ChevronRight, FileText, LayoutGrid, LogOut, Rows3 } from "lucide-react";
import { API_BASE, labelFor, type ApplicationRecord, type Option, type Stage } from "@/lib/careers/config";

type StageOption = { value: Stage; label: string };

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Hong_Kong" });

export function AdminBoard({
  initial,
  storageError,
  storageStatus,
  stages,
  jobs,
  workAuthorizations,
  commissionOptions,
  retentionDays,
  adminBase,
}: {
  initial: ApplicationRecord[];
  storageError: string;
  storageStatus: string;
  stages: StageOption[];
  jobs: { slug: string; title: string; open: boolean }[];
  workAuthorizations: Option[];
  commissionOptions: Option[];
  retentionDays: number;
  /** Browser path of the admin (follows a custom portal slug). */
  adminBase: string;
}) {
  const router = useRouter();
  const [apps, setApps] = useState(initial);
  const [view, setView] = useState<"board" | "table">("board");
  const [query, setQuery] = useState("");
  const [job, setJob] = useState("");
  const [saveError, setSaveError] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apps.filter((a) => (!job || a.jobSlug === job) && (!q || `${a.fullName} ${a.email}`.toLowerCase().includes(q)));
  }, [apps, query, job]);
  const pipeline = stages.filter((s) => s.value !== "rejected");
  const rejected = filtered.filter((a) => a.status === "rejected");
  const href = (a: ApplicationRecord) => `${adminBase}/${a.id}`;

  const setStatus = async (id: string, status: Stage) => {
    const prev = apps;
    setSaveError("");
    setApps((list) => list.map((a) => (a.id === id ? { ...a, status } : a)));
    const res = await fetch(`${API_BASE}/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).catch(() => null);
    if (res?.status === 401) return router.refresh();
    if (!res?.ok) {
      setApps(prev);
      setSaveError("The status couldn't be saved. Try again.");
    }
  };

  const logout = async () => {
    await fetch(`${API_BASE}/admin/logout`, { method: "POST" }).catch(() => null);
    router.refresh();
  };

  // Render helpers (plain functions, not components, so selects keep focus across re-renders).
  const statusSelect = (app: ApplicationRecord) => (
    <select
      value={app.status}
      onChange={(e) => setStatus(app.id, e.target.value as Stage)}
      aria-label={`Status for ${app.fullName}`}
      className="focus-ring rounded-sm border border-line bg-white px-2 py-1.5 text-sm text-ink hover:border-muted"
    >
      {stages.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
    </select>
  );

  const flag = (app: ApplicationRecord) =>
    app.knockouts.length ? (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-fred-700">
        <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
        {app.knockouts.join(" · ")}
      </span>
    ) : null;

  const card = (a: ApplicationRecord) => (
    <li key={a.id} className="rounded-sm border border-line bg-white">
      <Link href={href(a)} className="focus-ring group block p-3 hover:bg-mist">
        <span className="flex items-start justify-between gap-2">
          <span className="font-semibold text-navy group-hover:underline">{a.fullName}</span>
          <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
        </span>
        <span className="mt-1 block text-sm text-slate">{a.jobTitle}</span>
        <span className="mt-1 block text-xs text-muted tabular">{dateFmt.format(new Date(a.submittedAt))}</span>
        <span className="mt-2 block text-xs text-slate">
          <span className="text-muted">Work: </span>{labelFor(workAuthorizations, a.workAuthorization)}
        </span>
        <span className="block text-xs text-slate">
          <span className="text-muted">Commission only: </span>{a.commissionOnly === "yes" ? "Yes" : "No"}
        </span>
        {a.cv && (
          <span className="mt-1 inline-flex items-center gap-1 text-xs text-slate">
            <FileText className="h-3.5 w-3.5 text-navy" aria-hidden="true" />
            CV attached
          </span>
        )}
        {a.knockouts.length > 0 && <span className="mt-1 block">{flag(a)}</span>}
      </Link>
      <div className="border-t border-line px-3 py-2">{statusSelect(a)}</div>
    </li>
  );

  return (
    <div className="container-site py-8 sm:py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="h-serif text-3xl sm:text-4xl">Candidates</h1>
          <p className="label mt-1 tabular">{apps.length} application{apps.length === 1 ? "" : "s"} · tap a name to see the CV and answers</p>
          {storageStatus && <p className="mt-1 text-sm font-medium text-wechat-700">✓ {storageStatus}</p>}
        </div>
        <button type="button" onClick={logout} className="btn-outline focus-ring !py-2.5">
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sign out
        </button>
      </div>

      {storageError && (
        <p role="alert" className="mt-6 rounded-sm border border-fred-700/30 bg-white px-4 py-3 text-sm font-medium text-fred-700">{storageError}</p>
      )}
      {saveError && (
        <p role="alert" className="mt-6 rounded-sm border border-fred-700/30 bg-white px-4 py-3 text-sm font-medium text-fred-700">{saveError}</p>
      )}

      <div className="mt-6 grid gap-3 border-y border-line py-4 sm:flex sm:flex-wrap sm:items-center">
        <label className="sr-only" htmlFor="admin-search">Search candidates</label>
        <input
          id="admin-search"
          type="search"
          placeholder="Search name or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="focus-ring w-full rounded-sm border border-line bg-white px-3 py-2.5 text-[15px] text-ink sm:w-72"
        />
        <label className="sr-only" htmlFor="admin-job">Filter by job</label>
        <select id="admin-job" value={job} onChange={(e) => setJob(e.target.value)} className="focus-ring w-full rounded-sm border border-line bg-white px-3 py-2.5 text-[15px] text-ink sm:w-auto">
          <option value="">All jobs</option>
          {jobs.map((j) => <option key={j.slug} value={j.slug}>{j.title}{j.open ? "" : " (closed)"}</option>)}
        </select>
        <div className="inline-flex w-fit rounded-sm border border-line bg-white p-0.5 sm:ml-auto" role="group" aria-label="View">
          {([["board", LayoutGrid, "Pipeline"], ["table", Rows3, "Table"]] as const).map(([v, Icon, label]) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              aria-pressed={view === v}
              className={`focus-ring inline-flex items-center gap-1.5 rounded-sm px-3 py-2 text-sm font-semibold ${view === v ? "bg-navy text-white" : "text-slate hover:text-navy"}`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {view === "board" ? (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-5">
            {pipeline.map((stage) => {
              const items = filtered.filter((a) => a.status === stage.value);
              return (
                <section key={stage.value} aria-labelledby={`col-${stage.value}`} className="min-w-0 rounded-sm bg-white/60">
                  <h2 id={`col-${stage.value}`} className="flex items-baseline justify-between border-b border-line bg-white px-3 py-3 font-serif text-lg text-ink">
                    {stage.label}
                    <span className="font-sans text-sm text-muted tabular">{items.length}</span>
                  </h2>
                  <ul className="space-y-2 p-2">
                    {items.map(card)}
                    {!items.length && <li className="px-1 py-4 text-sm text-muted">No candidates</li>}
                  </ul>
                </section>
              );
            })}
          </div>

          <section aria-labelledby="col-rejected" className="mt-8 rounded-sm border border-fred-700/20 bg-white/60">
            <h2 id="col-rejected" className="flex items-baseline justify-between border-b border-fred-700/20 bg-white px-4 py-3 font-serif text-lg text-ink">
              <span>
                Rejected
                <span className="ml-2 font-sans text-sm text-muted">includes candidates who declined commission-only pay</span>
              </span>
              <span className="font-sans text-sm text-muted tabular">{rejected.length}</span>
            </h2>
            <ul className="grid gap-2 p-2 sm:grid-cols-2 lg:grid-cols-4">
              {rejected.map(card)}
              {!rejected.length && <li className="px-2 py-4 text-sm text-muted">No rejected candidates</li>}
            </ul>
          </section>
        </>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-sm bg-white">
          <table className="w-full min-w-[56rem] text-left text-[15px]">
            <thead className="border-b border-line text-sm text-muted">
              <tr>
                {["Name", "Job", "Submitted", "Work authorisation", "Commission only", "Status"].map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <Link href={href(a)} className="focus-ring font-semibold text-navy link-underline">{a.fullName}</Link>
                    <div className="text-sm text-muted">{a.email}</div>
                  </td>
                  <td className="px-4 py-3 text-slate">{a.jobTitle}</td>
                  <td className="px-4 py-3 tabular text-slate">{dateFmt.format(new Date(a.submittedAt))}</td>
                  <td className="px-4 py-3 text-sm text-slate">{labelFor(workAuthorizations, a.workAuthorization)}</td>
                  <td className={`px-4 py-3 text-sm ${a.commissionOnly === "yes" ? "text-slate" : "font-semibold text-fred-700"}`}>
                    {labelFor(commissionOptions, a.commissionOnly).split(",")[0]}
                  </td>
                  <td className="px-4 py-3">{statusSelect(a)}</td>
                </tr>
              ))}
              {!filtered.length && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted">No candidates match.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-8 text-sm text-muted">
        Applications are deleted automatically {retentionDays} days after submission, as the candidate privacy notice promises.
        Move hired candidates&apos; documents to their personnel file before then.
      </p>
    </div>
  );
}
