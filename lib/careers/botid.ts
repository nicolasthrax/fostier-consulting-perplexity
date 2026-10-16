import { checkBotId } from "botid/server";

let warnedOffVercel = false;

/**
 * BotID check for the application form and the admin login (the client is loaded
 * by BotIdInit, in CareersShell). Every block is logged: if BotID's browser check ever stops
 * running (say, a Content-Security-Policy change blocks its script), real people
 * are refused too, and these log lines are the first sign. Test on a Preview
 * deployment after changing the CSP in next.config.mjs or middleware.ts.
 *
 * BotID only works on Vercel: elsewhere (`next start`, a VPS, Docker) its server check
 * throws, because the headers it reads are added by Vercel. There, the check is skipped
 * and the login throttle is the only guard.
 *
 * On Vercel, a check that fails (an outage of BotID's service, a misconfiguration) is
 * logged and handled by `onError`, per route:
 * - "block" for the application form: candidates get the email route instead, and a
 *   flood of scripted applications can't use up the Blob store's monthly operations
 *   (Hobby blocks the store for 30 days past them).
 * - "allow" for the admin login: the password, the throttle and the firewall's rate limit
 *   still guard it, and blocking would lock every admin out for the outage.
 */
export async function blockedAsBot(route: string, onError: "block" | "allow") {
  if (!process.env.VERCEL) {
    if (!warnedOffVercel && process.env.NODE_ENV === "production") {
      warnedOffVercel = true;
      console.warn("[careers] Not running on Vercel: BotID is off for the application form and the admin login.");
    }
    return false;
  }
  try {
    const { isBot } = await checkBotId();
    if (isBot) console.warn(`[careers] BotID blocked a request to ${route}`);
    return isBot;
  } catch (err) {
    const outcome = onError === "block" ? "the request was refused" : "the request was let through";
    console.error(`[careers] BotID check failed for ${route}; ${outcome}:`, err instanceof Error ? err.message : err);
    return onError === "block";
  }
}
