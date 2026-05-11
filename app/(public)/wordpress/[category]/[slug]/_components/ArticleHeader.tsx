import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import SkeletonImage from "@/app/_components/ui/SkeletonImage";
import ArticleShareMenu from "./ArticleShareMenu";
import { ArticleDetail } from "@/lib/wordpress/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcReadingTime(html: string) {
  const text = html.replace(/<[^>]+>/g, " ").trim();
  const words = text.split(/\s+/).filter((w) => w.length > 0).length;
  return Math.max(1, Math.ceil(words / 200));
}

function getTimeAgo(date: Date) {
  const h = Math.floor((Date.now() - date.getTime()) / 3_600_000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d}d ago`;
  return `${Math.floor(d / 7)}w ago`;
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, "");
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  article: ArticleDetail;
}

export default function ArticleHeader({ article }: Props) {
  const primaryCategory = article.categories?.nodes[0];
  const pub = new Date(article.date);
  const formattedDate = pub.toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const rt = calcReadingTime(article.content);
  const ago = getTimeAgo(pub);
  const lede =  stripHtml(article.excerpt ?? "") || article.title ;
  const authorNode = article.author?.node;

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
        {article.isBreaking && (
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
        <div
          className="flex flex-wrap items-center justify-between gap-4 pt-5"
          style={{ borderTop: "1px solid var(--color-rule)" }}
        >
          {/* Author */}
          <div className="flex items-center gap-3">
            <div
              className="relative w-11 h-11 rounded-full overflow-hidden shrink-0"
              style={{ border: "2px solid var(--color-rule)" }}
            >
              <SkeletonImage
                src={authorNode?.avatar?.url}
                alt={authorNode?.name ?? "Author"}
                className="rounded-full"
              />
            </div>
            <div>
              {authorNode ? (
                <Link
                  href={`/author/${authorNode.slug}`}
                  className="kn-byline-author"
                >
                  {authorNode.name}
                </Link>
              ) : (
                <span className="kn-byline-author">Editorial</span>
              )}
              <div className="kn-meta">
                <Calendar size={11} />
                <span>{formattedDate}</span>
                <span className="text-[var(--color-ink-faint)]">·</span>
                <Clock size={11} />
                <span>{rt} min read</span>
                <span className="text-[var(--color-ink-faint)]">·</span>
                <span>{ago}</span>
              </div>
            </div>
          </div>

          {/* Share + Bookmark */}
          <ArticleShareMenu title={article.title} slug={article.slug} />
        </div>
      </div>
    </header>
  );
}