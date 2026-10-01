import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales } from "@/lib/i18n/config";
import { serviceSlugs } from "@/lib/i18n/service-slugs";

/** Unprefixed paths that exist in French, so their redirect can be permanent. */
const knownPaths = new Set([
  "/",
  ...["/services", "/about", "/privacy", "/cookies", "/terms", "/legal-notice"],
  ...serviceSlugs.map((s) => `/services/${s.fr}`),
]);

const PORTAL = "/careers-portal";
const noindex = (res: NextResponse) => {
  res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return res;
};
const under = (pathname: string, base: string) => pathname === base || pathname.startsWith(`${base}/`);

/**
 * The unlisted recruitment portal lives outside the locale tree. With
 * CAREERS_PORTAL_SLUG set (e.g. "join-7f3k2q"), it is served at /<slug> instead and
 * the default /careers-portal pages 404, so the URL can't be guessed. Its API stays
 * at /careers-portal/api, which the pages call directly.
 */
function careersPortal(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const slug = process.env.CAREERS_PORTAL_SLUG?.replace(/^\/+|\/+$/g, "");
  const custom = slug && slug !== PORTAL.slice(1) ? `/${slug}` : null;

  if (custom && under(pathname, custom)) {
    const url = request.nextUrl.clone();
    url.pathname = PORTAL + pathname.slice(custom.length);
    return noindex(NextResponse.rewrite(url));
  }
  if (!under(pathname, PORTAL)) return null;
  if (custom && !under(pathname, `${PORTAL}/api`)) return noindex(new NextResponse("Not found", { status: 404 }));
  return noindex(NextResponse.next());
}

/**
 * Paths without a locale prefix are sent to the French version: real pages
 * permanently (308), anything else temporarily (307, then a 404 under /fr).
 * Everything under a known locale passes through.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const careers = careersPortal(request);
  if (careers) return careers;
  const first = pathname.split("/")[1];
  if ((locales as readonly string[]).includes(first)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/fr" : `/fr${pathname}`;
  return NextResponse.redirect(url, knownPaths.has(pathname.replace(/\/$/, "") || "/") ? 308 : 307);
}

export const config = {
  // Skip Next and Vercel internals (/_vercel/insights for analytics) and anything that looks like a file.
  matcher: ["/((?!_next/|_vercel/|.*\\.[^/]+$).*)"],
};
