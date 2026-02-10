import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js Newsroom Proxy Logic
 * Fixes: Infinite reloads and Turbopack panics by using a custom header guard.
 */
export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];
  const pathname = url.pathname;

  // 1. STYSTEM & RECURSION GUARD (The most important part)
  // Check if this is a system path or if we've already rewritten this specific request.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/site") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/writer") ||
    pathname.includes(".") ||
    request.headers.has("x-middleware-rewrite") || // Next.js internal header
    request.headers.has("x-proxy-done") // Our custom guard
  ) {
    return NextResponse.next();
  }

  // 2. Identify Routing Context
  const isWriterSubdomain = hostname.startsWith("writer.");
  const isAdminSubdomain = hostname.startsWith("admin.");
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/setup-password");

  // 3. Setup Response with Guard Header
  let response = NextResponse.next({
    request: {
      headers: new Headers(request.headers),
    },
  });
  // Add our guard to the request headers for the next middleware pass
  response.headers.set("x-proxy-done", "1");

  // 4. Supabase Setup (Only if needed for subdomains)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          const isDev = process.env.NODE_ENV === "development";
          const cookieDomain = isDev ? "" : ".kurunzinews.com";
          const cookieOptions = { ...options, domain: cookieDomain, path: "/" };
          request.cookies.set({ name, value, ...cookieOptions });
          response.cookies.set({ name, value, ...cookieOptions });
        },
        remove(name: string, options: CookieOptions) {
          const isDev = process.env.NODE_ENV === "development";
          const cookieDomain = isDev ? "" : ".kurunzinews.com";
          const cookieOptions = { ...options, domain: cookieDomain, path: "/" };
          request.cookies.set({ name, value: "", ...cookieOptions });
          response.cookies.set({ name, value: "", ...cookieOptions });
        },
      },
    },
  );

  // 5. Handle Authentication Redirects
  if ((isWriterSubdomain || isAdminSubdomain) && isAuthPage) {
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const mainHost =
      process.env.NODE_ENV === "development"
        ? "localhost:3000"
        : "kurunzinews.com";
    return NextResponse.redirect(
      new URL(pathname, `${protocol}://${mainHost}`),
    );
  }

  // 6. Subdomain Routing
  if (isWriterSubdomain || isAdminSubdomain) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const protocol =
        process.env.NODE_ENV === "development" ? "http" : "https";
      const mainHost =
        process.env.NODE_ENV === "development"
          ? "localhost:3000"
          : "kurunzinews.com";
      return NextResponse.redirect(
        new URL("/login", `${protocol}://${mainHost}`),
      );
    }

    const targetFolder = isWriterSubdomain ? "/writer" : "/admin";
    url.pathname = `${targetFolder}${pathname === "/" ? "" : pathname}`;

    const rewriteRes = NextResponse.rewrite(url);
    rewriteRes.headers.set("x-proxy-done", "1");
    return rewriteRes;
  }

  // 7. Main Domain Routing (Public Site)
  if (!isAuthPage) {
    url.pathname = `/site${pathname === "/" ? "" : pathname}`;

    const rewriteRes = NextResponse.rewrite(url);
    rewriteRes.headers.set("x-proxy-done", "1");
    return rewriteRes;
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Any file with an extension (e.g., .png, .xml, .sitemap)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|feed.xml|news-sitemap.xml|server-sitemap.xml).*)",
  ],
};
