// app/[category]/archive/page.tsx
// Full archive for a category — clean list layout like People Daily.
// URL: /football/archive, /athletics/archive, etc.
// Linked from the category page's "Browse Full Archive" button.
// Uses getCategoryArchive() with WPGraphQL cursor pagination.

import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCategoryArchive } from "@/lib/wordpress/data";
import PostListItem from "@/app/_components/wordpress/WPArchiveListItem";

const POSTS_PER_PAGE = 12;

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}

// Generate metadata
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const title = category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${title} Archive | Kurunzi Sports`,
    description: `All ${title} coverage from Kurunzi Sports`,
  };
}

export default async function CategoryArchivePage({ params, searchParams }: PageProps) {
  const { category: categorySlug } = await params;
  const { page: pageParam } = await searchParams;

  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10));

  // WPGraphQL cursor: arrayconnection:<zero-based-index-of-last-item-on-previous-page>
  const after = currentPage > 1
    ? btoa(`arrayconnection:${(currentPage - 1) * POSTS_PER_PAGE - 1}`)
    : null;

  const { posts, pageInfo } = await getCategoryArchive(categorySlug, POSTS_PER_PAGE, after);

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
        <div
          className="mt-8 pt-8 border-t flex items-center justify-between"
          style={{ borderColor: "var(--rule)" }}
        >
          {/* Prev */}
          {currentPage > 1 ? (
            <Link
              href={`/${categorySlug}/archive?page=${currentPage - 1}`}
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider transition-colors hover:text-[var(--accent)]"
              style={{ fontFamily: "var(--font-ui)", color: "var(--ink-soft)" }}
            >
              <ChevronLeft size={14} />
              Newer stories
            </Link>
          ) : (
            <span
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider opacity-25"
              style={{ fontFamily: "var(--font-ui)", color: "var(--ink-soft)" }}
            >
              <ChevronLeft size={14} />
              Newer stories
            </span>
          )}

          {/* Page number */}
          <span
            className="text-[11px] font-bold tabular-nums"
            style={{ fontFamily: "var(--font-ui)", color: "var(--ink-faint)" }}
          >
            {currentPage}
          </span>

          {/* Next */}
          {pageInfo.hasNextPage ? (
            <Link
              href={`/${categorySlug}/archive?page=${currentPage + 1}`}
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider transition-colors hover:text-[var(--accent)]"
              style={{ fontFamily: "var(--font-ui)", color: "var(--ink-soft)" }}
            >
              Older stories
              <ChevronRight size={14} />
            </Link>
          ) : (
            <span
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider opacity-25"
              style={{ fontFamily: "var(--font-ui)", color: "var(--ink-soft)" }}
            >
              Older stories
              <ChevronRight size={14} />
            </span>
          )}
        </div>

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