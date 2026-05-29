// app/(public)/wordpress/[category]/[slug]/_components/ArticleHero.tsx
// Renders the editorial elements (Kicker, Title, Lede, Byline) followed by the Featured Media.

"use client";

import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import SkeletonImage from "@/app/_components/ui/SkeletonImage";
import { WPPostNode } from "@/lib/wordpress/types";
import ArticleShareButton from "./ArticleShareButton";
import ArticleBookmarkButton from "./ArticleBookmarkButton";

function decodeHtmlEntities(str: string): string {
  if (!str) return "";
  return str
    .replace(/&#8230;/g, "...")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"');
}

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

export default function ArticleHero({ article }: Props) {
  const img = article.featuredImage?.node;
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

  const decodedTitle = decodeHtmlEntities(article.title ?? "");
  const decodedLede = decodeHtmlEntities(lede);

  return (
    <div className="w-full pb-6">
      {/* ── Kicker — category pill ───────────────────────────────────── */}
      {primaryCategory && (
        <Link
          href={`/${primaryCategory.slug}`}
          className="inline-block mb-3 pb-1 font-bold text-[11px] uppercase tracking-[0.18em] text-red-600 border-b-2 border-red-600 hover:text-red-700 hover:border-red-700 transition-colors no-underline"
          style={{ fontFamily: "var(--font-ui)" }}
        >
          {primaryCategory.name}
        </Link>
      )}

      {/* ── Breaking badge ───────────────────────────────────────────── */}
      {isBreaking && (
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-600 text-white text-[9px] font-bold uppercase tracking-[0.18em] rounded-sm"
            style={{ fontFamily: "var(--font-ui)" }}>
            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
            Breaking
          </span>
        </div>
      )}

      {/* ── Headline ─────────────────────────────────────────────────── */}
      <h1
        className="mb-4 font-black leading-[1.15] tracking-[-0.02em] text-gray-900"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
        }}
      >
        {decodedTitle}
      </h1>

      {/* ── Deck / lede ──────────────────────────────────────────────── */}
      {decodedLede && (
        <p
          className="mb-6 pl-4 border-l-[3px] border-gray-200 italic text-gray-600 leading-relaxed text-[1.05rem]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {decodedLede}
        </p>
      )}

      {/* ── Byline Row ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 py-4 mb-6 border-y border-gray-100">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-gray-200">
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
                className="block text-[12px] font-bold text-gray-900 hover:text-red-600 transition-colors no-underline"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                {authorNode.name}
              </Link>
            ) : (
              <span className="block text-[12px] font-bold text-gray-900" style={{ fontFamily: "var(--font-ui)" }}>
                Editorial
              </span>
            )}

            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-gray-500" style={{ fontFamily: "var(--font-ui)" }}>
              <time dateTime={article.date}>{formattedDate}</time>
              <span aria-hidden="true" className="text-gray-300">·</span>
              <span>{readingTime} min read</span>
              <span aria-hidden="true" className="text-gray-300">·</span>
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <ArticleShareButton title={decodedTitle} />
          <ArticleBookmarkButton slug={article.slug} />
        </div>
      </div>

      {/* ── Featured Image Block ──────────────────────────────────────── */}
      {img?.sourceUrl && (
        <figure className="mb-8">
          <div className="relative w-full overflow-hidden rounded-sm bg-gray-100 aspect-video">
            <SkeletonImage
  src={img.sourceUrl}
  alt={img.altText ?? decodedTitle}
  priority
  sizes="(max-width: 1024px) 100vw, 800px" /* Tells Next.js to pull crisp resolution for the wide main column */
  className="object-cover"
/>
          </div>

          {img.caption && (
            <figcaption
              className="mt-3 pl-3 border-l-2 border-red-600 text-[11px] tracking-wide leading-snug text-gray-500 [&_p]:m-0 [&_p]:inline"
              style={{ fontFamily: "var(--font-ui)" }}
              dangerouslySetInnerHTML={{ __html: img.caption }}
            />
          )}
        </figure>
      )}
    </div>
  );
}