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
 * and the login throttle is the only guard. On Vercel, a check that fails (an outage, a
 * misconfiguration) lets the request through and is logged, so it can't lock every
 * candidate and admin out; the firewall's rate limit still applies.
 */
export async function blockedAsBot(route: string) {
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
    console.error(`[careers] BotID check failed for ${route}; the request was let through:`, err instanceof Error ? err.message : err);
    return false;
  }
}
