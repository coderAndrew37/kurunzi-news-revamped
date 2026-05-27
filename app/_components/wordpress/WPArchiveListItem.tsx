"use client";

// app/_components/wordpress/WPPostListItem.tsx
// Two-column article row: thumbnail left, category + headline right.
// Clean list design: generous row height, full-width dividers, minimal chrome.

import { SportsPost } from "@/lib/wordpress/types";
import ArticleLink from "./WPArticleLink";
import SkeletonImage from "../ui/SkeletonImage";

interface Props {
  post: SportsPost;
  priority?: boolean;
  variant?: "default" | "compact";
}

export default function PostListItem({
  post,
  priority = false,
  variant = "default",
}: Props) {
  const categorySlug =
    post.category?.toLowerCase().replace(/\s+/g, "-") ?? "news";

  const isCompact = variant === "compact";

  return (
    <ArticleLink
      categorySlug={categorySlug}
      slug={post.slug}
      className="group flex items-start gap-5 py-6 px-1"
      aria-label={post.title}
    >
      {/* ── Thumbnail ─────────────────────────────────────────────────── */}
      <div
        className={[
          "relative flex-shrink-0 overflow-hidden rounded-md bg-gray-100",
          "[&_figure]:h-full [&_figure>div]:h-full [&_figure>div]:aspect-auto",
          isCompact ? "w-[120px] h-[85px]" : "w-[160px] h-[110px]",
        ].join(" ")}
      >
        {post.newsData?.isBreaking && (
          <span className="absolute bottom-1.5 left-1.5 z-10 flex items-center gap-1 bg-red-600 text-white text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-sm">
            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
            Live
          </span>
        )}
        <SkeletonImage
          src={post.featuredImage}
          alt={post.title}
          priority={priority}
          className="!aspect-auto h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* ── Text ──────────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 pt-0.5">
        {/* Category label — small, muted, above headline */}
        <span className="block mb-2 text-[12px] font-semibold text-gray-400 uppercase tracking-wider">
          {post.category}
        </span>

        {/* Headline — large, bold, black */}
        <h3
          className={[
            "font-bold text-gray-900 leading-snug group-hover:text-red-600 transition-colors duration-150",
            isCompact ? "text-[15px] line-clamp-2" : "text-[18px] sm:text-[20px] line-clamp-3",
          ].join(" ")}
        >
          {post.title}
        </h3>
      </div>
    </ArticleLink>
  );
}