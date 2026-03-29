"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Share2,
  Bookmark,
  ChevronLeft,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  Check,
  ArrowUp,
} from "lucide-react";

import "./article-page.css";
import ArticleLink from "@/app/_components/wordpress/WPArticleLink";
import {
  WPPostNode as ArticleDetail,
  SportsPost,
} from "@/lib/wordpress/wp-api";
import SkeletonImage from "@/app/_components/ui/SkeletonImage";

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

interface ArticlePageClientProps {
  article: ArticleDetail;
  latestPosts: SportsPost[];
  relatedPosts: SportsPost[];
}

export default function ArticlePageClient({
  article,
  latestPosts,
  relatedPosts,
}: ArticlePageClientProps) {
  const router = useRouter();

  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  const primaryCategory = article.categories?.nodes[0];
  const pub = new Date(article.date);
  const formattedDate = pub.toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const rt = calcReadingTime(article.content);
  const ago = getTimeAgo(pub);
  const lede = article.newsData?.theLede || stripHtml(article.excerpt ?? "");
  const authorNode = article.author?.node;

  useEffect(() => {
    const saved: string[] = JSON.parse(
      localStorage.getItem("kn_bookmarks") ?? "[]",
    );
    setBookmarked(saved.includes(article.slug));
  }, [article.slug]);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(Math.min(100, (window.scrollY / h) * 100));
      setShowTop(window.scrollY > 800);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node))
        setShareOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const handleBookmark = () => {
    const next = !bookmarked;
    setBookmarked(next);
    const saved: string[] = JSON.parse(
      localStorage.getItem("kn_bookmarks") ?? "[]",
    );
    localStorage.setItem(
      "kn_bookmarks",
      JSON.stringify(
        next
          ? [...saved, article.slug]
          : saved.filter((s) => s !== article.slug),
      ),
    );
  };

  const handleShare = (
    platform: "twitter" | "facebook" | "linkedin" | "copy",
  ) => {
    const url = window.location.href;
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };
    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      window.open(urls[platform], "_blank", "noopener");
    }
    setShareOpen(false);
  };

  return (
    <article
      className="min-h-screen"
      style={{ background: "var(--paper)", color: "var(--ink)" }}
    >
      {/* ── Reading progress bar ──────────────────────────────────────────── */}
      <div
        className="fixed top-0 left-0 right-0 z-[100] h-[3px]"
        style={{ background: "var(--rule)" }}
      >
        <div
          className="h-full transition-[width] duration-100"
          style={{ width: `${progress}%`, background: "var(--accent)" }}
        />
      </div>

      {/* ── Sticky breadcrumb nav ─────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-40 border-b"
        style={{ background: "var(--paper)", borderColor: "var(--rule)" }}
      >
        <div className="max-w-[1140px] mx-auto px-6 h-12 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 cursor-pointer bg-transparent border-none p-0"
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: ".06em",
              textTransform: "uppercase",
              color: "var(--ink-muted)",
            }}
          >
            <ChevronLeft size={15} />
            Back
          </button>

          {primaryCategory && (
            <>
              <div
                className="w-px h-3.5"
                style={{ background: "var(--rule)" }}
              />
              <Link
                href={`/${primaryCategory.slug}`}
                className="kn-kicker mb-0 pb-0 border-b-0"
              >
                {primaryCategory.name}
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ════════════════════════════════════════════════════════════════════
          HEADER
      ════════════════════════════════════════════════════════════════════ */}
      <header className="max-w-[1140px] mx-auto px-6 pt-12 pb-8">
        <div className="max-w-[720px] mx-auto">
          {primaryCategory && (
            <Link href={`/${primaryCategory.slug}`} className="kn-kicker">
              {primaryCategory.name}
            </Link>
          )}

          {article.newsData?.isBreaking && (
            <div className="flex items-center gap-2 mb-4">
              <span className="kn-breaking-badge">
                <span className="kn-pulse-dot" />
                Breaking
              </span>
            </div>
          )}

          <h1 className="kn-headline">{article.title}</h1>
          {lede && <p className="kn-deck">{lede}</p>}

          {/* Byline */}
          <div
            className="flex flex-wrap items-center justify-between gap-4 pt-5"
            style={{ borderTop: "1px solid var(--rule)" }}
          >
            <div className="flex items-center gap-3">
              {/*
               * Author avatar
               * SkeletonImage handles the null/undefined case with the branded
               * Kurunzi placeholder — no need for a manual fallback here.
               */}
              <div
                className="relative w-11 h-11 rounded-full overflow-hidden shrink-0"
                style={{ border: "2px solid var(--rule)" }}
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
                  <span style={{ color: "var(--ink-faint)" }}>·</span>
                  <Clock size={11} />
                  <span>{rt} min read</span>
                  <span style={{ color: "var(--ink-faint)" }}>·</span>
                  <span>{ago}</span>
                </div>
              </div>
            </div>

            {/* Share + bookmark */}
            <div className="flex items-center gap-2">
              <div className="relative" ref={shareRef}>
                <button
                  onClick={() => setShareOpen((v) => !v)}
                  className="kn-action-btn"
                  style={{
                    background: shareOpen ? "var(--ink)" : "transparent",
                    color: shareOpen ? "#fff" : "var(--ink-soft)",
                    borderColor: shareOpen ? "var(--ink)" : "var(--rule)",
                  }}
                  aria-label="Share article"
                >
                  <Share2 size={14} />
                  <span>Share</span>
                </button>

                {shareOpen && (
                  <div className="kn-share-panel">
                    <p className="kn-share-title">Share this story</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        {
                          id: "twitter",
                          label: "X / Twitter",
                          bg: "#e7f3ff",
                          fg: "#1a8cd8",
                        },
                        {
                          id: "facebook",
                          label: "Facebook",
                          bg: "#eef1fb",
                          fg: "#1877f2",
                        },
                        {
                          id: "linkedin",
                          label: "LinkedIn",
                          bg: "#e8f3fa",
                          fg: "#0a66c2",
                        },
                        {
                          id: "copy",
                          label: copied ? "Copied!" : "Copy link",
                          bg: "var(--paper-warm)",
                          fg: "var(--ink-soft)",
                        },
                      ].map(({ id, label, bg, fg }) => (
                        <button
                          key={id}
                          onClick={() =>
                            handleShare(
                              id as
                                | "twitter"
                                | "facebook"
                                | "linkedin"
                                | "copy",
                            )
                          }
                          className="kn-share-chip"
                          style={{ background: bg, color: fg }}
                        >
                          {id === "twitter" && <Twitter size={13} />}
                          {id === "facebook" && <Facebook size={13} />}
                          {id === "linkedin" && <Linkedin size={13} />}
                          {id === "copy" &&
                            (copied ? <Check size={13} /> : <Copy size={13} />)}
                          <span>{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleBookmark}
                className="kn-action-btn"
                style={{
                  borderColor: bookmarked ? "var(--accent)" : "var(--rule)",
                  color: bookmarked ? "var(--accent)" : "var(--ink-soft)",
                }}
                aria-label={bookmarked ? "Remove bookmark" : "Save article"}
              >
                <Bookmark
                  size={14}
                  fill={bookmarked ? "currentColor" : "none"}
                />
                <span>{bookmarked ? "Saved" : "Save"}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero image ────────────────────────────────────────────────────── */}
      {/*
       * Always render — SkeletonImage shows the branded Kurunzi placeholder
       * when featuredImage is null, so the layout never collapses.
       */}
      <div className="max-w-[1140px] mx-auto px-6 pb-10">
        <figure>
          <div className="kn-hero-ratio">
            <SkeletonImage
              src={article.featuredImage?.node.sourceUrl}
              alt={article.featuredImage?.node.altText || article.title}
              caption={article.featuredImage?.node.caption} // From WP Caption field
              credit={article.featuredImage?.node.photoSource}
              className="kn-hero-ratio"
            />
          </div>
          {article.featuredImage?.node.altText && (
            <figcaption className="kn-figcaption">
              {article.featuredImage.node.altText}
            </figcaption>
          )}
        </figure>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          BODY + SIDEBAR
      ════════════════════════════════════════════════════════════════════ */}
      <div className="kn-body-grid max-w-[1140px] mx-auto px-6 pb-20">
        {/* Article body */}
        <main className="min-w-0">
          <div
            className="kn-wp-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {article.categories?.nodes.length > 0 && (
            <div
              className="mt-14 pt-6"
              style={{ borderTop: "1px solid var(--rule)" }}
            >
              <p
                className="mb-2.5"
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: ".18em",
                  textTransform: "uppercase",
                  color: "var(--ink-faint)",
                }}
              >
                Topics
              </p>
              <div className="flex flex-wrap gap-2">
                {article.categories.nodes.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/${cat.slug}`}
                    className="kn-tag-chip"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Sidebar */}
        <aside>
          <div className="sticky top-16 flex flex-col gap-6">
            {/* Latest */}
            <div className="kn-sidebar-card">
              <div
                className="flex items-center justify-between px-5 py-3.5"
                style={{
                  borderBottom: "1px solid var(--rule)",
                  background: "var(--paper-warm)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: ".2em",
                    textTransform: "uppercase",
                    color: "var(--ink-soft)",
                  }}
                >
                  Latest
                </span>
                <span className="kn-live-dot" />
              </div>

              <div>
                {latestPosts.map((post, i) => (
                  <ArticleLink
                    key={post.slug}
                    categorySlug={post.category}
                    slug={post.slug}
                    className="kn-latest-item"
                  >
                    <span className="kn-latest-num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <span className="kn-latest-cat">{post.category}</span>
                      <h4 className="kn-latest-headline">{post.title}</h4>
                    </div>
                  </ArticleLink>
                ))}
              </div>
            </div>

            {/* Related */}
            {relatedPosts.length > 0 && (
              <div className="kn-sidebar-card">
                <div
                  className="px-5 py-3.5"
                  style={{
                    borderBottom: "1px solid var(--rule)",
                    background: "var(--paper-warm)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: ".2em",
                      textTransform: "uppercase",
                      color: "var(--ink-soft)",
                    }}
                  >
                    Related
                  </span>
                </div>

                <div>
                  {relatedPosts.slice(0, 3).map((post) => (
                    <ArticleLink
                      key={post.slug}
                      categorySlug={post.category}
                      slug={post.slug}
                      className="kn-related-item"
                    >
                      {/*
                       * Related thumbnail
                       * The kn-related-thumb div is position:relative with fixed
                       * dimensions — SkeletonImage fills it via fill + object-cover,
                       * or shows the branded placeholder if no image is set.
                       */}
                      <div className="kn-related-thumb">
                        <SkeletonImage
                          src={post.featuredImage}
                          alt={post.title}
                          className="kn-related-img"
                        />
                      </div>
                      <div className="flex flex-col gap-1 min-w-0">
                        <h4 className="kn-related-headline">{post.title}</h4>
                        <span
                          style={{
                            fontFamily: "var(--font-ui)",
                            fontSize: 10,
                            color: "var(--ink-faint)",
                          }}
                        >
                          {new Date(post.date).toLocaleDateString("en-KE", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </ArticleLink>
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter CTA */}
            <div
              className="p-6 rounded-[4px]"
              style={{ background: "var(--ink)" }}
            >
              <p className="kn-newsletter-tag">Stay ahead</p>
              <h3 className="kn-newsletter-heading">
                Daily briefing, no noise.
              </h3>
              <p className="kn-newsletter-body">
                Curated stories from Kenya and the world, every morning.
              </p>
              <Link href="/subscribe" className="kn-newsletter-btn">
                Subscribe free →
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* ── Author bio footer ─────────────────────────────────────────────── */}
      {authorNode && (
        <footer
          className="px-6 py-14"
          style={{
            borderTop: "2px solid var(--ink)",
            background: "var(--paper-warm)",
          }}
        >
          <div className="max-w-[720px] mx-auto flex gap-6 items-start">
            {/*
             * Author avatar in footer — larger (72px), same SkeletonImage pattern.
             * The rounded-full on the wrapper clips the placeholder too.
             */}
            <div
              className="relative shrink-0 w-[72px] h-[72px] rounded-full overflow-hidden"
              style={{
                border: "3px solid white",
                boxShadow: "0 2px 8px rgba(0,0,0,.1)",
              }}
            >
              <SkeletonImage
                src={authorNode.avatar?.url}
                alt={authorNode.name}
                className="rounded-full"
              />
            </div>

            <div>
              <Link href={`/author/${authorNode.slug}`} className="kn-bio-name">
                {authorNode.name}
              </Link>
              {authorNode.description && (
                <p className="kn-bio-text">{authorNode.description}</p>
              )}
              <Link href={`/author/${authorNode.slug}`} className="kn-bio-link">
                More by {authorNode.name} →
              </Link>
            </div>
          </div>
        </footer>
      )}

      {/* ── Back to top ───────────────────────────────────────────────────── */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="kn-back-top"
          aria-label="Back to top"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </article>
  );
}
