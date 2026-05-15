// app/_components/wordpress/WPPostListItem.tsx
// Reusable two-column article card: image left, text right.
// Used on: category archive, tag pages, search results.
// Accepts SportsPost (lean card shape) — no WPPostNode needed.

import Image from "next/image";
import { Calendar } from "lucide-react";
import { SportsPost } from "@/lib/wordpress/types";
import ArticleLink from "./WPArticleLink";

interface Props {
  post: SportsPost;
  priority?: boolean;
  // Compact = smaller image, tighter padding. Default = standard list item.
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

  return (
    <ArticleLink
      categorySlug={categorySlug}
      slug={post.slug}
      className="group flex gap-4 sm:gap-5 border-b border-[var(--rule)] pb-5 last:border-0 last:pb-0 hover:bg-[var(--paper-warm)] transition-colors -mx-3 px-3 rounded-sm"
    >
      {/* Image */}
      <div
        className={`relative flex-shrink-0 overflow-hidden rounded-sm bg-[var(--paper-warm)] ${
          isCompact ? "w-20 h-16" : "w-28 h-20 sm:w-36 sm:h-[100px]"
        }`}
      >
        {post.featuredImage ? (
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes={isCompact ? "80px" : "(max-width: 640px) 112px, 144px"}
          />
        ) : (
          // Branded placeholder when no image
          <div className="absolute inset-0 bg-[var(--paper-warm)] flex items-center justify-center">
            <span
              className="font-black text-[var(--rule)] text-2xl italic"
              style={{ fontFamily: "var(--font-display)" }}
            >
              KS
            </span>
          </div>
        )}

        {/* Breaking badge over image */}
        {post.newsData?.isBreaking && (
          <span className="absolute bottom-1.5 left-1.5 flex items-center gap-1 bg-red-600 text-white text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-sm">
            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
            Live
          </span>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-1.5">
        <div>
          {/* Category kicker */}
          <span
            className="inline-block mb-1.5 text-[9px] font-bold uppercase tracking-[0.18em]"
            style={{ color: "var(--accent)" }}
          >
            {post.category}
          </span>

          {/* Headline */}
          <h3
            className="leading-snug group-hover:opacity-75 transition-opacity line-clamp-3"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: isCompact ? "0.8125rem" : "0.9375rem",
              color: "var(--ink)",
              letterSpacing: "-0.01em",
            }}
          >
            {post.title}
          </h3>

          {/* Lede — only in default variant and on larger screens */}
          {!isCompact && excerpt && (
            <p
              className="hidden sm:block mt-1.5 line-clamp-2 text-[13px] leading-relaxed"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--ink-soft)",
                fontStyle: "italic",
              }}
            >
              {excerpt}
            </p>
          )}
        </div>

        {/* Date */}
        <div className="flex items-center gap-1.5" style={{ color: "var(--ink-faint)" }}>
          <Calendar size={9} />
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.06em]"
            style={{ fontFamily: "var(--font-ui)" }}
          >
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