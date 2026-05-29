// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL!;

// ─── Fetch the category for a slug via GraphQL ────────────────────────────────
async function getCategoryForSlug(slug: string): Promise<string | null> {
  try {
    const res = await fetch(WORDPRESS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-requested-by": "kurunzi-middleware",
      },
      body: JSON.stringify({
        query: `
          query GetPostCategory($slug: String!) {
            postBy(slug: $slug) {
              categories {
                nodes {
                  slug
                }
              }
            }
          }
        `,
        variables: { slug },
      }),
      cache: "no-store",
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.postBy?.categories?.nodes?.[0]?.slug ?? null;
  } catch {
    return null;
  }
}

// ─── Detect a legacy bare-slug path ───────────────────────────────────────────
// Matches:  /some-article-slug  (single segment, no extension)
// Ignores:  /category/slug, /_next/..., /api/..., /wp-..., etc.
function isLegacySlugPath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  return (
    segments.length === 1 &&
    !segments[0].includes(".") &&
    !segments[0].startsWith("_") &&
    ![
      "api",
      "wordpress",
      "wp-admin",
      "wp-content",
      "wp-json",
      "not-found",
      "sitemap.xml",
      "robots.txt",
    ].includes(segments[0])
  );
}

// ─── Main middleware export ────────────────────────────────────────────────────
export async function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  const isOldDomain =
    hostname === "www.kurunzinews.com" || hostname === "kurunzinews.com";

  // ── 1. Old domain with two segments: /[category]/[slug] ──────────────────────
  // www.kurunzinews.com/sports/some-article
  //   → sports.kurunzinews.com/wordpress/sports/some-article
  if (isOldDomain && segments.length === 2) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.hostname = "sports.kurunzinews.com";
    redirectUrl.pathname = `/wordpress/${segments[0]}/${segments[1]}`;
    return NextResponse.redirect(redirectUrl, { status: 301 });
  }

  // ── 2. Old domain with any other non-bare-slug path ───────────────────────────
  // www.kurunzinews.com/about → sports.kurunzinews.com/about
  if (isOldDomain && !isLegacySlugPath(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.hostname = "sports.kurunzinews.com";
    return NextResponse.redirect(redirectUrl, { status: 301 });
  }

  // ── 3. Bare slug on any domain — look up category via GraphQL and redirect ────
  // sports.kurunzinews.com/some-article-slug
  //   → sports.kurunzinews.com/wordpress/athletics/some-article-slug
  if (isLegacySlugPath(pathname)) {
    const slug = pathname.replace(/^\//, "");
    const category = await getCategoryForSlug(slug);

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.hostname = "sports.kurunzinews.com";

    if (category) {
      redirectUrl.pathname = `/wordpress/${category}/${slug}`;
    } else {
      redirectUrl.pathname = `/not-found`;
    }

    const response = NextResponse.redirect(redirectUrl, { status: 301 });
    response.headers.set("x-redirect-source", "legacy-slug-rewrite");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};