import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales } from "@/lib/i18n/config";

/**
 * Paths without a locale prefix are sent to the French version:
 * "/" → "/fr" (permanent), "/services" → "/fr/services" (temporary, since the
 * target may not exist). Everything under a known locale passes through.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];
  if ((locales as readonly string[]).includes(first)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/fr" : `/fr${pathname}`;
  return NextResponse.redirect(url, pathname === "/" ? 308 : 307);
}

export const config = {
  // Skip Next internals and anything that looks like a file (sitemap.xml, icon.png, …).
  matcher: ["/((?!_next/|.*\\.[^/]+$).*)"],
};
