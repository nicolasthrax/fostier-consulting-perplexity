"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { API_BASE, NOTE_MAX_LENGTH, type Note } from "@/lib/careers/config";

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Hong_Kong",
});

/** Show the character count once a note gets this close to the limit. */
const COUNT_FROM = NOTE_MAX_LENGTH - 200;

/** Internal notes on a candidate's page: newest first, with a form to add one. */
export function AdminNotes({ id, notes: initial, adminBase }: { id: string; notes: Note[]; adminBase: string }) {
  const router = useRouter();
  // Stored oldest first; shown newest first.
  const [notes, setNotes] = useState(() => [...initial].reverse());
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = text.trim();
    if (!value || busy) return;
    setError("");
    setBusy(true);
    const res = await fetch(`${API_BASE}/admin/applications/${id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: value }),
    }).catch(() => null);
    setBusy(false);
    if (res?.status === 401) return router.push(adminBase);
    const data = (await res?.json().catch(() => null)) as { note?: Note; error?: string } | null;
    if (!res?.ok || !data?.note) return setError(data?.error || "The note couldn't be saved. Try again.");
    setNotes((n) => [data.note!, ...n]);
    setText("");
  };

  return (
    <div>
      <form onSubmit={submit} className="mt-3">
        <label htmlFor="candidate-note" className="sr-only">New internal note</label>
        <textarea
          id="candidate-note"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={NOTE_MAX_LENGTH}
          rows={3}
          placeholder="Add a note for the team…"
          aria-describedby={error ? "candidate-note-error" : undefined}
          className="focus-ring block w-full rounded-sm border border-line bg-white px-3.5 py-3 text-[15px] text-ink placeholder:text-muted/70 hover:border-muted"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <button type="submit" disabled={busy || !text.trim()} className="btn-primary focus-ring !py-2.5">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
            {busy ? "Saving…" : "Add note"}
          </button>
          {text.length >= COUNT_FROM && (
            <span className={`tabular text-sm ${text.length >= NOTE_MAX_LENGTH ? "text-fred-700" : "text-muted"}`} aria-live="polite">
              {text.length} / {NOTE_MAX_LENGTH}
            </span>
          )}
        </div>
        {error && <p id="candidate-note-error" role="alert" className="mt-2 text-sm font-medium text-fred-700">{error}</p>}
      </form>

      {notes.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No notes yet.</p>
      ) : (
        <ul className="mt-4 divide-y divide-line border-t border-line">
          {notes.map((n) => (
            <li key={n.id} className="py-3">
              <p className="text-sm text-muted">
                <span className="font-semibold text-ink">{n.by}</span> · {dateFmt.format(new Date(n.at))}
              </p>
              <p className="mt-1 whitespace-pre-line break-words text-[15px] text-ink">{n.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
