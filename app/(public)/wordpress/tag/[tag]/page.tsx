// app/tag/[tag]/page.tsx
// Tag archive page — mirrors CategoryPage structure.
// Uses getPostsByTag() which returns pageInfo for cursor-based pagination.

import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, ArrowLeft, Hash } from "lucide-react";
import { getPostsByTag } from "@/lib/wordpress/data";
import PostListItem from "@/app/_components/wordpress/WPArchiveListItem";

const POSTS_PER_PAGE = 15;

interface PageProps {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function TagPage({ params, searchParams }: PageProps) {
  const { tag: tagSlug } = await params;
  const { page: pageParam } = await searchParams;

  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10));
  const after = currentPage > 1
    ? btoa(`arrayconnection:${(currentPage - 1) * POSTS_PER_PAGE - 1}`)
    : null;

  const { tagInfo, posts, pageInfo } = await getPostsByTag(tagSlug, POSTS_PER_PAGE, after);

  if (posts.length === 0) notFound();

  const tagName = tagInfo?.name ?? decodeURIComponent(tagSlug).replace(/-/g, " ");

  return (
    <main className="min-h-screen pb-24" style={{ background: "var(--paper)" }}>

      {/* ── Tag header ──────────────────────────────────────────────────── */}
      <div
        className="border-b"
        style={{ borderColor: "var(--rule)", background: "var(--paper-warm)" }}
      >
        <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 mb-6 text-[10px] font-bold uppercase tracking-[0.18em] transition-colors hover:text-[var(--accent)]"
            style={{ color: "var(--ink-faint)", fontFamily: "var(--font-ui)" }}
          >
            <ArrowLeft size={11} />
            All Sports
          </Link>

          <div className="flex items-start gap-3 mb-2">
            <Hash
              size={28}
              strokeWidth={3}
              style={{ color: "var(--accent)", marginTop: 4, flexShrink: 0 }}
            />
            <h1
              className="leading-none"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 5vw, 3.25rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                color: "var(--ink)",
              }}
            >
              {tagName}
            </h1>
          </div>

          <p
            className="mt-3 text-sm"
            style={{ fontFamily: "var(--font-body)", color: "var(--ink-muted)", fontStyle: "italic" }}
          >
            {tagInfo?.count
              ? `${tagInfo.count} article${tagInfo.count !== 1 ? "s" : ""} tagged`
              : "Tagged articles"}{" "}
            · Page {currentPage}
          </p>
        </div>
      </div>

      {/* ── Article list ────────────────────────────────────────────────── */}
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 pt-10">

        {/* Divider rule */}
        <div
          className="flex items-center gap-3 mb-8"
          style={{ borderTop: "2px solid var(--ink)", paddingTop: "1rem" }}
        >
          <span
            className="text-[10px] font-black uppercase tracking-[0.2em]"
            style={{ fontFamily: "var(--font-ui)", color: "var(--ink-soft)" }}
          >
            {posts.length} stories this page
          </span>
        </div>

        <div className="flex flex-col gap-5">
          {posts.map((post, i) => (
            <PostListItem
              key={post.slug}
              post={post}
              priority={i < 3}
            />
          ))}
        </div>

        {/* ── Pagination ──────────────────────────────────────────────── */}
        <div
          className="mt-12 pt-8 border-t flex items-center justify-between gap-4 flex-wrap"
          style={{ borderColor: "var(--rule)" }}
        >
          {currentPage > 1 ? (
            <Link
              href={`/tag/${tagSlug}?page=${currentPage - 1}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border font-bold text-[11px] uppercase tracking-wider transition-all hover:border-[var(--ink)] hover:text-[var(--ink)]"
              style={{ borderColor: "var(--rule)", color: "var(--ink-soft)", fontFamily: "var(--font-ui)" }}
            >
              <ChevronLeft size={14} />
              Newer
            </Link>
          ) : (
            <span
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border font-bold text-[11px] uppercase tracking-wider opacity-30 cursor-not-allowed"
              style={{ borderColor: "var(--rule)", color: "var(--ink-soft)", fontFamily: "var(--font-ui)" }}
            >
              <ChevronLeft size={14} />
              Newer
            </span>
          )}

          <span
            className="text-[11px] font-bold uppercase tracking-wider"
            style={{ fontFamily: "var(--font-ui)", color: "var(--ink-muted)" }}
          >
            Page {currentPage}
          </span>

          {pageInfo.hasNextPage ? (
            <Link
              href={`/tag/${tagSlug}?page=${currentPage + 1}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border font-bold text-[11px] uppercase tracking-wider transition-all hover:bg-[var(--ink)] hover:border-[var(--ink)] hover:text-white"
              style={{ borderColor: "var(--rule)", color: "var(--ink-soft)", fontFamily: "var(--font-ui)" }}
            >
              Older
              <ChevronRight size={14} />
            </Link>
          ) : (
            <span
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border font-bold text-[11px] uppercase tracking-wider opacity-30 cursor-not-allowed"
              style={{ borderColor: "var(--rule)", color: "var(--ink-soft)", fontFamily: "var(--font-ui)" }}
            >
              Older
              <ChevronRight size={14} />
            </span>
          )}
        </div>

        {/* Back home */}
        <div
          className="mt-12 pt-8 border-t text-center"
          style={{ borderColor: "var(--rule)" }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] transition-colors hover:text-[var(--accent)]"
            style={{ color: "var(--ink-muted)", fontFamily: "var(--font-ui)" }}
          >
            <ArrowLeft size={11} />
            Back to all sports
          </Link>
        </div>
      </div>
    </main>
  );
}