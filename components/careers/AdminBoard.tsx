"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowDown, ArrowUp, ChevronDown, ChevronRight, Download, FileText, LayoutGrid, LogOut, Rows3, Trash2 } from "lucide-react";
import { API_BASE, RETAINED_STAGES, ageLabel, duplicateCounts, labelFor, type ApplicationSummary, type Option, type Stage } from "@/lib/careers/config";
import { applicationsCsv } from "@/lib/careers/csv";
import { matchTargetUniversities } from "@/lib/careers/universities";
import { UniversityBadges } from "./UniversityBadges";

type StageOption = { value: Stage; label: string };

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Hong_Kong" });
/** YYYY-MM-DD in Hong Kong time, for the export's file name. */
const isoDay = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Asia/Hong_Kong" });

/**
 * How often the open dashboard checks for new applications. Each check reads the
 * Blob index (one simple operation, or a cheap 304), and the Hobby plan's Blob
 * quota is monthly and blocks the store for 30 days when exceeded, so a tab left
 * open all day must stay frugal: every 3 minutes while visible, every 15 in the
 * background, plus a check when the tab
 * comes back into view.
 */
const POLL_VISIBLE_MS = 3 * 60_000;
const POLL_HIDDEN_MS = 15 * 60_000;
/** Flicking between tabs doesn't trigger a check more often than this. */
const POLL_MIN_GAP_MS = 30_000;
const VIEW_KEY = "careers-admin-view";
/** How long a delete can be undone before it is sent. */
const UNDO_MS = 10_000;
/**
 * Server renders this tab has already shown. Mounting one again means the router
 * replayed a cached page (e.g. back from a candidate), which may be out of date.
 */
const shownRenders = new Set<string>();

const NewBadge = () => (
  <span className="inline-flex items-center rounded-sm bg-fred px-1.5 py-0.5 text-[11px] font-semibold uppercase leading-none tracking-wide text-white">New</span>
);

/** Toolbar controls share one height so the row lines up. */
const CONTROL_H = "h-11";

/**
 * A select with its own chevron: the native arrow sits flush against the border in
 * some browsers. `className` sizes the wrapper; `compact` is for table rows, `danger` shows it in red.
 */
