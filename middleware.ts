import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales } from "@/lib/i18n/config";
import { serviceSlugs } from "@/lib/i18n/service-slugs";
import { site } from "@/lib/site";

/** Unprefixed paths that exist in French, so their redirect can be permanent. */
const knownPaths = new Set([
  "/",
  ...["/services", "/about", "/privacy", "/cookies", "/terms", "/legal-notice"],
  ...serviceSlugs.map((s) => `/services/${s.fr}`),
]);

const PORTAL = "/careers";
const noindex = (res: NextResponse) => {
  res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return res;
};
const under = (pathname: string, base: string) => pathname === base || pathname.startsWith(`${base}/`);

/**
 * The unlisted recruitment portal lives outside the locale tree: French at
 * /careers (rewritten to /careers/fr) and English at /careers/en. With
 * CAREERS_PORTAL_SLUG set (e.g. "join-7f3k2q"), it is served at /<slug> instead and
 * the default /careers pages 404, so the URL can't be guessed. Its API stays
 * at /careers/api, which the pages call directly.
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
  if (target === pathname) return noindex(NextResponse.next());
  const url = request.nextUrl.clone();
  url.pathname = target;
  return noindex(NextResponse.rewrite(url));
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
