// Notifies IndexNow (Bing, Yandex, Seznam, Naver…) of every URL in the live sitemap.
// Run after a deploy that changed content:  npm run indexnow
// Bing's index also feeds ChatGPT search and Copilot. The key file lives at /<key>.txt in public/.
import { readdirSync } from "node:fs";

const host = "www.fostierconsulting.com";
const keyFile = readdirSync(new URL("../public/", import.meta.url)).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error("No IndexNow key file (32 hex chars + .txt) found in public/");
const key = keyFile.replace(".txt", "");

const sitemap = await (await fetch(`https://${host}/sitemap.xml`)).text();
const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
if (!urlList.length) throw new Error("Sitemap returned no URLs");

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation: `https://${host}/${keyFile}`, urlList }),
});
// 200 = accepted, 202 = accepted (key validation pending); anything else is an error.
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urlList.length} URLs`);
if (res.status >= 300) {
  console.error(await res.text());
  process.exit(1);
}
