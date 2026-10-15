import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales } from "@/lib/i18n/config";
import { serviceSlugs } from "@/lib/i18n/service-slugs";
import { site } from "@/lib/site";

/** Unprefixed paths that exist in French, so their redirect can be permanent. */
const knownPaths = new Set([
  "/",
  ...["/services", "/about", "/contact", "/privacy", "/cookies", "/terms", "/legal-notice"],
  ...serviceSlugs.map((s) => `/services/${s.fr}`),
]);

const PORTAL = "/careers";
const PRIVATE = "noindex, nofollow, noarchive";
const noindex = (res: NextResponse, robots: string | null = PRIVATE) => {
  if (robots) res.headers.set("X-Robots-Tag", robots);
  return res;
};
/**
 * Robots header for a portal page, by internal path (keep in step with next.config.mjs).
 * The landing and job pages are indexable; the application forms and the candidate
 * notice stay out of results but their links are followed; the rest (admin, API,
 * redirects, 404s) is fully private.
 */
function careersRobots(target: string) {
  if (/^\/careers\/(fr|en)(\/jobs\/[^/]+)?$/.test(target)) return null;
  if (/^\/careers\/(fr|en)\/(privacy|jobs\/[^/]+\/apply)$/.test(target)) return "noindex, noarchive";
  return PRIVATE;
}
const under = (pathname: string, base: string) => pathname === base || pathname.startsWith(`${base}/`);

/**
 * Content-Security-Policy for the admin pages, which show what candidates typed to a
 * signed-in admin: only scripts carrying this request's nonce run (Next adds it to its own
 * scripts, and 'strict-dynamic' lets those load the rest, BotID's challenge included), so
 * markup slipped into a candidate's answers could never run. The site-wide policy is in
 * next.config.mjs. After changing this, test signing in on a Preview deployment: if
 * BotID's challenge is blocked, real people are refused too (see lib/careers/botid.ts).
 */
export function adminCsp(nonce: string) {
  // React uses eval in development only, for its error overlay and call stacks.
  const devEval = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'wasm-unsafe-eval'${devEval}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    "worker-src 'self' blob:",
    // The candidate page previews the PDF CV from this origin.
    "frame-src 'self'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ].join("; ");
}

/** Passes the request on (or rewrites it) with a fresh nonce and the admin CSP on both the request, where Next reads the nonce, and the response. */
function withAdminCsp(request: NextRequest, rewriteTo: URL | null) {
  const csp = adminCsp(btoa(crypto.randomUUID()));
  const headers = new Headers(request.headers);
  headers.set("Content-Security-Policy", csp);
  const res = rewriteTo ? NextResponse.rewrite(rewriteTo, { request: { headers } }) : NextResponse.next({ request: { headers } });
  res.headers.set("Content-Security-Policy", csp);
  return res;
}

/**
 * The recruitment portal lives outside the locale tree: French at /careers
 * (rewritten to /careers/fr) and English at /careers/en. With
 * CAREERS_PORTAL_SLUG set (e.g. "join-7f3k2q"), it is served at /<slug> instead and
 * the default /careers pages 404 (the footer, canonicals and sitemap follow it, so
 * indexed /careers URLs would drop out). Its API stays at /careers/api, which the
 * pages call directly.
 */
function careersPortal(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const slug = process.env.CAREERS_PORTAL_SLUG?.replace(/^\/+|\/+$/g, "");
  const custom = slug && slug !== PORTAL.slice(1) ? `/${slug}` : null;

  let base: string;
  if (custom && under(pathname, custom)) base = custom;
  else if (under(pathname, PORTAL)) {
    if (custom && !under(pathname, `${PORTAL}/api`)) return noindex(new NextResponse("Not found", { status: 404 }));
    base = PORTAL;
  } else return null;

  const rest = pathname.slice(base.length);
  const first = rest.split("/")[1];
  // French is the default and has no prefix: send /careers/fr/... to /careers/... so each page has one URL.
  if (first === "fr") {
    const url = request.nextUrl.clone();
    url.pathname = base + rest.slice(3);
    return noindex(NextResponse.redirect(url, 308));
  }
  const target = PORTAL + (["api", "admin", "en"].includes(first) ? rest : `/fr${rest}`);
  const robots = careersRobots(target);
  const url = target === pathname ? null : request.nextUrl.clone();
  if (url) url.pathname = target;
  if (under(target, `${PORTAL}/admin`)) return noindex(withAdminCsp(request, url), robots);
  return noindex(url ? NextResponse.rewrite(url) : NextResponse.next(), robots);
}

/**
 * *.vercel.app hosts duplicate the site. On the production deployment they
 * redirect permanently to the custom domain (same path and query); on preview
 * deployments, responses are marked noindex instead (applied after routing).
 */
function vercelAppHost(request: NextRequest): "redirect" | "noindex" | null {
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
  if (!host.endsWith(".vercel.app")) return null;
  return process.env.VERCEL_ENV === "production" ? "redirect" : "noindex";
}

export function middleware(request: NextRequest) {
  const vercelApp = vercelAppHost(request);
  if (vercelApp === "redirect") {
    const { pathname, search } = request.nextUrl;
    return NextResponse.redirect(`${site.baseUrl}${pathname}${search}`, 301);
  }
  const res = route(request);
  return vercelApp === "noindex" ? noindex(res) : res;
}

/**
 * The French home is served at "/" and /fr redirects there. Other paths without
 * a locale prefix are sent to the French version: real pages permanently (308),
 * anything else temporarily (307, then a 404 under /fr).
 * Everything under a known locale passes through.
 */
function route(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const careers = careersPortal(request);
  if (careers) return careers;
  const url = request.nextUrl.clone();
  // The French home lives at the root (served from /fr) so Google reads the site name there.
  if (pathname === "/") {
    url.pathname = "/fr";
    return NextResponse.rewrite(url);
  }
  if (pathname === "/fr" || pathname === "/fr/") {
    url.pathname = "/";
    return NextResponse.redirect(url, 308);
  }
  const first = pathname.split("/")[1];
  if ((locales as readonly string[]).includes(first)) return NextResponse.next();

  url.pathname = `/fr${pathname}`;
  return NextResponse.redirect(url, knownPaths.has(pathname.replace(/\/$/, "") || "/") ? 308 : 307);
}

export const config = {
  // Skip Next and Vercel internals (/_vercel/insights for analytics) and anything that looks like a file.
  matcher: ["/((?!_next/|_vercel/|.*\\.[^/]+$).*)"],
};
