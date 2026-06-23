// app/_components/wordpress/WPNewsSection.tsx
// BBC-style "More Top Stories" feed — a strict, uniform grid. Every card
// shares the exact same structure (aspect-locked thumbnail → category tag →
// bold headline → elapsed time), so the eye never has to re-learn a layout
// moving down the page. No borders between cards — whitespace plus the
// section rule at the top do all the separating work.
//
// Theme locked — red-600 / gray-900 / white palette is the north star.
// Prop signature (title, slug, posts, viewAllHref, viewAllLabel) is fully
// preserved from the previous version — anything else importing this
// component (e.g. category archive pages) keeps working unchanged.

import Link from "next/link";
import ArticleLink from "@/app/_components/wordpress/WPArticleLink";
import SkeletonImage from "@/app/_components/ui/SkeletonImage";
import { SportsPost } from "@/lib/wordpress/types";
import { getElapsedLabel } from "@/lib/utils/time";

interface NewsSectionProps {
  title: string;
  slug: string;
  posts: SportsPost[];
  viewAllHref?: string;
  viewAllLabel?: string;
}

function FeedCard({ post, sectionSlug }: { post: SportsPost; sectionSlug: string }) {
  const catSlug = post.category?.toLowerCase().replace(/\s+/g, "-") ?? sectionSlug;

  return (
    <ArticleLink categorySlug={catSlug} slug={post.slug} className="group flex flex-col">
      <div className="relative overflow-hidden rounded-lg aspect-video bg-gray-100 mb-3">
        <SkeletonImage
          src={post.featuredImage}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-1.5">
        {post.category}
      </span>

      <h3 className="text-[15px] font-bold text-gray-900 leading-snug group-hover:text-red-600 transition-colors line-clamp-3">
        {post.title}
      </h3>

      <span className="mt-2 text-[11px] font-medium text-gray-400">
        {getElapsedLabel(post.date)}
      </span>
    </ArticleLink>
  );
}

export default function NewsSection({
  title,
  slug,
  posts,
  viewAllHref,
  viewAllLabel = "View All",
}: NewsSectionProps) {
  if (!posts || posts.length === 0) return null;

  const resolvedHref = viewAllHref ?? `/${slug}`;

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-red-600">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 bg-red-600 rounded-sm" />
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
              {title}
            </h2>
          </div>

          <Link
            href={resolvedHref}
            className="flex items-center gap-2 text-red-600 hover:text-gray-900 text-xs font-bold uppercase tracking-wider transition-colors group"
          >
            {viewAllLabel}
            <svg
              className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* ── Uniform Grid ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-9">
          {posts.map((post) => (
            <FeedCard key={post.slug} post={post} sectionSlug={slug} />
          ))}
        </div>
      </div>
    </section>
  );
}