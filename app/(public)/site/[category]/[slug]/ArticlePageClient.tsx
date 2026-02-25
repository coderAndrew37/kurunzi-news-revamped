"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import CustomPortableText from "@/app/_components/PortableText";
import SanityImage from "@/app/_components/SanityImage";
import ArticleLink from "@/app/_components/ArticleLink";
import { ArticleDetail, Post } from "@/types";
import Link from "next/link";
import {
  Calendar,
  Clock,
  User,
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

interface ArticlePageClientProps {
  article: ArticleDetail & {
    mainImageUrl: string;
    authorImageUrl: string | null;
  };
  latestArticles: Post[];
  relatedArticles: Post[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function calcReadingTime(body: any) {
  return Math.max(1, Math.ceil(JSON.stringify(body).split(/\s+/).length / 200));
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

export default function ArticlePageClient({
  article,
  latestArticles,
  relatedArticles,
}: ArticlePageClientProps) {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  const pub = new Date(article.publishedAt);
  const date = pub.toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const rt = calcReadingTime(article.body);
  const ago = getTimeAgo(pub);

  // Reading progress + back-to-top
  useEffect(() => {
    const fn = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(Math.min(100, (window.scrollY / h) * 100));
      setShowTop(window.scrollY > 800);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close share on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node))
        setShareOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
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
          ? [...saved, article._id]
          : saved.filter((id) => id !== article._id),
      ),
    );
  };

  const handleShare = (p: "twitter" | "facebook" | "linkedin" | "copy") => {
    const url = window.location.href;
    const maps: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };
    if (p === "copy") {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      window.open(maps[p], "_blank", "noopener");
    }
    setShareOpen(false);
  };

  return (
    <>
      {/* ── Google Fonts ─────────────────────────────────────────────────────── */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&family=Barlow+Condensed:wght@500;600;700&display=swap"
        rel="stylesheet"
      />

      <article
        className="min-h-screen"
        style={{ background: "var(--paper)", color: "var(--ink)" }}
      >
        {/* ── Reading progress ──────────────────────────────────────────────── */}
        <div
          className="fixed top-0 left-0 right-0 z-[100] h-[3px]"
          style={{ background: "var(--rule)" }}
        >
          <div
            className="h-full transition-[width] duration-100"
            style={{ width: `${progress}%`, background: "var(--red)" }}
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
              className="flex items-center gap-1 transition-colors"
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
            <div className="w-px h-3.5" style={{ background: "var(--rule)" }} />
            <Link
              href={`/${article.categorySlug}`}
              className="transition-colors"
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: "var(--red)",
              }}
            >
              {article.categoryTitle}
            </Link>
          </div>
        </nav>

        {/* ═════════════════════════════════════════════════════════════════════
            ARTICLE HEADER
        ═════════════════════════════════════════════════════════════════════ */}
        <header className="max-w-[1140px] mx-auto px-6 pt-12 pb-8">
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            {/* Kicker */}
            <Link
              href={`/${article.categorySlug}`}
              className="inline-block mb-4 pb-2 transition-colors kicker-link"
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: ".18em",
                textTransform: "uppercase",
                color: "var(--red)",
                borderBottom: "2px solid var(--red)",
                textDecoration: "none",
              }}
            >
              {article.categoryTitle}
            </Link>

            {/* Breaking flag */}
            {article.isBreaking && (
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-white"
                  style={{
                    background: "var(--red)",
                    fontFamily: "var(--font-ui)",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                    borderRadius: 2,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Breaking
                </span>
              </div>
            )}

            {/* Headline */}
            <h1
              className="mb-5 article-headline"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: "-.025em",
                color: "var(--ink)",
              }}
            >
              {article.title}
            </h1>

            {/* Deck */}
            {article.excerpt && (
              <p
                className="mb-7 pl-4 article-deck"
                style={{
                  fontFamily: "var(--font-body)",
                  fontStyle: "italic",
                  color: "var(--ink-soft)",
                  lineHeight: 1.6,
                  borderLeft: "3px solid var(--rule)",
                }}
              >
                {article.excerpt}
              </p>
            )}

            {/* Byline */}
            <div
              className="flex flex-wrap items-center justify-between gap-4 pt-5"
              style={{ borderTop: "1px solid var(--rule)" }}
            >
              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="relative w-11 h-11 rounded-full overflow-hidden flex items-center justify-center shrink-0"
                  style={{
                    background: "var(--paper-warm)",
                    border: "2px solid var(--rule)",
                  }}
                >
                  {article.authorImageUrl ? (
                    <SanityImage
                      asset={article.authorImageUrl}
                      alt={article.authorName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User size={18} style={{ color: "var(--ink-faint)" }} />
                  )}
                </div>
                <div>
                  <Link
                    href={`/k/author/${article.authorSlug}`}
                    className="block transition-colors byline-author"
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--ink)",
                      textDecoration: "none",
                    }}
                  >
                    {article.authorName}
                  </Link>
                  <div
                    className="flex items-center gap-1.5 mt-0.5"
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: 11,
                      color: "var(--ink-muted)",
                    }}
                  >
                    <Calendar size={11} />
                    <span>{date}</span>
                    <span style={{ color: "var(--ink-faint)" }}>·</span>
                    <Clock size={11} />
                    <span>{rt} min read</span>
                    <span style={{ color: "var(--ink-faint)" }}>·</span>
                    <span>{ago}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* Share */}
                <div className="relative" ref={shareRef}>
                  <button
                    onClick={() => setShareOpen((v) => !v)}
                    className="action-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all"
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      border: "1px solid var(--rule)",
                      background: shareOpen ? "var(--ink)" : "transparent",
                      color: shareOpen ? "white" : "var(--ink-soft)",
                      cursor: "pointer",
                    }}
                    aria-label="Share"
                  >
                    <Share2 size={14} />
                    <span>Share</span>
                  </button>
                  {shareOpen && (
                    <div
                      className="absolute right-0 z-50 mt-2 p-4 share-panel"
                      style={{
                        width: 230,
                        background: "white",
                        border: "1px solid var(--rule)",
                        borderRadius: 14,
                        boxShadow: "0 12px 40px rgba(0,0,0,.12)",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "var(--font-ui)",
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: ".18em",
                          textTransform: "uppercase",
                          color: "var(--ink-faint)",
                          marginBottom: 10,
                        }}
                      >
                        Share this story
                      </p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          {
                            id: "twitter",
                            label: "X / Twitter",
                            bg: "#e7f3ff",
                            fg: "#1a8cd8",
                            hbg: "#1a8cd8",
                          },
                          {
                            id: "facebook",
                            label: "Facebook",
                            bg: "#eef1fb",
                            fg: "#1877f2",
                            hbg: "#1877f2",
                          },
                          {
                            id: "linkedin",
                            label: "LinkedIn",
                            bg: "#e8f3fa",
                            fg: "#0a66c2",
                            hbg: "#0a66c2",
                          },
                          {
                            id: "copy",
                            label: copied ? "Copied!" : "Copy",
                            bg: "var(--paper-warm)",
                            fg: "var(--ink-soft)",
                            hbg: "var(--ink)",
                          },
                        ].map(({ id, label, bg, fg }) => (
                          <button
                            key={id}
                            onClick={() => handleShare(id as any)}
                            className="share-chip flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all"
                            style={{
                              background: bg,
                              color: fg,
                              fontFamily: "var(--font-ui)",
                              fontSize: 11,
                              fontWeight: 700,
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            {id === "twitter" && <Twitter size={13} />}
                            {id === "facebook" && <Facebook size={13} />}
                            {id === "linkedin" && <Linkedin size={13} />}
                            {id === "copy" &&
                              (copied ? (
                                <Check size={13} />
                              ) : (
                                <Copy size={13} />
                              ))}
                            <span>{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bookmark */}
                <button
                  onClick={handleBookmark}
                  className="action-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all"
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    border: bookmarked
                      ? "1px solid var(--red)"
                      : "1px solid var(--rule)",
                    color: bookmarked ? "var(--red)" : "var(--ink-soft)",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                  aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
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
        <div className="max-w-[1140px] mx-auto px-6 pb-10">
          <figure>
            {/* 21:9 on desktop, 16:9 on mobile */}
            <div
              className="relative w-full overflow-hidden hero-ratio"
              style={{ background: "var(--paper-warm)", borderRadius: 4 }}
            >
              <SanityImage
                asset={article.mainImageUrl}
                alt={article.title}
                fill
                priority
                className="object-cover"
              />
            </div>
            {(article.mainImageCaption || article.mainImageSource) && (
              <figcaption
                className="mt-2.5 pl-3"
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 11,
                  color: "var(--ink-muted)",
                  borderLeft: "2px solid var(--red)",
                  letterSpacing: ".03em",
                }}
              >
                {article.mainImageCaption}
                {article.mainImageSource && (
                  <cite
                    style={{
                      fontStyle: "normal",
                      fontWeight: 700,
                      color: "var(--ink-faint)",
                    }}
                  >
                    {" "}
                    — {article.mainImageSource}
                  </cite>
                )}
              </figcaption>
            )}
          </figure>
        </div>

        {/* ═════════════════════════════════════════════════════════════════════
            BODY + SIDEBAR (newspaper column grid)
        ═════════════════════════════════════════════════════════════════════ */}
        <div className="max-w-[1140px] mx-auto px-6 pb-20 body-grid">
          {/* ── Article body ─────────────────────────────────────────────── */}
          <main className="min-w-0">
            <CustomPortableText value={article.body} />

            {/* Tags */}
            {article.tags && article.tags?.length > 0 && (
              <div
                className="mt-14 pt-6"
                style={{ borderTop: "1px solid var(--rule)" }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                    color: "var(--ink-faint)",
                    marginBottom: 10,
                  }}
                >
                  Topics
                </p>
                <div className="flex flex-wrap gap-2">
                  {article.tags?.map((tag: { title: string; slug: string }) => (
                    <Link
                      key={tag.slug}
                      href={`/topic/${tag.slug}`}
                      className="tag-chip px-3.5 py-1.5 rounded-full transition-all"
                      style={{
                        fontFamily: "var(--font-ui)",
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: ".04em",
                        color: "var(--ink-soft)",
                        background: "var(--paper-warm)",
                        border: "1px solid var(--rule)",
                        textDecoration: "none",
                      }}
                    >
                      #{tag.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          <aside>
            <div className="sidebar-sticky flex flex-col gap-6">
              {/* Latest */}
              <div
                className="sidebar-card"
                style={{
                  border: "1px solid var(--rule)",
                  borderRadius: 4,
                  background: "white",
                }}
              >
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
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: "var(--red)",
                      boxShadow: "0 0 6px rgba(200,25,30,.6)",
                      animation: "kn-pulse 2s ease-in-out infinite",
                    }}
                  />
                </div>
                <div>
                  {latestArticles.map((post, i) => (
                    <ArticleLink
                      key={post._id}
                      categorySlug={post.category ?? ""}
                      slug={post.slug}
                      className="latest-item flex items-start gap-3 px-5 py-3.5 border-b border-[var(--rule)]"
                    >
                      <span
                        className="latest-num shrink-0 mt-0.5"
                        style={{
                          fontFamily: "var(--font-ui)",
                          fontSize: 20,
                          fontWeight: 700,
                          lineHeight: 1,
                          color: "var(--rule)",
                          minWidth: 22,
                          transition: "color .15s",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <span
                          className="block mb-1"
                          style={{
                            fontFamily: "var(--font-ui)",
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: ".16em",
                            textTransform: "uppercase",
                            color: "var(--red)",
                          }}
                        >
                          {post.category}
                        </span>
                        <h4
                          className="latest-headline"
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 13,
                            fontWeight: 700,
                            lineHeight: 1.35,
                            color: "var(--ink)",
                            margin: 0,
                            transition: "color .15s",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {post.title}
                        </h4>
                      </div>
                    </ArticleLink>
                  ))}
                </div>
              </div>

              {/* Related */}
              {relatedArticles.length > 0 && (
                <div
                  className="sidebar-card"
                  style={{
                    border: "1px solid var(--rule)",
                    borderRadius: 4,
                    background: "white",
                  }}
                >
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
                    {relatedArticles.slice(0, 3).map((post) => (
                      <ArticleLink
                        key={post._id}
                        categorySlug={post.category ?? ""}
                        slug={post.slug}
                        className="related-item flex gap-3 px-5 py-3.5"
                      >
                        <div
                          className="relative shrink-0 overflow-hidden"
                          style={{
                            width: 72,
                            height: 56,
                            borderRadius: 4,
                            background: "var(--paper-warm)",
                          }}
                        >
                          <SanityImage
                            asset={post.mainImage}
                            alt={post.title}
                            fill
                            className="object-cover related-thumb-img"
                          />
                        </div>
                        <div className="flex flex-col gap-1 min-w-0">
                          <h4
                            className="related-headline"
                            style={{
                              fontFamily: "var(--font-display)",
                              fontSize: 12,
                              fontWeight: 700,
                              lineHeight: 1.35,
                              color: "var(--ink)",
                              margin: 0,
                              transition: "color .15s",
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {post.title}
                          </h4>
                          <span
                            style={{
                              fontFamily: "var(--font-ui)",
                              fontSize: 10,
                              color: "var(--ink-faint)",
                              letterSpacing: ".04em",
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

              {/* Newsletter */}
              <div
                className="p-6"
                style={{ background: "var(--ink)", borderRadius: 4 }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: ".2em",
                    textTransform: "uppercase",
                    color: "var(--red)",
                    marginBottom: 6,
                  }}
                >
                  Stay ahead
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    color: "#fdfcfb",
                    lineHeight: 1.2,
                    marginBottom: 8,
                  }}
                >
                  Daily briefing, no noise.
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "rgba(253,252,251,.6)",
                    lineHeight: 1.5,
                    marginBottom: 16,
                  }}
                >
                  Curated stories from Kenya and the world, every morning.
                </p>
                <Link
                  href="/subscribe"
                  className="block text-center py-2.5 rounded transition-colors newsletter-btn"
                  style={{
                    background: "var(--red)",
                    color: "white",
                    fontFamily: "var(--font-ui)",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                  }}
                >
                  Subscribe free →
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* ── Author bio ────────────────────────────────────────────────────── */}
        <footer
          className="px-6 py-14"
          style={{
            borderTop: "2px solid var(--ink)",
            background: "var(--paper-warm)",
          }}
        >
          <div className="max-w-180 mx-auto flex gap-6 items-start">
            <div
              className="relative shrink-0 rounded-full overflow-hidden flex items-center justify-center"
              style={{
                width: 72,
                height: 72,
                background: "var(--rule)",
                border: "3px solid white",
                boxShadow: "0 2px 8px rgba(0,0,0,.1)",
              }}
            >
              {article.authorImageUrl ? (
                <SanityImage
                  asset={article.authorImageUrl}
                  alt={article.authorName}
                  fill
                  className="object-cover"
                />
              ) : (
                <User size={28} style={{ color: "var(--ink-faint)" }} />
              )}
            </div>
            <div>
              <Link
                href={`/k/author/${article.authorSlug}`}
                className="block mb-1.5 transition-colors bio-author"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  color: "var(--ink)",
                  textDecoration: "none",
                }}
              >
                {article.authorName}
              </Link>
              {article.authorBio && (
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    lineHeight: 1.65,
                    color: "var(--ink-soft)",
                    marginBottom: 12,
                  }}
                >
                  {article.authorBio}
                </p>
              )}
              <Link
                href={`/k/author/${article.authorSlug}`}
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: "var(--red)",
                  textDecoration: "none",
                }}
              >
                More by {article.authorName} →
              </Link>
            </div>
          </div>
        </footer>

        {/* ── Back to top ───────────────────────────────────────────────────── */}
        {showTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 z-40 w-11 h-11 rounded-full flex items-center justify-center transition-all back-top-btn"
            style={{
              background: "var(--ink)",
              color: "white",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(0,0,0,.2)",
            }}
            aria-label="Back to top"
          >
            <ArrowUp size={18} />
          </button>
        )}
      </article>

      {/* ════════════════════════════════════════════════════════════════════════
          SCOPED STYLES — only for things Tailwind cannot express:
          CSS custom properties, custom fonts, drop-cap, counter resets,
          :hover on parent affecting child, complex pseudo-elements
      ════════════════════════════════════════════════════════════════════════ */}
      <style>{`
        /* ── Design tokens ── */
        :root {
          --ink:        #0d0d0d;
          --ink-soft:   #3d3935;
          --ink-muted:  #7a736c;
          --ink-faint:  #b5aea7;
          --paper:      #fdfcfb;
          --paper-warm: #f7f4f0;
          --rule:       #e8e2da;
          --red:        #c8191e;
          --red-dark:   #a01318;
          --font-display: 'Playfair Display', Georgia, serif;
          --font-body:    'Source Serif 4', Georgia, serif;
          --font-ui:      'Barlow Condensed', system-ui, sans-serif;
        }

        /* ── Article container ── */
        .article-container {
          min-height: 100vh;
          background: var(--paper);
          color: var(--ink);
        }

        /* ── Reading progress bar ── */
        .reading-progress-bg {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          height: 3px;
          background: var(--rule);
        }
        .reading-progress-fill {
          height: 100%;
          transition: width 100ms;
          background: var(--red);
        }

        /* ── Sticky nav ── */
        .sticky-nav {
          position: sticky;
          top: 0;
          z-index: 40;
          border-bottom: 1px solid var(--rule);
          background: var(--paper);
        }
        .nav-container {
          max-width: 1140px;
          margin: 0 auto;
          padding: 0 24px;
          height: 48px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .nav-divider {
          width: 1px;
          height: 14px;
          background: var(--rule);
        }
        .back-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          transition: color 0.2s;
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-muted);
          background: none;
          border: none;
          cursor: pointer;
        }
        .category-link {
          transition: color 0.2s;
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--red);
          text-decoration: none;
        }

        /* ── Header ── */
        .article-header {
          max-width: 1140px;
          margin: 0 auto;
          padding: 48px 24px 32px;
        }
        .header-inner {
          max-width: 720px;
          margin: 0 auto;
        }

        /* ── Kicker ── */
        .kicker-link {
          display: inline-block;
          margin-bottom: 16px;
          padding-bottom: 8px;
          transition: color 0.2s;
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--red);
          border-bottom: 2px solid var(--red);
          text-decoration: none;
        }

        /* ── Breaking flag ── */
        .breaking-flag {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }
        .breaking-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: var(--red);
          color: white;
          font-family: var(--font-ui);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          border-radius: 2px;
        }
        .pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: white;
          animation: kn-pulse 2s ease-in-out infinite;
        }

        /* ── Headline responsive sizing ── */
        .article-headline {
          margin-bottom: 20px;
          font-size: clamp(1.85rem, 4.5vw, 3rem);
          font-family: var(--font-display);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -0.025em;
          color: var(--ink);
        }

        /* ── Deck ── */
        .article-deck {
          margin-bottom: 28px;
          padding-left: 16px;
          font-family: var(--font-body);
          font-size: clamp(1rem, 2vw, 1.2rem);
          font-style: italic;
          color: var(--ink-soft);
          line-height: 1.6;
          border-left: 3px solid var(--rule);
        }

        /* ── Byline ── */
        .byline {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding-top: 20px;
          border-top: 1px solid var(--rule);
        }
        .author-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .author-avatar {
          position: relative;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: var(--paper-warm);
          border: 2px solid var(--rule);
        }
        .author-info {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .byline-author {
          display: block;
          transition: color 0.2s;
          font-family: var(--font-ui);
          font-size: 13px;
          font-weight: 700;
          color: var(--ink);
          text-decoration: none;
        }
        .meta-info {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 4px;
          font-family: var(--font-ui);
          font-size: 11px;
          color: var(--ink-muted);
        }
        .meta-dot {
          color: var(--ink-faint);
        }

        /* ── Actions ── */
        .actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 9999px;
          transition: all 0.2s;
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: transparent;
          border: 1px solid var(--rule);
          color: var(--ink-soft);
          cursor: pointer;
        }
        .action-btn:hover {
          border-color: var(--ink) !important;
          color: var(--ink) !important;
        }
        .share-btn-active {
          background: var(--ink);
          color: white;
        }
        .bookmark-btn-active {
          border-color: var(--red);
          color: var(--red);
        }

        /* ── Share panel ── */
        .share-panel {
          position: absolute;
          right: 0;
          z-index: 50;
          margin-top: 8px;
          padding: 16px;
          width: 230px;
          background: white;
          border: 1px solid var(--rule);
          border-radius: 14px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.12);
        }
        .share-title {
          font-family: var(--font-ui);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin-bottom: 10px;
        }
        .share-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 6px;
        }
        .share-chip {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 8px;
          border-radius: 8px;
          transition: all 0.2s;
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 700;
          border: none;
          cursor: pointer;
        }
        .share-chip:hover {
          filter: brightness(1.1);
        }
        .share-twitter {
          background: #e7f3ff;
          color: #1a8cd8;
        }
        .share-facebook {
          background: #eef1fb;
          color: #1877f2;
        }
        .share-linkedin {
          background: #e8f3fa;
          color: #0a66c2;
        }
        .share-copy {
          background: var(--paper-warm);
          color: var(--ink-soft);
        }

        /* ── Hero ratio ── */
        .hero-wrapper {
          max-width: 1140px;
          margin: 0 auto;
          padding: 0 24px 40px;
        }
        .hero-ratio {
          aspect-ratio: 16/9;
          position: relative;
          width: 100%;
          overflow: hidden;
          background: var(--paper-warm);
          border-radius: 4px;
        }
        @media (min-width: 1024px) {
          .hero-ratio {
            aspect-ratio: 21/9;
          }
        }
        .figcaption {
          margin-top: 10px;
          padding-left: 12px;
          font-family: var(--font-ui);
          font-size: 11px;
          color: var(--ink-muted);
          border-left: 2px solid var(--red);
          letter-spacing: 0.03em;
        }
        .figcaption-source {
          font-style: normal;
          font-weight: 700;
          color: var(--ink-faint);
        }

        /* ── Body + sidebar layout ── */
        .body-grid {
          max-width: 1140px;
          margin: 0 auto;
          padding: 0 24px 80px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          align-items: start;
        }
        @media (min-width: 1024px) {
          .body-grid {
            grid-template-columns: minmax(0, 700px) 300px;
            gap: 64px;
          }
          .body-grid > aside {
            border-left: 1px solid var(--rule);
            padding-left: 40px;
          }
        }

        /* ── Body ── */
        .article-body {
          min-width: 0;
        }

        /* ── Tags section ── */
        .tags-section {
          margin-top: 56px;
          padding-top: 24px;
          border-top: 1px solid var(--rule);
        }
        .tags-title {
          font-family: var(--font-ui);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin-bottom: 10px;
        }
        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .tag-chip {
          padding: 6px 14px;
          border-radius: 9999px;
          transition: all 0.2s;
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: var(--ink-soft);
          background: var(--paper-warm);
          border: 1px solid var(--rule);
          text-decoration: none;
          display: inline-block;
        }
        .tag-chip:hover {
          background: var(--red) !important;
          color: white !important;
          border-color: var(--red) !important;
        }

        /* ── Sidebar ── */
        .sidebar-sticky {
          position: sticky;
          top: 64px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* ── Sidebar cards ── */
        .sidebar-card {
          border: 1px solid var(--rule);
          border-radius: 4px;
          background: white;
          overflow: hidden;
        }
        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          border-bottom: 1px solid var(--rule);
          background: var(--paper-warm);
        }
        .sidebar-title {
          font-family: var(--font-ui);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ink-soft);
        }
        .live-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--red);
          box-shadow: 0 0 6px rgba(200, 25, 30, 0.6);
          animation: kn-pulse 2s ease-in-out infinite;
        }
        .sidebar-card > div > a:last-child,
        .sidebar-card > div > div:last-child {
          border-bottom: none !important;
        }

        /* ── Latest items ── */
        .latest-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 20px;
          border-bottom: 1px solid var(--rule);
          text-decoration: none;
          flex: 1;
        }
        .latest-num {
          flex-shrink: 0;
          margin-top: 4px;
          font-family: var(--font-ui);
          font-size: 20px;
          font-weight: 700;
          line-height: 1;
          color: var(--rule);
          min-width: 22px;
          transition: color 0.15s;
        }
        .latest-item:hover .latest-num {
          color: var(--red) !important;
        }
        .latest-headline {
          display: block;
          margin-bottom: 4px;
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 700;
          line-height: 1.35;
          color: var(--ink);
          margin: 0;
          transition: color 0.15s;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .latest-item:hover .latest-headline {
          color: var(--red) !important;
        }
        .latest-category {
          display: block;
          margin-bottom: 4px;
          font-family: var(--font-ui);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--red);
        }

        /* ── Related items ── */
        .related-item {
          display: flex;
          gap: 12px;
          padding: 14px 20px;
          border-bottom: 1px solid var(--rule);
          text-decoration: none;
        }
        .related-thumb {
          position: relative;
          flex-shrink: 0;
          width: 72px;
          height: 56px;
          border-radius: 4px;
          background: var(--paper-warm);
          overflow: hidden;
        }
        .related-thumb-img {
          transition: transform 0.3s;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .related-item:hover .related-thumb-img {
          transform: scale(1.06);
        }
        .related-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }
        .related-headline {
          font-family: var(--font-display);
          font-size: 12px;
          font-weight: 700;
          line-height: 1.35;
          color: var(--ink);
          margin: 0;
          transition: color 0.15s;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .related-item:hover .related-headline {
          color: var(--red) !important;
        }
        .related-date {
          font-family: var(--font-ui);
          font-size: 10px;
          color: var(--ink-faint);
          letter-spacing: 0.04em;
        }

        /* ── Newsletter ── */
        .newsletter-box {
          padding: 24px;
          background: var(--ink);
          border-radius: 4px;
        }
        .newsletter-tag {
          font-family: var(--font-ui);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--red);
          margin-bottom: 6px;
        }
        .newsletter-heading {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 700;
          color: #fdfcfb;
          line-height: 1.2;
          margin-bottom: 8px;
        }
        .newsletter-text {
          font-family: var(--font-body);
          font-size: 13px;
          color: rgba(253, 252, 251, 0.6);
          line-height: 1.5;
          margin-bottom: 16px;
        }
        .newsletter-btn {
          display: block;
          text-align: center;
          padding: 10px 0;
          border-radius: 4px;
          transition: background-color 0.2s;
          background: var(--red);
          color: white;
          font-family: var(--font-ui);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
        }
        .newsletter-btn:hover {
          background: var(--red-dark) !important;
        }

        /* ── Author bio footer ── */
        .author-bio {
          padding: 56px 24px;
          border-top: 2px solid var(--ink);
          background: var(--paper-warm);
        }
        .bio-container {
          max-width: 720px;
          margin: 0 auto;
          display: flex;
          gap: 24px;
          align-items: flex-start;
        }
        .bio-avatar {
          position: relative;
          flex-shrink: 0;
          width: 72px;
          height: 72px;
          border-radius: 50%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--rule);
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .bio-content {
          flex: 1;
        }
        .bio-author {
          display: block;
          margin-bottom: 6px;
          transition: color 0.2s;
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--ink);
          text-decoration: none;
        }
        .bio-author:hover {
          color: var(--red) !important;
        }
        .bio-text {
          font-family: var(--font-body);
          font-size: 14px;
          line-height: 1.65;
          color: var(--ink-soft);
          margin-bottom: 12px;
        }
        .bio-link {
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--red);
          text-decoration: none;
        }

        /* ── Back to top ── */
        .back-top-btn {
          position: fixed;
          bottom: 32px;
          right: 32px;
          z-index: 40;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          background: var(--ink);
          color: white;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }
        .back-top-btn:hover {
          background: var(--red) !important;
          transform: translateY(-2px);
        }

        /* ── Keyframes ── */
        @keyframes kn-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        /* ── Mobile adjustments ── */
        @media (max-width: 640px) {
          .article-headline {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </>
  );
}
