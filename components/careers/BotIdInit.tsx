"use client";

import { useEffect } from "react";
import { initBotId } from "botid/client/core";
import { API_BASE } from "@/lib/careers/config";

/**
 * Requests BotID checks (botid/server) on: anything not listed here fails the check.
 * Loaded on the portal only, not on the public site.
 */
const botProtected = [
  { path: `${API_BASE}/apply`, method: "POST" },
  { path: `${API_BASE}/admin/login`, method: "POST" },
];

let started = false;

/**
 * Starts BotID from the page's own bundle. botid's <BotIdClient> would add an inline
 * script instead, which carries no nonce, so the admin pages' Content-Security-Policy
 * (middleware.ts) would block it and every sign-in would be refused as a bot.
 */
export function BotIdInit() {
  useEffect(() => {
    // It patches fetch, so once per page load (React runs effects twice in development).
    if (started) return;
    started = true;
    initBotId({ protect: botProtected });
  }, []);
  return null;
}
