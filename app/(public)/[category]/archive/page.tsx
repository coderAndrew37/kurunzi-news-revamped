// app/[category]/archive/page.tsx
// Full archive for a category — clean list layout like People Daily.
// URL: /football/archive, /athletics/archive, etc.
// Linked from the category page's "Browse Full Archive" button.
// Uses getCategoryArchive() with WPGraphQL cursor pagination.
//
// CHANGES (logic only, styling untouched):
//   1. generateMetadata now fetches posts — page 1 uses posts[0].title as
//      the page title (PD pattern). Next.js deduplicates the fetch so there
//      is no extra round-trip to WordPress.
//   2. Inline pagination replaced with <WPPagination /> — reusable across
//      archive, search, tag, and author pages.

import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryArchive } from "@/lib/wordpress/data";
import PostListItem from "@/app/_components/wordpress/WPArchiveListItem";
import WPPagination from "@/app/_components/wordpress/WPPagination";

const POSTS_PER_PAGE = 12;

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}

// ── Cursor helper ──────────────────────────────────────────────────────────
// WPGraphQL cursor: arrayconnection:<zero-based-index-of-last-item-on-prev-page>
function buildCursor(page: number): string | null {
  if (page <= 1) return null;
  return btoa(`arrayconnection:${(page - 1) * POSTS_PER_PAGE - 1}`);
}

// ── Metadata ───────────────────────────────────────────────────────────────
// Fetches posts so we can use the top story's title on page 1 (PD pattern).
// Next.js memoises identical fetches within the same render — the page
// component's getCategoryArchive() call below hits the cache, not the network.

export async function generateMetadata({ params, searchParams }: PageProps) {
  const { category: categorySlug } = await params;
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10));

  const { posts } = await getCategoryArchive(
    categorySlug,
    POSTS_PER_PAGE,
    buildCursor(currentPage)
  );

  if (posts.length === 0) {
    return { title: "Not Found | Kurunzi Sports" };
  }

  const categoryTitle = posts[0].category;

  return {
    title:
      currentPage === 1
        ? `${posts[0].title} | Kurunzi Sports`
        : `${categoryTitle} — Page ${currentPage} | Kurunzi Sports`,
    description: `All ${categoryTitle} coverage from Kurunzi Sports`,
    alternates: {
      canonical:
        currentPage === 1
          ? `/${categorySlug}/archive`
          : `/${categorySlug}/archive?page=${currentPage}`,
    },
  };
}

// ── Page component ─────────────────────────────────────────────────────────

export default async function CategoryArchivePage({ params, searchParams }: PageProps) {
  const { category: categorySlug } = await params;
  const { page: pageParam } = await searchParams;

  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10));

  // Deduplicated with the generateMetadata() fetch above
  const { posts, pageInfo } = await getCategoryArchive(
    categorySlug,
    POSTS_PER_PAGE,
    buildCursor(currentPage)
  );

  if (posts.length === 0) notFound();

  const categoryTitle = posts[0].category;

  return (
    <main className="min-h-screen pb-24" style={{ background: "var(--paper)" }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="border-b" style={{ borderColor: "var(--rule)" }}>
        <div className="max-w-[760px] mx-auto px-4 sm:px-6 pt-10 pb-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-6 text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ fontFamily: "var(--font-ui)", color: "var(--ink-faint)" }}
          >
            <Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/${categorySlug}`} className="hover:text-[var(--accent)] transition-colors">
              {categoryTitle}
            </Link>
            <span>/</span>
            <span style={{ color: "var(--ink-muted)" }}>Archive</span>
          </nav>

          {/* Title */}
          <div className="flex items-baseline gap-3 mb-1">
            <span
              className="text-2xl font-black"
              style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}
            >
              »
            </span>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 900,
                letterSpacing: "-0.025em",
                color: "var(--ink)",
              }}
            >
              {categoryTitle}
            </h1>
          </div>

          <p
            className="text-[11px] uppercase tracking-[0.15em] mt-2"
            style={{ fontFamily: "var(--font-ui)", color: "var(--ink-faint)" }}
          >
            Page {currentPage} · {POSTS_PER_PAGE} per page
          </p>
        </div>
      </div>

      {/* ── Article list ────────────────────────────────────────────────── */}
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 pt-2">

        <div className="divide-y" style={{ borderColor: "var(--rule)" }}>
          {posts.map((post, i) => (
            <div key={post.slug} className="py-5">
              <PostListItem
                post={post}
                priority={i < 3 && currentPage === 1}
              />
            </div>
          ))}
        </div>

        {/* ── Pagination ──────────────────────────────────────────────── */}
        <WPPagination
          currentPage={currentPage}
          hasNextPage={pageInfo.hasNextPage}
          basePath={`/${categorySlug}/archive`}
        />

        {/* Back to category */}
        <div
          className="mt-10 pt-8 border-t text-center"
          style={{ borderColor: "var(--rule)" }}
        >
          <Link
            href={`/${categorySlug}`}
            className="text-[10px] font-bold uppercase tracking-[0.18em] transition-colors hover:text-[var(--accent)]"
            style={{ fontFamily: "var(--font-ui)", color: "var(--ink-faint)" }}
          >
            ← Back to {categoryTitle}
          </Link>
        </div>
      </div>
    </main>
  );
}