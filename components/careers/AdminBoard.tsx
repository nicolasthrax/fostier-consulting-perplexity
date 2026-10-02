"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, Bell, BellRing, ChevronRight, FileText, LayoutGrid, LogOut, Rows3, X } from "lucide-react";
import { API_BASE, labelFor, type ApplicationRecord, type Option, type Stage } from "@/lib/careers/config";
import { matchTargetUniversities } from "@/lib/careers/universities";
import { UniversityBadges } from "./UniversityBadges";

type StageOption = { value: Stage; label: string };

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Hong_Kong" });

/** How often the open dashboard checks for new applications. */
const POLL_MS = 60_000;
const VIEW_KEY = "careers-admin-view";

function timeAgo(iso: string) {
  const min = Math.round((Date.now() - Date.parse(iso)) / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} h ago`;
  return dateFmt.format(new Date(iso));
}

const NewBadge = () => (
  <span className="inline-flex items-center rounded-sm bg-fred px-1.5 py-0.5 text-[11px] font-semibold uppercase leading-none tracking-wide text-white">New</span>
);

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
  // Table by default; the last choice is remembered on this device.
  const [view, setViewState] = useState<"board" | "table">("table");
  const setView = (v: "board" | "table") => {
    setViewState(v);
    try {
      localStorage.setItem(VIEW_KEY, v);
    } catch {}
  };
  useEffect(() => {
    try {
      if (localStorage.getItem(VIEW_KEY) === "board") setViewState("board");
    } catch {}
  }, []);

  // ——— Notifications ———
  const [panelOpen, setPanelOpen] = useState(false);
  const [toasts, setToasts] = useState<ApplicationRecord[]>([]);
  const [alertsOn, setAlertsOn] = useState(false);
  const known = useRef(new Set(initial.map((a) => a.id)));
  const unread = apps.filter((a) => !a.viewedAt);
  const fromTargetUniversity = apps.filter((a) => matchTargetUniversities(a.university).length).length;

  useEffect(() => {
    if (typeof Notification !== "undefined") setAlertsOn(Notification.permission === "granted");
  }, []);

  // Unread count in the tab title, so new applications show even in a background tab.
  useEffect(() => {
    document.title = `${unread.length ? `(${unread.length}) ` : ""}Candidates | Fostier Consulting`;
  }, [unread.length]);

  const poll = useCallback(async () => {
    const res = await fetch(`${API_BASE}/admin/applications`, { cache: "no-store" }).catch(() => null);
    if (res?.status === 401) return router.refresh();
    if (!res?.ok) return;
    const { applications } = (await res.json()) as { applications: ApplicationRecord[] };
    const fresh = applications.filter((a) => !known.current.has(a.id));
    applications.forEach((a) => known.current.add(a.id));
    setApps(applications);
    if (!fresh.length) return;
    setToasts((t) => [...fresh, ...t].slice(0, 3));
    if (alertsOn && document.visibilityState !== "visible") {
      for (const a of fresh.slice(0, 3)) {
        const n = new Notification(`New application: ${a.fullName}`, {
          body: `${a.jobTitle}${a.status === "rejected" ? " · auto-rejected (commission)" : ""}${a.knockouts.length ? " · flagged" : ""}`,
          tag: a.id,
        });
        n.onclick = () => window.open(`${adminBase}/${a.id}`, "_self");
      }
    }
  }, [alertsOn, adminBase, router]);

  useEffect(() => {
    // Check once on arrival too: coming back from a candidate page can show a cached list.
    poll();
    const t = setInterval(poll, POLL_MS);
    const onFocus = () => document.visibilityState === "visible" && poll();
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [poll]);

  const enableAlerts = async () => {
    if (typeof Notification === "undefined") return;
    setAlertsOn((await Notification.requestPermission()) === "granted");
  };

  const markAllRead = async () => {
    const now = new Date().toISOString();
    setApps((list) => list.map((a) => (a.viewedAt ? a : { ...a, viewedAt: now })));
    await fetch(`${API_BASE}/admin/notifications`, { method: "POST" }).catch(() => null);
  };
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

  const card = (a: ApplicationRecord) => {
    const unis = matchTargetUniversities(a.university);
    return (
      <li key={a.id} className={`rounded-sm border bg-white ${unis.length ? "border-wechat shadow-[inset_3px_0_0_theme(colors.wechat.DEFAULT)]" : "border-line"}`}>
        <Link href={href(a)} className="focus-ring group block p-3 hover:bg-mist">
          <span className="flex items-start justify-between gap-2">
            <span className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-navy group-hover:underline">{a.fullName}</span>
              {!a.viewedAt && <NewBadge />}
            </span>
            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
          </span>
          <span className="mt-1 block text-sm text-slate">{a.jobTitle}</span>
          <span className="mt-1 block text-xs text-muted tabular">{dateFmt.format(new Date(a.submittedAt))}</span>
          {a.age && (
            <span className="mt-2 block text-xs text-slate">
              <span className="text-muted">Age: </span>{a.age}
            </span>
          )}
          {a.university && (
            <span className={`${a.age ? "" : "mt-2 "}flex flex-wrap items-center gap-1.5 text-xs text-slate`}>
              <span><span className="text-muted">University: </span>{a.university}</span>
              <UniversityBadges codes={unis} />
            </span>
          )}
          <span className={`${a.age || a.university ? "" : "mt-2 "}block text-xs text-slate`}>
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
  };

  return (
    <div className="container-site py-8 sm:py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="h-serif text-3xl sm:text-4xl">Candidates</h1>
          <p className="label mt-1 tabular">{apps.length} application{apps.length === 1 ? "" : "s"}{unread.length > 0 ? ` · ${unread.length} new` : ""}{fromTargetUniversity > 0 ? ` · ${fromTargetUniversity} from HKU, CUHK or HKUST (in green)` : ""} · tap a name to see the CV and answers</p>
          {storageStatus && <p className="mt-1 text-sm font-medium text-wechat-700">✓ {storageStatus}</p>}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setPanelOpen((o) => !o)}
              aria-expanded={panelOpen}
              aria-controls="notif-panel"
              className="btn-outline focus-ring relative !px-3 !py-2.5"
              aria-label={`Notifications: ${unread.length} new application${unread.length === 1 ? "" : "s"}`}
            >
              {unread.length ? <BellRing className="h-5 w-5 text-navy" aria-hidden="true" /> : <Bell className="h-5 w-5" aria-hidden="true" />}
              {unread.length > 0 && (
                <span className="absolute -right-1.5 -top-1.5 min-w-5 rounded-full bg-fred px-1.5 text-center text-xs font-semibold leading-5 text-white tabular">
                  {unread.length}
                </span>
              )}
            </button>
            {panelOpen && (
              <div id="notif-panel" className="absolute right-0 z-30 mt-2 w-[min(22rem,calc(100vw-2.5rem))] rounded-sm border border-line bg-white shadow-pop">
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                  <h2 className="font-serif text-lg text-ink">New applications</h2>
                  {unread.length > 0 && (
                    <button type="button" onClick={markAllRead} className="focus-ring text-sm font-semibold text-navy link-underline">
                      Mark all as read
                    </button>
                  )}
                </div>
                <ul className="max-h-80 overflow-y-auto">
                  {unread.map((a) => (
                    <li key={a.id} className="border-b border-line last:border-0">
                      <Link href={href(a)} className="focus-ring block px-4 py-3 hover:bg-mist">
                        <span className="block font-semibold text-navy">{a.fullName}</span>
                        <span className="block text-sm text-slate">{a.jobTitle}</span>
                        <span className="mt-0.5 block text-xs text-muted">
                          {timeAgo(a.submittedAt)}
                          {a.status === "rejected" && <span className="font-semibold text-fred-700"> · auto-rejected (commission)</span>}
                          {a.status !== "rejected" && a.knockouts.length > 0 && <span className="font-semibold text-fred-700"> · flagged</span>}
                        </span>
                      </Link>
                    </li>
                  ))}
                  {!unread.length && <li className="px-4 py-6 text-sm text-muted">You&apos;re all caught up.</li>}
                </ul>
                <div className="border-t border-line px-4 py-3 text-xs text-muted">
                  {alertsOn ? (
                    "Desktop alerts are on while this dashboard is open."
                  ) : (
                    <button type="button" onClick={enableAlerts} className="focus-ring font-semibold text-navy link-underline">
                      Turn on desktop alerts
                    </button>
                  )}{" "}
                  The list refreshes every minute.
                </div>
              </div>
            )}
          </div>
          <button type="button" onClick={logout} className="btn-outline focus-ring !py-2.5">
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </div>

      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-40 w-[min(22rem,calc(100vw-2rem))] space-y-2" aria-live="polite">
          {toasts.map((a) => (
            <div key={a.id} className="flex items-start gap-3 rounded-sm border border-line bg-white px-4 py-3 shadow-pop">
              <BellRing className="mt-0.5 h-4 w-4 shrink-0 text-fred" aria-hidden="true" />
              <Link href={href(a)} className="focus-ring min-w-0 flex-1 text-sm">
                <span className="block font-semibold text-navy">New application: {a.fullName}</span>
                <span className="block text-slate">{a.jobTitle}{a.status === "rejected" ? " · auto-rejected" : ""}</span>
              </Link>
              <button type="button" onClick={() => setToasts((t) => t.filter((x) => x.id !== a.id))} className="focus-ring text-muted hover:text-ink" aria-label="Dismiss">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}

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
          {([["table", Rows3, "Table"], ["board", LayoutGrid, "Pipeline"]] as const).map(([v, Icon, label]) => (
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
          <table className="w-full min-w-[70rem] text-left text-[15px]">
            <thead className="border-b border-line text-sm text-muted">
              <tr>
                {["Name", "Job", "Submitted", "Age", "University", "Work authorisation", "Commission only", "Status"].map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const unis = matchTargetUniversities(a.university);
                return (
                  <tr key={a.id} className={`border-b border-line last:border-0 ${a.viewedAt ? "" : "bg-fred/[0.04]"}`}>
                    {/* The green bar sits on the cell: Safari draws no box-shadow on table rows. */}
                    <td className={`px-4 py-3 ${unis.length ? "shadow-[inset_4px_0_0_theme(colors.wechat.DEFAULT)]" : ""}`}>
                      <span className="flex flex-wrap items-center gap-2">
                        <Link href={href(a)} className="focus-ring font-semibold text-navy link-underline">{a.fullName}</Link>
                        {!a.viewedAt && <NewBadge />}
                      </span>
                      <div className="text-sm text-muted">{a.email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate">{a.jobTitle}</td>
                    <td className="px-4 py-3 tabular text-slate">{dateFmt.format(new Date(a.submittedAt))}</td>
                    <td className={`px-4 py-3 tabular ${a.age && Number(a.age) < 18 ? "font-semibold text-fred-700" : "text-slate"}`}>{a.age || "—"}</td>
                    <td className={`px-4 py-3 text-sm ${unis.length ? "bg-wechat/[0.08] font-semibold text-ink" : "text-slate"}`}>
                      {a.university ? (
                        <span className="flex flex-col items-start gap-1">
                          <UniversityBadges codes={unis} />
                          {a.university}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate">{labelFor(workAuthorizations, a.workAuthorization)}</td>
                    <td className={`px-4 py-3 text-sm ${a.commissionOnly === "yes" ? "text-slate" : "font-semibold text-fred-700"}`}>
                      {labelFor(commissionOptions, a.commissionOnly).split(",")[0]}
                    </td>
                    <td className="px-4 py-3">{statusSelect(a)}</td>
                  </tr>
                );
              })}
              {!filtered.length && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-muted">No candidates match.</td></tr>
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