function Select({
  className = "",
  compact = false,
  danger = false,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { compact?: boolean; danger?: boolean }) {
  return (
    <span className={`relative inline-flex ${className}`}>
      <select
        {...props}
        className={`focus-ring w-full appearance-none rounded-sm border bg-white hover:border-muted disabled:opacity-50 ${danger ? "border-fred-700/40 text-fred-700" : "border-line text-ink"} ${compact ? "h-9 pl-2.5 pr-8 text-sm" : `${CONTROL_H} pl-3 pr-10 text-[15px]`}`}
      />
      <ChevronDown className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted ${compact ? "right-2" : "right-3"}`} aria-hidden="true" />
    </span>
  );
}

type SortKey = "name" | "job" | "submitted" | "university" | "status";
type Sort = { key: SortKey; desc: boolean };
/** Applications waiting out the undo window: hidden from the board, not yet deleted on the server. */
type PendingDelete = { ids: string[]; label: string };

/** The short label for the table (full one in the tooltip). */
const shortLabel = (options: Option[], value: string) => options.find((o) => o.value === value)?.short ?? labelFor(options, value);

export function AdminBoard({
  initial,
  initialEtag,
  renderId,
  storageError,
  storageStatus,
  adminName,
  stages,
  jobs,
  workAuthorizations,
  commissionOptions,
  retentionDays,
  adminBase,
}: {
  initial: ApplicationSummary[];
  /** ETag of `initial` as the list API would send it; empty when storage failed. */
  initialEtag: string;
  /** Unique per server render, to tell a fresh page from a cached replay. */
  renderId: string;
  storageError: string;
  /** Which backend is in use, e.g. "Storage: Vercel Blob (private)"; empty when storage failed. */
  storageStatus: string;
  /** The signed-in admin, shown next to Sign out. */
  adminName: string;
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

  // Rows deleted but still in the undo window, or on their way to the server.
  const [hidden, setHidden] = useState<ReadonlySet<string>>(() => new Set());
  const shown = useMemo(() => (hidden.size ? apps.filter((a) => !hidden.has(a.id)) : apps), [apps, hidden]);

  const fromTargetUniversity = shown.filter((a) => matchTargetUniversities(a.university).length).length;

  // ——— Refresh: new applications appear with their "New" badge ———
  const lastPoll = useRef(0);
  // The list version on screen: polls send it back and get an empty 304 while nothing changed.
  const etag = useRef(initialEtag);
  const replayed = useRef<boolean | null>(null);

  const poll = useCallback(async () => {
    lastPoll.current = Date.now();
    const res = await fetch(`${API_BASE}/admin/applications`, {
      cache: "no-store",
      headers: etag.current ? { "If-None-Match": etag.current } : undefined,
    }).catch(() => null);
    if (res?.status === 401) return router.refresh();
    if (res?.status === 304 || !res?.ok) return;
    const { applications } = (await res.json()) as { applications: ApplicationSummary[] };
    etag.current = res.headers.get("ETag") ?? "";
    setApps(applications);
  }, [router]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(tick, document.visibilityState === "visible" ? POLL_VISIBLE_MS : POLL_HIDDEN_MS);
    };
    function tick() {
      poll();
      schedule();
    }
    // A page just rendered by the server is current, so the first check waits for the
    // timer. A cached replay (back from a candidate page) may be stale: check at once.
    // Decided once per mount, so React's dev-only second effect run doesn't count as a replay.
    replayed.current ??= shownRenders.has(renderId);
    shownRenders.add(renderId);
    if (replayed.current) tick();
    else schedule();
    // Back in view: check now (unless we just did). Hidden: switch to the slower pace.
    const onVisibility = () =>
      document.visibilityState === "visible" && Date.now() - lastPoll.current >= POLL_MIN_GAP_MS ? tick() : schedule();
    // Restored from the browser's back/forward cache: the page wasn't re-rendered, so check.
    const onPageShow = (e: PageTransitionEvent) => e.persisted && tick();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [poll, renderId]);

  const [query, setQuery] = useState("");
  const [job, setJob] = useState("");
  const [saveError, setSaveError] = useState("");

  /**
   * Undoes an optimistic change for the given applications only, so anything a
   * poll brought in meanwhile (new applications, other admins' changes) stays.
   */
  const revert = (before: ApplicationSummary[], ids: Set<string>) => {
    const old = new Map(before.filter((a) => ids.has(a.id)).map((a) => [a.id, a]));
    setApps((list) => list.map((a) => old.get(a.id) ?? a));
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return shown.filter((a) => (!job || a.jobSlug === job) && (!q || `${a.fullName} ${a.email}`.toLowerCase().includes(q)));
  }, [shown, query, job]);

  // ——— Sorting (table view) ———
  const [sort, setSort] = useState<Sort>({ key: "submitted", desc: true });
  const toggleSort = (key: SortKey) =>
    // Dates start newest first; text and stages start A–Z / pipeline order.
    setSort((cur) => (cur.key === key ? { key, desc: !cur.desc } : { key, desc: key === "submitted" }));
  const sorted = useMemo(() => {
    const stageOrder = new Map(stages.map((s, i) => [s.value, i]));
    const text = (a: string, b: string) => a.localeCompare(b, "en", { sensitivity: "base" });
    const primary: Record<SortKey, (a: ApplicationSummary, b: ApplicationSummary) => number> = {
      name: (a, b) => text(a.fullName, b.fullName),
      job: (a, b) => text(a.jobTitle, b.jobTitle),
      submitted: (a, b) => a.submittedAt.localeCompare(b.submittedAt),
      // HKU, CUHK and HKUST first, then the rest A–Z, blanks last.
      university: (a, b) =>
        Number(!matchTargetUniversities(a.university).length) - Number(!matchTargetUniversities(b.university).length) ||
        Number(!a.university) - Number(!b.university) ||
        text(a.university, b.university),
      status: (a, b) => (stageOrder.get(a.status) ?? 0) - (stageOrder.get(b.status) ?? 0),
    };
    const by = primary[sort.key];
    // Ties fall back to newest first.
    return [...filtered].sort((a, b) => (sort.desc ? -by(a, b) : by(a, b)) || b.submittedAt.localeCompare(a.submittedAt));
  }, [filtered, sort, stages]);
  const pipeline = stages.filter((s) => s.value !== "rejected");
  const rejected = filtered.filter((a) => a.status === "rejected");
  const href = (a: ApplicationSummary) => `${adminBase}/${a.id}`;
  // Counted over every application, not just the filtered ones.
  const duplicates = useMemo(() => duplicateCounts(shown), [shown]);

  // ——— Bulk status changes (table view) ———
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [bulkStage, setBulkStage] = useState<Stage | "">("");
  const [bulkSaving, setBulkSaving] = useState(false);
  // Only visible rows stay selected, so a filter change can't move candidates you can't see.
  useEffect(() => {
    setSelected((sel) => {
      const visible = new Set(filtered.map((a) => a.id));
      const next = new Set([...sel].filter((id) => visible.has(id)));
      return next.size === sel.size ? sel : next;
    });
  }, [filtered]);
  const allSelected = filtered.length > 0 && filtered.every((a) => selected.has(a.id));
  const someSelected = !allSelected && filtered.some((a) => selected.has(a.id));
  const toggleOne = (id: string) =>
    setSelected((sel) => {
      const next = new Set(sel);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(filtered.map((a) => a.id)));

  const applyBulk = async () => {
    if (!bulkStage || !selected.size) return;
    const ids = [...selected];
    const status = bulkStage;
    const prev = apps;
    setSaveError("");
    setBulkSaving(true);
    setApps((list) => list.map((a) => (selected.has(a.id) ? { ...a, status } : a)));
    const res = await fetch(`${API_BASE}/admin/applications`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, status }),
    }).catch(() => null);
    setBulkSaving(false);
    if (res?.status === 401) return router.refresh();
    if (!res?.ok) {
      revert(prev, new Set(ids));
      setSaveError(`The status of ${ids.length} application${ids.length === 1 ? "" : "s"} couldn't be saved. Try again.`);
      return;
    }
    const { applications: updated } = (await res.json()) as { applications: ApplicationSummary[] };
    const byId = new Map(updated.map((a) => [a.id, a]));
    setApps((list) => list.map((a) => byId.get(a.id) ?? a));
    setSelected(new Set());
    setBulkStage("");
  };

  // ——— Deleting (a row's button, or the selection), with a few seconds to undo ———
  const [undo, setUndo] = useState<PendingDelete | null>(null);
  const undoRef = useRef<PendingDelete | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout>>();
  const unhide = (ids: string[]) =>
    setHidden((h) => {
      const next = new Set(h);
      ids.forEach((id) => next.delete(id));
      return next;
    });

  /** Sends the delete. `leaving`: the page is going away, so only make sure the request survives it. */
  const send = useCallback(
    async (p: PendingDelete, leaving = false) => {
      const res = await fetch(`${API_BASE}/admin/applications`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: p.ids }),
        keepalive: leaving,
      }).catch(() => null);
      if (leaving) return;
      if (res?.status === 401) return router.refresh();
      if (res?.ok) {
        const gone = new Set(p.ids);
        setApps((list) => list.filter((a) => !gone.has(a.id)));
      } else {
        setSaveError(`${p.ids.length === 1 ? `${p.label}'s application` : p.label} couldn't be deleted. Try again.`);
      }
      // Deleted rows have left the list; failed ones come back.
      unhide(p.ids);
    },
    [router]
  );

  /** Ends the undo window now and sends the delete. */
  const flush = useCallback(
    (leaving = false) => {
      const p = undoRef.current;
      if (!p) return;
      clearTimeout(undoTimer.current);
      undoRef.current = null;
      if (!leaving) setUndo(null);
      send(p, leaving);
    },
    [send]
  );

  const deleteApps = (ids: string[]) => {
    const picked = apps.filter((a) => ids.includes(a.id));
    if (!picked.length) return;
    // Offers and hires are kept out of the automatic purge: their documents belong in a personnel file first.
    const retained = picked.filter((a) => RETAINED_STAGES.includes(a.status));
    if (retained.length) {
      const who = retained.length === 1 ? `${retained[0].fullName} is` : `${retained.length} of these candidates are`;
      const ok = window.confirm(
        `${who} at Offer or Hired. Their documents are kept beyond the 12-month purge so they can go to a personnel file: move them there first.\n\nDelete anyway?`
      );
      if (!ok) return;
    }
    // One undo at a time: a new delete sends the previous one.
    flush();
    const p: PendingDelete = { ids: picked.map((a) => a.id), label: picked.length === 1 ? picked[0].fullName : `${picked.length} applications` };
    setSaveError("");
    setHidden((h) => new Set([...h, ...p.ids]));
    undoRef.current = p;
    setUndo(p);
    undoTimer.current = setTimeout(() => flush(), UNDO_MS);
  };

  const undoDelete = () => {
    const p = undoRef.current;
    if (!p) return;
    clearTimeout(undoTimer.current);
    undoRef.current = null;
    setUndo(null);
    unhide(p.ids);
  };

  // Leaving the page (or opening a candidate) during the undo window still deletes.
  useEffect(() => {
    const onPageHide = () => flush(true);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      window.removeEventListener("pagehide", onPageHide);
      flush(true);
    };
  }, [flush]);

  // ——— CSV export ———
  const exportCsv = () => {
    const url = URL.createObjectURL(new Blob([applicationsCsv(sorted)], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `candidates-${isoDay.format(new Date())}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    // Revoked after a beat: Safari can drop the download if the URL goes away synchronously.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

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
      revert(prev, new Set([id]));
      setSaveError("The status couldn't be saved. Try again.");
    }
  };

  const logout = async () => {
    await fetch(`${API_BASE}/admin/logout`, { method: "POST" }).catch(() => null);
    router.refresh();
  };

  // Render helpers (plain functions, not components, so selects keep focus across re-renders).
  const ariaSort = (key: SortKey) => (sort.key === key ? (sort.desc ? "descending" : "ascending") : undefined);
  const sortButton = (key: SortKey, label: string) => {
    const active = sort.key === key;
    const Arrow = active && !sort.desc ? ArrowUp : ArrowDown;
    return (
      <button
        type="button"
        onClick={() => toggleSort(key)}
        title={`Sort by ${label.toLowerCase()}`}
        className={`focus-ring group inline-flex items-center gap-1 rounded-sm font-medium hover:text-ink ${active ? "text-ink" : ""}`}
      >
        {label}
        {/* Always laid out, so the header doesn't shift; faint on hover until it's the active sort. */}
        <Arrow className={`h-3.5 w-3.5 ${active ? "" : "opacity-0 group-hover:opacity-40"}`} aria-hidden="true" />
      </button>
    );
  };
  const statusSelect = (app: ApplicationSummary) => (
    <Select
      compact
      danger={app.status === "rejected"}
      value={app.status}
      onChange={(e) => setStatus(app.id, e.target.value as Stage)}
      aria-label={`Status for ${app.fullName}`}
      className="w-32"
    >
      {stages.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
    </Select>
  );

  const deleteButton = (app: ApplicationSummary) => (
    <button
      type="button"
      onClick={() => deleteApps([app.id])}
      aria-label={`Delete ${app.fullName}`}
      title="Delete application and CV"
      className="focus-ring inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm text-muted hover:bg-fred/[0.08] hover:text-fred-700"
    >
      <Trash2 className="h-4 w-4" aria-hidden="true" />
    </button>
  );

  const flag = (app: ApplicationSummary) =>
    app.knockouts.length ? (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-fred-700">
        <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
        {app.knockouts.join(" · ")}
      </span>
    ) : null;

  const duplicateBadge = (app: ApplicationSummary) => {
    const n = duplicates(app);
    if (!n) return null;
    const detail = `${n} other application${n === 1 ? "" : "s"} from this email for this job`;
    return (
      <span title={detail} className="inline-flex items-center rounded-sm border border-navy/30 bg-navy/[0.06] px-1.5 py-0.5 text-[11px] font-semibold uppercase leading-none tracking-wide text-navy">
        Duplicate<span className="sr-only">: {detail}</span>
      </span>
    );
  };

  const card = (a: ApplicationSummary) => {
    const unis = matchTargetUniversities(a.university);
    const age = a.adult || a.age ? ageLabel(a) : "";
    return (
      <li key={a.id} className={`rounded-sm border bg-white ${unis.length ? "border-wechat shadow-[inset_3px_0_0_theme(colors.wechat.DEFAULT)]" : "border-line"}`}>
        <Link href={href(a)} className="focus-ring group block p-3 hover:bg-mist">
          <span className="flex items-start justify-between gap-2">
            <span className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-navy group-hover:underline">{a.fullName}</span>
              {!a.viewedAt && <NewBadge />}
              {duplicateBadge(a)}
            </span>
            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
          </span>
          <span className="mt-1 block text-sm text-slate">{a.jobTitle}</span>
          <span className="mt-1 block text-xs text-muted tabular">{dateFmt.format(new Date(a.submittedAt))}</span>
          {age && (
            <span className={`mt-2 block text-xs ${a.adult === "no" ? "font-semibold text-fred-700" : "text-slate"}`}>
              <span className="font-normal text-muted">Age: </span>{age}
            </span>
          )}
          {a.university && (
            <span className={`${age ? "" : "mt-2 "}flex flex-wrap items-center gap-1.5 text-xs text-slate`}>
              <span><span className="text-muted">University: </span>{a.university}</span>
              <UniversityBadges codes={unis} />
            </span>
          )}
          <span className={`${age || a.university ? "" : "mt-2 "}block text-xs text-slate`}>
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
        <div className="flex items-center justify-between gap-2 border-t border-line px-3 py-2">
          {statusSelect(a)}
          {deleteButton(a)}
        </div>
      </li>
    );
  };

  return (
    <div className="container-site max-w-admin py-8 sm:py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="h-serif text-3xl sm:text-4xl">Candidates</h1>
          <p className="label mt-1 tabular">{shown.length} application{shown.length === 1 ? "" : "s"}{fromTargetUniversity > 0 ? ` · ${fromTargetUniversity} from HKU, CUHK or HKUST (in green)` : ""} · tap a name to see the CV and answers</p>
          {storageStatus && <p className="mt-1 text-sm font-medium text-wechat-700">✓ {storageStatus}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted">
            Signed in as <span className="font-semibold text-ink">{adminName}</span>
          </span>
          <button type="button" onClick={logout} className="btn-outline focus-ring !py-2.5">
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </div>

      {storageError && (
        <p role="alert" className="mt-6 rounded-sm border border-fred-700/30 bg-white px-4 py-3 text-sm font-medium text-fred-700">{storageError}</p>
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
          className={`focus-ring ${CONTROL_H} w-full rounded-sm border border-line bg-white px-3 text-[15px] text-ink hover:border-muted sm:w-72`}
        />
        <label className="sr-only" htmlFor="admin-job">Filter by job</label>
        <Select id="admin-job" value={job} onChange={(e) => setJob(e.target.value)} className="w-full sm:w-60">
          <option value="">All jobs</option>
          {jobs.map((j) => <option key={j.slug} value={j.slug}>{j.title}{j.open ? "" : " (closed)"}</option>)}
        </Select>
        <button
          type="button"
          onClick={exportCsv}
          disabled={!filtered.length}
          title="Exports the current filtered list (search and job filter applied) as a CSV file"
          className={`btn-outline focus-ring ${CONTROL_H} !px-4 !py-0 disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Export CSV
        </button>
        <div className={`inline-flex ${CONTROL_H} sm:ml-auto rounded-sm border border-line bg-white p-0.5`} role="group" aria-label="View">
          {([["table", Rows3, "Table"], ["board", LayoutGrid, "Pipeline"]] as const).map(([v, Icon, label]) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              aria-pressed={view === v}
              className={`focus-ring inline-flex items-center gap-1.5 rounded-sm px-3 text-sm font-semibold ${view === v ? "bg-navy text-white" : "text-slate hover:text-navy"}`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {view === "board" ? (
        <>
          {/* Stacked on phones; from md up, one column per stage, scrolling sideways when seven don't fit. */}
          <div className="mt-6 grid gap-4 md:auto-cols-[minmax(10.5rem,1fr)] md:grid-flow-col md:overflow-x-auto md:pb-2">
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
        <>
          {selected.size > 0 && (
            <div role="region" aria-label="Selected candidates" className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-sm border border-navy/30 bg-white px-4 py-3 text-sm">
              <span className="font-semibold text-ink tabular">{selected.size} selected</span>
              <span className="text-muted" aria-hidden="true">·</span>
              <label htmlFor="bulk-stage" className="text-slate">Move to</label>
              <Select id="bulk-stage" compact value={bulkStage} onChange={(e) => setBulkStage(e.target.value as Stage | "")}>
                <option value="">Choose a stage</option>
                {stages.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </Select>
              <button
                type="button"
                onClick={applyBulk}
                disabled={!bulkStage || bulkSaving}
                className="btn-primary focus-ring h-9 !px-4 !py-0 !text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                {bulkSaving ? "Saving…" : "Apply"}
              </button>
              <span className="text-muted" aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => deleteApps([...selected])}
                className="btn-outline focus-ring h-9 !gap-1.5 !px-3 !py-0 !text-sm hover:!border-fred-700 hover:!text-fred-700"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Delete
              </button>
              <button type="button" onClick={() => setSelected(new Set())} className="focus-ring ml-auto font-semibold text-navy link-underline">
                Clear selection
              </button>
            </div>
          )}
          {/* Fits the page from about 1024px wide; narrower screens scroll it sideways. */}
          <div className="mt-6 overflow-x-auto rounded-sm bg-white">
            <table className="w-full min-w-[56rem] text-left text-sm">
              <thead className="border-b border-line text-muted">
                <tr>
                  <th scope="col" className="w-10 py-3 pl-4 pr-0">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      // Indeterminate has no attribute; it can only be set on the element.
                      ref={(el) => {
                        if (el) el.indeterminate = someSelected;
                      }}
                      onChange={toggleAll}
                      disabled={!filtered.length}
                      aria-label="Select all visible candidates"
                      className="focus-ring h-4 w-4 accent-navy"
                    />
                  </th>
                  <th scope="col" aria-sort={ariaSort("name")} className="px-3 py-3">{sortButton("name", "Candidate")}</th>
                  <th scope="col" aria-sort={ariaSort("job") ?? ariaSort("submitted")} className="px-3 py-3">
                    {sortButton("job", "Job")}
                    <span className="px-1.5" aria-hidden="true">·</span>
                    {sortButton("submitted", "Applied")}
                  </th>
                  <th scope="col" title="18 or over" className="px-3 py-3 font-medium">18+</th>
                  <th scope="col" aria-sort={ariaSort("university")} className="px-3 py-3">{sortButton("university", "University")}</th>
                  <th scope="col" className="px-3 py-3 font-medium">Work authorisation</th>
                  <th scope="col" title="Commission only" className="px-3 py-3 font-medium">Commission</th>
                  <th scope="col" aria-sort={ariaSort("status")} className="px-3 py-3">{sortButton("status", "Status")}</th>
                  <th scope="col" className="w-12 py-3 pl-1 pr-3"><span className="sr-only">Delete</span></th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((a) => {
                  const unis = matchTargetUniversities(a.university);
                  const minor = a.adult === "no" || (!!a.age && Number(a.age) < 18);
                  return (
                    <tr key={a.id} className={`border-b border-line last:border-0 ${selected.has(a.id) ? "bg-navy/[0.05]" : a.viewedAt ? "" : "bg-fred/[0.04]"}`}>
                      {/* The green bar sits on the cell: Safari draws no box-shadow on table rows. */}
                      <td className={`py-3 pl-4 pr-0 ${unis.length ? "shadow-[inset_4px_0_0_theme(colors.wechat.DEFAULT)]" : ""}`}>
                        <input
                          type="checkbox"
                          checked={selected.has(a.id)}
                          onChange={() => toggleOne(a.id)}
                          aria-label={`Select ${a.fullName}`}
                          className="focus-ring h-4 w-4 accent-navy"
                        />
                      </td>
                      <td className="min-w-[10rem] px-3 py-3">
                        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <Link href={href(a)} className="focus-ring text-[15px] font-semibold text-navy link-underline">{a.fullName}</Link>
                          {!a.viewedAt && <NewBadge />}
                          {duplicateBadge(a)}
                        </span>
                        <div className="text-muted [overflow-wrap:anywhere]">{a.email}</div>
                      </td>
                      <td className="px-3 py-3 text-slate">
                        {a.jobTitle}
                        <div className="whitespace-nowrap text-muted tabular">Applied {dateFmt.format(new Date(a.submittedAt))}</div>
                      </td>
                      <td title={ageLabel(a)} className={`whitespace-nowrap px-3 py-3 ${minor ? "font-semibold text-fred-700" : "text-slate"}`}>
                        {a.adult ? (a.adult === "yes" ? "Yes" : "No") : a.age || "—"}
                      </td>
                      <td className={`px-3 py-3 ${unis.length ? "bg-wechat/[0.08] font-semibold text-ink" : "text-slate"}`}>
                        {a.university ? (
                          <span className="flex flex-col items-start gap-1">
                            <UniversityBadges codes={unis} />
                            {a.university}
                          </span>
                        ) : "—"}
                      </td>
                      <td title={labelFor(workAuthorizations, a.workAuthorization)} className={`px-3 py-3 ${workAuthorizations.find((o) => o.value === a.workAuthorization)?.knockout ?"font-semibold text-fred-700" : "text-slate"}`}>
                        {shortLabel(workAuthorizations, a.workAuthorization)}
                      </td>
                      <td className={`px-3 py-3 ${a.commissionOnly === "yes" ? "text-slate" : "font-semibold text-fred-700"}`}>
                        {labelFor(commissionOptions, a.commissionOnly).split(",")[0]}
                      </td>
                      <td className="px-3 py-3">{statusSelect(a)}</td>
                      <td className="py-3 pl-1 pr-3 text-right">{deleteButton(a)}</td>
                    </tr>
                  );
                })}
                {!filtered.length && (
                  <tr><td colSpan={9} className="px-4 py-8 text-center text-muted">No candidates match.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {undo && (
        <div role="status" className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-center justify-between gap-4 rounded-sm bg-ink px-4 py-3 text-sm text-white shadow-pop">
          <span>
            Deleted <span className="font-semibold">{undo.label}</span>.
          </span>
          <button type="button" onClick={undoDelete} className="focus-ring shrink-0 rounded-sm px-2 py-1 font-semibold text-white underline underline-offset-4 hover:text-mist">
            Undo
          </button>
        </div>
      )}

      <p className="mt-8 text-sm text-muted">
        Applications are deleted automatically {retentionDays} days after submission, as the candidate privacy notice promises,
        except those at Offer or Hired. Move hired candidates&apos; documents to their personnel file.{" "}
        <Link href={`${adminBase}/deletions`} className="focus-ring font-semibold text-navy link-underline">Deletion log</Link>
      </p>
    </div>
  );
}
