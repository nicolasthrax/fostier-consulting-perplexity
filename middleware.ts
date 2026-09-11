import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Root visitors are redirected to the default locale (/fr).
 * All other requests pass through untouched.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/fr";
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
