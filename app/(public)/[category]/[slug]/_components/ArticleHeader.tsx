// app/(public)/wordpress/[category]/[slug]/_components/ArticleHeader.tsx
"use client";

import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { WPPostNode } from "@/lib/wordpress/types";
import SkeletonImage from "@/app/_components/ui/SkeletonImage";
import ArticleShareButton from "./ArticleShareButton";
import ArticleBookmarkButton from "./ArticleBookmarkButton";

function calcReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ").trim();
  const words = text.split(/\s+/).filter((w) => w.length > 0).length;
  return Math.max(1, Math.ceil(words / 200));
}

function getTimeAgo(date: Date): string {
  const h = Math.floor((Date.now() - date.getTime()) / 3_600_000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d}d ago`;
  return `${Math.floor(d / 7)}w ago`;
}

interface Props {
  article: WPPostNode;
}

export default function ArticleHeader({ article }: Props) {
  const primaryCategory = article.categories?.nodes[0];
  const authorNode = article.author?.node;
  const pub = new Date(article.date);

  // ✅ Correct path: article.articleFields.newsData (not article.newsData)
  const isBreaking = article.articleFields?.newsData?.isBreaking ?? false;
  const lede =
    article.articleFields?.newsData?.theLede ||
    article.excerpt?.replace(/<[^>]+>/g, "") ||
    "";

  const formattedDate = pub.toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const readingTime = calcReadingTime(article.content);
  const timeAgo = getTimeAgo(pub);

  return (
    <header className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-10 pb-8">
      <div className="max-w-[720px] mx-auto">

        {/* Kicker */}
        {primaryCategory && (
          <Link href={`/${primaryCategory.slug}`} className="kn-kicker">
            {primaryCategory.name}
          </Link>
        )}

        {/* Breaking badge */}
        {isBreaking && (
          <div className="flex items-center gap-2 mb-4">
            <span className="kn-breaking-badge">
              <span className="kn-pulse-dot" />
              Breaking
            </span>
          </div>
        )}

        {/* Headline */}
        <h1 className="kn-headline">{article.title}</h1>

        {/* Deck / lede */}
        {lede && <p className="kn-deck">{lede}</p>}

        {/* Byline row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-[var(--rule)]">

          {/* Author */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-[var(--rule)]">
              <SkeletonImage
                src={authorNode?.avatar?.url ?? null}
                alt={authorNode?.name ?? "Author"}
                className="rounded-full"
              />
            </div>

            <div>
              {authorNode ? (
                <Link href={`/author/${authorNode.slug}`} className="kn-byline-author">
                  {authorNode.name}
                </Link>
              ) : (
                <span className="kn-byline-author">Editorial</span>
              )}
              <div className="kn-meta">
                <Calendar size={11} />
                <span>{formattedDate}</span>
                <span className="text-[var(--ink-faint)]">·</span>
                <Clock size={11} />
                <span>{readingTime} min read</span>
                <span className="text-[var(--ink-faint)]">·</span>
                <span>{timeAgo}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ArticleShareButton title={article.title} />
            <ArticleBookmarkButton slug={article.slug} />
          </div>
        </div>
      </div>
    </header>
  );
}