"use client";

// app/_components/wordpress/WPPostListItem.tsx
// Two-column article row: thumbnail left, text right.
// Styled after PD Digital's clean list layout, adapted for Kurunzi Sports.
// Uses SkeletonImage — wrapped in an overflow-hidden container to clip
// its internal aspect-[16/9] figure down to the thumbnail box size.

import { Calendar } from "lucide-react";
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

  const excerpt =
    post.newsData?.theLede || post.excerpt?.replace(/<[^>]+>/g, "") || "";

  const isCompact = variant === "compact";

  // Thumbnail dimensions
  const thumbW = isCompact ? "w-20" : "w-[100px] sm:w-[120px]";
  const thumbH = isCompact ? "h-16" : "h-[68px] sm:h-20";

  return (
    <ArticleLink
      categorySlug={categorySlug}
      slug={post.slug}
      className="group flex items-start gap-4 sm:gap-5 py-4 border-b border-[var(--rule)] last:border-0 hover:bg-[var(--paper-warm)] transition-colors duration-150 -mx-3 px-3 rounded-sm"
    >
      {/* ── Thumbnail ──────────────────────────────────────────────────────── */}
      {/*
        SkeletonImage renders a <figure> with aspect-[16/9] internally.
        We constrain it by:
          1. A fixed-size outer div (thumbW × thumbH) with overflow-hidden
          2. Passing className="!aspect-auto h-full" to override the internal
             aspect ratio so the <img>/<Image> fills our box instead.
        The [&>div] selector targets SkeletonImage's inner wrapper div.
      */}
      <div
        className={`relative flex-shrink-0 overflow-hidden rounded-sm bg-[var(--paper-warm)] ${thumbW} ${thumbH} [&_figure]:h-full [&_figure>div]:h-full [&_figure>div]:aspect-auto`}
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
          // className targets the <img> itself — make it fill the constrained box
          className="!aspect-auto h-full w-full"
        />
      </div>

      {/* ── Text ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-1.5 py-0.5">
        <div>
          {/* Category kicker — matches PD's small label above headline */}
          <span className="inline-block mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent)] font-['Barlow_Condensed']">
            {post.category}
          </span>

          {/* Headline */}
          <h3
            className={[
              "leading-snug group-hover:opacity-70 transition-opacity font-['Barlow_Condensed'] font-bold text-[var(--ink)]",
              isCompact
                ? "text-[13px] line-clamp-2"
                : "text-[15px] sm:text-[16px] line-clamp-3",
            ].join(" ")}
            style={{ letterSpacing: "-0.01em" }}
          >
            {post.title}
          </h3>

          {/* Lede — default variant, larger screens only */}
          {!isCompact && excerpt && (
            <p className="hidden sm:block mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-[var(--ink-soft)] italic font-['Source_Serif_4']">
              {excerpt}
            </p>
          )}
        </div>

        {/* Date */}
        <div className="flex items-center gap-1.5 text-[var(--ink-faint)]">
          <Calendar size={9} />
          <span className="text-[10px] font-semibold uppercase tracking-[0.06em] font-['Barlow_Condensed']">
            {new Date(post.date).toLocaleDateString("en-KE", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </ArticleLink>
  );
}
