import { checkBotId } from "botid/server";

/**
 * BotID check for the application form and the admin login (the client is loaded
 * by CareersShell). Every block is logged: if BotID's browser check ever stops
 * running (say, a Content-Security-Policy change blocks its script), real people
 * are refused too, and these log lines are the first sign. Test on a Preview
 * deployment after changing the CSP in next.config.mjs.
 */
export async function blockedAsBot(route: string) {
  const { isBot } = await checkBotId();
  if (isBot) console.warn(`[careers] BotID blocked a request to ${route}`);
  return isBot;
}
