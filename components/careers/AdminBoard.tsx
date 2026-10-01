"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Download, ExternalLink, FileJson, LayoutGrid, LogOut, Rows3, Trash2, X } from "lucide-react";
import { API_BASE, labelFor, type ApplicationRecord, type Option, type Stage } from "@/lib/careers/config";

type StageOption = { value: Stage; label: string };

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Hong_Kong" });

export function AdminBoard({
  initial,
  storageError,
  stages,
  jobs,
  workAuthorizations,
  commissionOptions,
  retentionDays,
}: {
  initial: ApplicationRecord[];
  storageError: string;
  stages: StageOption[];
  jobs: { slug: string; title: string; open: boolean }[];
  workAuthorizations: Option[];
  commissionOptions: Option[];
  retentionDays: number;
}) {
  const router = useRouter();
  const [apps, setApps] = useState(initial);
  const [view, setView] = useState<"board" | "table">("board");
  const [query, setQuery] = useState("");
  const [job, setJob] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apps.filter(
      (a) => (!job || a.jobSlug === job) && (!q || `${a.fullName} ${a.email}`.toLowerCase().includes(q))
    );
  }, [apps, query, job]);
  const open = apps.find((a) => a.id === openId) ?? null;

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

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
      setSaveError("The status couldn't be saved. Check the server can write to the data folder.");
    }
  };

  const remove = async (app: ApplicationRecord) => {
    if (!window.confirm(`Delete ${app.fullName}'s application and CV permanently? Use this when a candidate withdraws or asks for erasure.`)) return;
    setSaveError("");
    const res = await fetch(`${API_BASE}/admin/applications/${app.id}`, { method: "DELETE" }).catch(() => null);
    if (res?.status === 401) return router.refresh();
    if (!res?.ok) return setSaveError("The application couldn't be deleted. Check the server can write to the data folder.");
    setOpenId(null);
    setApps((list) => list.filter((a) => a.id !== app.id));
  };

  const logout = async () => {
    await fetch(`${API_BASE}/admin/logout`, { method: "POST" }).catch(() => null);
    router.refresh();
  };

  // Render helpers (plain functions, not components, so selects keep focus across re-renders).
  const statusSelect = (app: ApplicationRecord, compact?: boolean) => (
    <select
      value={app.status}
      onChange={(e) => setStatus(app.id, e.target.value as Stage)}
      aria-label={`Status for ${app.fullName}`}
      className={`focus-ring rounded-sm border border-line bg-white text-ink hover:border-muted ${compact ? "px-2 py-1.5 text-sm" : "px-3 py-2.5 text-[15px]"}`}
    >
      {stages.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
    </select>
  );

  const flag = (app: ApplicationRecord) =>
    app.knockouts.length ? (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-fred-700" title={app.knockouts.join("; ")}>
        <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
        {app.knockouts.length === 1 ? "Knockout" : `${app.knockouts.length} knockouts`}
        <span className="sr-only">: {app.knockouts.join("; ")}</span>
      </span>
    ) : null;

  const nameButton = (app: ApplicationRecord) => (
    <button type="button" onClick={() => setOpenId(app.id)} className="focus-ring text-left font-semibold text-navy link-underline">
      {app.fullName}
    </button>
  );

  return (
    <div className="container-site py-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="h-serif text-3xl sm:text-4xl">Candidates</h1>
          <p className="label mt-1 tabular">{apps.length} application{apps.length === 1 ? "" : "s"}</p>
          <p className="mt-1 text-sm text-muted">
            Applications are deleted automatically {retentionDays} days after submission, as the candidate privacy notice promises.
            Move hired candidates&apos; documents to their personnel file before then.
          </p>
        </div>
        <button type="button" onClick={logout} className="btn-outline focus-ring !py-2.5">
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sign out
        </button>
      </div>

      {storageError && (
        <p role="alert" className="mt-6 rounded-sm border border-fred-700/30 bg-white px-4 py-3 text-sm font-medium text-fred-700">
          {storageError}
        </p>
      )}
      {saveError && (
        <p role="alert" className="mt-6 rounded-sm border border-fred-700/30 bg-white px-4 py-3 text-sm font-medium text-fred-700">{saveError}</p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3 border-y border-line py-4">
        <label className="sr-only" htmlFor="admin-search">Search candidates</label>
        <input
          id="admin-search"
          type="search"
          placeholder="Search name or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="focus-ring min-w-0 flex-1 rounded-sm border border-line bg-white px-3 py-2.5 text-[15px] text-ink sm:max-w-xs"
        />
        <label className="sr-only" htmlFor="admin-job">Filter by job</label>
        <select id="admin-job" value={job} onChange={(e) => setJob(e.target.value)} className="focus-ring rounded-sm border border-line bg-white px-3 py-2.5 text-[15px] text-ink">
          <option value="">All jobs</option>
          {jobs.map((j) => <option key={j.slug} value={j.slug}>{j.title}{j.open ? "" : " (closed)"}</option>)}
        </select>
        <div className="ml-auto inline-flex rounded-sm border border-line bg-white p-0.5" role="group" aria-label="View">
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
        <div className="mt-6 grid gap-4 overflow-x-auto pb-2 md:grid-cols-5">
          {stages.map((stage) => {
            const items = filtered.filter((a) => a.status === stage.value);
            return (
              <section key={stage.value} aria-labelledby={`col-${stage.value}`} className="min-w-0 rounded-sm bg-white">
                <h2 id={`col-${stage.value}`} className="flex items-baseline justify-between border-b border-line px-3 py-3 font-serif text-lg text-ink">
                  {stage.label}
                  <span className="text-sm font-sans text-muted tabular">{items.length}</span>
                </h2>
                <ul className="space-y-2 p-2">
                  {items.map((a) => (
                    <li key={a.id} className="space-y-2 rounded-sm border border-line p-3">
                      {nameButton(a)}
                      <p className="text-sm text-slate">{a.jobTitle}</p>
                      <p className="text-xs text-muted tabular">
                        {dateFmt.format(new Date(a.submittedAt))}
                      </p>
                      {flag(a)}
                      {statusSelect(a, true)}
                    </li>
                  ))}
                  {!items.length && <li className="px-1 py-4 text-sm text-muted">No candidates</li>}
                </ul>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-sm bg-white">
          <table className="w-full min-w-[48rem] text-left text-[15px]">
            <thead className="border-b border-line text-sm text-muted">
              <tr>
                {["Name", "Job", "Submitted", "Flags", "Status"].map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">{nameButton(a)}<div className="text-sm text-muted">{a.email}</div></td>
                  <td className="px-4 py-3 text-slate">{a.jobTitle}</td>
                  <td className="px-4 py-3 tabular text-slate">{dateFmt.format(new Date(a.submittedAt))}</td>
                  <td className="px-4 py-3">{flag(a)}</td>
                  <td className="px-4 py-3">{statusSelect(a, true)}</td>
                </tr>
              ))}
              {!filtered.length && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted">No candidates match.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <dialog
        ref={dialogRef}
        onClose={() => setOpenId(null)}
        aria-labelledby="candidate-title"
        className="m-0 ml-auto h-full max-h-none w-full max-w-xl overflow-y-auto bg-white p-0 shadow-pop backdrop:bg-nuit/40"
      >
        {open && (
          <div>
            <div aria-hidden="true" className="par-avion h-1.5" />
            <div className="flex items-start justify-between gap-4 p-6 pb-4">
              <div>
                <h2 id="candidate-title" className="h-serif text-3xl">{open.fullName}</h2>
                <p className="mt-1 text-slate">{open.jobTitle}</p>
              </div>
              <button type="button" onClick={() => setOpenId(null)} className="btn-icon focus-ring !h-10 !w-10" aria-label="Close">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="space-y-6 px-6 pb-8">
              <div className="flex flex-wrap items-center gap-3">
                {statusSelect(open)}
                {open.cv ? (
                  <a href={`${API_BASE}/admin/cv/${open.id}`} className="btn-primary focus-ring !py-2.5">
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Download CV
                  </a>
                ) : (
                  <span className="text-sm text-muted">No CV stored locally</span>
                )}
                <a href={`${API_BASE}/admin/applications/${open.id}`} className="btn-outline focus-ring !py-2.5" title="For data access requests">
                  <FileJson className="h-4 w-4" aria-hidden="true" />
                  Export data
                </a>
                <button type="button" onClick={() => remove(open)} className="btn-outline focus-ring !py-2.5 hover:!border-fred-700 hover:!text-fred-700">
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Delete
                </button>
              </div>
              {open.knockouts.length > 0 && (
                <div className="rounded-sm border border-fred-700/30 px-4 py-3 text-sm text-fred-700">
                  <p className="font-semibold">Knockout answers</p>
                  <ul className="mt-1 list-disc pl-5">{open.knockouts.map((k) => <li key={k}>{k}</li>)}</ul>
                </div>
              )}
              <dl className="space-y-3 border-t border-line pt-5">
                {(
                  [
                    ["Email", <a key="e" className="focus-ring text-navy link-underline" href={`mailto:${open.email}`}>{open.email}</a>],
                    ["Phone", <a key="p" className="focus-ring tabular text-navy link-underline" href={`tel:${open.phone.replace(/[^\d+]/g, "")}`}>{open.phone}</a>],
                    ["LinkedIn", <ExtLink key="l" href={open.linkedinUrl} />],
                    ["Portfolio", open.portfolioUrl ? <ExtLink key="f" href={open.portfolioUrl} /> : "—"],
                    ["Applied in", open.lang === "fr" ? "French" : "English"],
                    ["Work authorisation", labelFor(workAuthorizations, open.workAuthorization)],
                    ["Commission-only pay", labelFor(commissionOptions, open.commissionOnly)],
                    ["Submitted", dateFmt.format(new Date(open.submittedAt))],
                    ["CV file", open.cv ? open.cv.originalName : "—"],
                  ] as [string, React.ReactNode][]
                ).map(([k, v]) => (
                  <div key={k} className="grid gap-0.5 sm:grid-cols-[10rem_1fr] sm:gap-4">
                    <dt className="text-sm text-muted">{k}</dt>
                    <dd className="break-words text-[15px] text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}

function ExtLink({ href }: { href: string }) {
  // Only http(s) links were accepted at submission; re-check before rendering as a link.
  if (!/^https?:\/\//i.test(href)) return <>{href}</>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer nofollow" className="focus-ring inline-flex items-center gap-1 break-all text-navy link-underline">
      {href.replace(/^https?:\/\/(www\.)?/, "")}
      <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
    </a>
  );
}
