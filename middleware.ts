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

/**
 * Paths without a locale prefix are sent to the French version: real pages
 * permanently (308), anything else temporarily (307, then a 404 under /fr).
 * Everything under a known locale passes through.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];
  if ((locales as readonly string[]).includes(first)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/fr" : `/fr${pathname}`;
  return NextResponse.redirect(url, knownPaths.has(pathname.replace(/\/$/, "") || "/") ? 308 : 307);
}

export const config = {
  // Skip Next internals and anything that looks like a file (sitemap.xml, icon.png, …).
  matcher: ["/((?!_next/|.*\\.[^/]+$).*)"],
};
