"use client";

import { useEffect } from "react";
import { API_BASE } from "@/lib/careers/config";

/** Signs the admin out after this long without a click, key press, touch or scroll. */
const IDLE_MS = 60 * 60 * 1000;
const CHECK_MS = 60 * 1000;
/** Last activity in any admin tab, so working in one tab keeps the others signed in too. */
const KEY = "fc-careers-admin-active";

const now = () => Date.now();
const readShared = () => {
  try {
    return Number(localStorage.getItem(KEY)) || 0;
  } catch {
    return 0;
  }
};

/**
 * Idle sign-out for the admin pages: on a shared or unattended computer, the session
 * ends after an hour without activity instead of lasting its full 8 hours. The session
 * cookie itself can't be revoked early, so this clears it from the browser.
 */
export function AdminIdleLogout() {
  useEffect(() => {
    let last = now();
    let written = 0;
    const seen = () => {
      last = now();
      // At most every 30 seconds, not on every scroll event.
      if (last - written < 30_000) return;
      written = last;
      try {
        localStorage.setItem(KEY, String(last));
      } catch {}
    };
    const events = ["pointerdown", "keydown", "wheel", "touchstart", "scroll"] as const;
    for (const e of events) window.addEventListener(e, seen, { capture: true, passive: true });

    // Checked on a timer rather than one long timeout, so a laptop waking from sleep is caught at once.
    const timer = setInterval(async () => {
      if (now() - Math.max(last, readShared()) < IDLE_MS) return;
      clearInterval(timer);
      await fetch(`${API_BASE}/admin/logout`, { method: "POST" }).catch(() => null);
      window.location.reload();
    }, CHECK_MS);

    return () => {
      clearInterval(timer);
      for (const e of events) window.removeEventListener(e, seen, { capture: true });
    };
  }, []);
  return null;
}
