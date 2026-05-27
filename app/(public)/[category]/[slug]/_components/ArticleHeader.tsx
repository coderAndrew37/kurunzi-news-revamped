// app/(public)/wordpress/[category]/[slug]/_components/ArticleHeader.tsx
// Byline row: avatar + name + meta + share/bookmark actions.
// "use client" kept because ArticleShareButton and ArticleBookmarkButton are interactive.

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
  const readingTime = calcReadingTime(article.content ?? "");
  const timeAgo = getTimeAgo(pub);

  return (
    <header className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-10 pb-8">
      <div className="max-w-[720px]">

        {/* ── Kicker — category pill ───────────────────────────────────── */}
        {primaryCategory && (
          <Link
            href={`/${primaryCategory.slug}`}
            className="inline-block mb-4 pb-1.5 font-bold text-[11px] uppercase tracking-[0.18em] text-red-600 border-b-2 border-red-600 hover:text-red-700 hover:border-red-700 transition-colors no-underline"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            {primaryCategory.name}
          </Link>
        )}

        {/* ── Breaking badge ───────────────────────────────────────────── */}
        {isBreaking && (
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-[0.18em] rounded-sm"
              style={{ fontFamily: "var(--font-ui)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Breaking
            </span>
          </div>
        )}

        {/* ── Headline ─────────────────────────────────────────────────── */}
        <h1
          className="mb-5 font-black leading-[1.1] tracking-[-0.025em] text-gray-900"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.85rem, 4.5vw, 3rem)",
          }}
        >
          {article.title}
        </h1>

        {/* ── Deck / lede ──────────────────────────────────────────────── */}
        {lede && (
          <p
            className="mb-7 pl-4 border-l-[3px] border-gray-200 italic text-gray-600 leading-relaxed"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
            }}
          >
            {lede}
          </p>
        )}

        {/* ── Byline row ───────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-gray-200">

          {/* Author block */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-gray-200">
              <SkeletonImage
                src={authorNode?.avatar?.url ?? null}
                alt={authorNode?.name ?? "Author"}
                className="rounded-full"
              />
            </div>

            <div>
              {authorNode ? (
                <Link
                  href={`/author/${authorNode.slug}`}
                  className="block text-[13px] font-bold text-gray-900 hover:text-red-600 transition-colors no-underline"
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  {authorNode.name}
                </Link>
              ) : (
                <span
                  className="block text-[13px] font-bold text-gray-900"
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  Editorial
                </span>
              )}

              {/* Meta row */}
              <div
                className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-500"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                <Calendar size={11} aria-hidden="true" />
                <time dateTime={article.date}>{formattedDate}</time>
                <span aria-hidden="true" className="text-gray-300">·</span>
                <Clock size={11} aria-hidden="true" />
                <span>{readingTime} min read</span>
                <span aria-hidden="true" className="text-gray-300">·</span>
                <span>{timeAgo}</span>
              </div>
            </div>
          </div>

          {/* Share / bookmark actions */}
          <div className="flex items-center gap-2">
            <ArticleShareButton title={article.title} />
            <ArticleBookmarkButton slug={article.slug} />
          </div>
        </div>
      </div>
    </header>
  );
}