// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  
  // Track if the incoming traffic is hitting the old legacy domains
  const isOldDomain = hostname === "www.kurunzinews.com" || hostname === "kurunzinews.com";

  if (isOldDomain) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.hostname = "sports.kurunzinews.com";

    // ── 1. Old domain mapped with categories: /[category]/[slug] ──
    // e.g., kurunzinews.com/football/man-utd-vs-chelsea -> sports.kurunzinews.com/football/man-utd-vs-chelsea
    if (segments.length === 2) {
      redirectUrl.pathname = `/${segments[0]}/${segments[1]}`;
    } 
    // ── 2. Old domain bare slug or generic page links ──
    // e.g., kurunzinews.com/breaking-news -> sports.kurunzinews.com/breaking-news
    else {
      redirectUrl.pathname = pathname;
    }

    return NextResponse.redirect(redirectUrl, { status: 301 });
  }

  // If traffic is already on sports.kurunzinews.com, let Next.js native 
  // app routing ([slug] or [category]/[slug]) take over immediately.
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protect assets and backend points from executing middleware overhead
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api|wordpress|wp-admin).*)",
  ],
};