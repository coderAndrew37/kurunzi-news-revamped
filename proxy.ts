import { NextRequest, NextResponse } from "next/server";

// Export as 'proxy' to satisfy the new Next.js convention
export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    request.headers.has("x-proxy-done")
  ) {
    return NextResponse.next();
  }

  url.pathname = `/site${pathname === "/" ? "" : pathname}`;
  const response = NextResponse.rewrite(url);
  response.headers.set("x-proxy-done", "1");
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
