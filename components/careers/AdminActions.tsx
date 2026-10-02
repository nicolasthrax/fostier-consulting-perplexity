"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, FileJson, Loader2, Trash2 } from "lucide-react";
import { API_BASE, RETAINED_STAGES, type Stage } from "@/lib/careers/config";

/** Status, export and delete controls on a candidate's page. */
export function AdminActions({
  id,
  name,
  status: initial,
  stages,
  adminBase,
}: {
  id: string;
  name: string;
  status: Stage;
  stages: { value: Stage; label: string }[];
  adminBase: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const change = async (next: Stage) => {
    const prev = status;
    setStatus(next);
    setError("");
    setBusy(true);
    const res = await fetch(`${API_BASE}/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    }).catch(() => null);
    setBusy(false);
    if (res?.status === 401) return router.push(adminBase);
    if (!res?.ok) {
      setStatus(prev);
      setError("The status couldn't be saved. Try again.");
      return;
    }
    // Re-renders the server page so the activity list shows the change.
    router.refresh();
  };

  const remove = async () => {
    if (!window.confirm(`Delete ${name}'s application and CV permanently? Use this when a candidate withdraws or asks for erasure.`)) return;
    setBusy(true);
    const res = await fetch(`${API_BASE}/admin/applications/${id}`, { method: "DELETE" }).catch(() => null);
    setBusy(false);
    if (!res?.ok) return setError("The application couldn't be deleted. Try again.");
    router.push(adminBase);
    router.refresh();
  };

  return (
    <div className="mt-5">
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="candidate-status" className="text-sm font-semibold text-ink">Status</label>
        <select
          id="candidate-status"
          value={status}
          onChange={(e) => change(e.target.value as Stage)}
          disabled={busy}
          className={`focus-ring rounded-sm border bg-white px-3 py-2.5 text-[15px] ${status === "rejected" ? "border-fred-700 text-fred-700" : "border-line text-ink"}`}
        >
          {stages.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        {busy && <Loader2 className="h-4 w-4 animate-spin text-muted" aria-label="Saving" />}
        <a href={`${API_BASE}/admin/applications/${id}`} className="btn-outline focus-ring !py-2.5" title="For data access requests">
          <FileJson className="h-4 w-4" aria-hidden="true" />
          Export data
        </a>
        <button type="button" onClick={remove} disabled={busy} className="btn-outline focus-ring !py-2.5 hover:!border-fred-700 hover:!text-fred-700">
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Delete
        </button>
      </div>
      {RETAINED_STAGES.includes(status) && (
        <p className="mt-2 flex items-center gap-1.5 text-sm text-slate">
          <Archive className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
          Kept after the 12-month purge. Move a hire&rsquo;s data to their personnel file.
        </p>
      )}
      {error && <p role="alert" className="mt-2 text-sm font-medium text-fred-700">{error}</p>}
    </div>
  );
}
