// middleware.ts   ← Keep this filename
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Skip static files, API routes, images, etc.
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname.includes(".") || // files with extensions
    url.pathname.startsWith("/wordpress") ||
    request.headers.has("x-proxy-done")
  ) {
    return NextResponse.next();
  }

  // Optional: Force HTTPS in production
  if (process.env.NODE_ENV === "production" && url.protocol === "http:") {
    url.protocol = "https:";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
