import { Calendar, ArrowRight } from "lucide-react";
import { SportsPost } from "@/lib/wordpress/wp-api";
import Link from "next/link";
import SkeletonImage from "../ui/SkeletonImage";
import ArticleLink from "./WPArticleLink";

interface HeroSectionProps {
  hero: SportsPost;
  latestPosts: SportsPost[];
  priority?: boolean;
}

export default function HeroSection({
  hero,
  latestPosts,
  priority = true,
}: HeroSectionProps) {
  if (!hero) return null;

  const formattedDate = new Date(hero.date).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const sidebarPosts = latestPosts
    .filter((p) => p.slug !== hero.slug)
    .slice(0, 5);

  return (
    <section
      className="py-12 lg:py-16 border-b"
      style={{ background: "var(--paper)", borderColor: "var(--rule)" }}
    >
      <div className="max-w-[1140px] mx-auto px-6">
        {/* ── Section header ─────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between mb-10 pb-4"
          style={{ borderBottom: "2px solid var(--ink)" }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-1.5 h-8"
              style={{ background: "var(--accent)" }}
            />
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.75rem",
                fontWeight: 900,
                letterSpacing: "-0.02em",
                color: "var(--ink)",
              }}
            >
              Top Story
            </h2>
          </div>

          <Link
            href={`/${hero.category?.toLowerCase()}`}
            className="hidden lg:flex items-center gap-2 group"
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent)",
              textDecoration: "none",
            }}
          >
            All {hero.category}
            <ArrowRight
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* ── Main grid ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Hero story — 8 cols */}
          <div className="lg:col-span-8">
            <ArticleLink
              categorySlug={hero.category}
              slug={hero.slug}
              className="group block"
            >
              {/* Image
                  SportsPost.featuredImage is already a flat string | null
                  from the getSportsPosts() mapper in wp-api.ts — pass it directly */}
              <div
                className="relative w-full overflow-hidden mb-6"
                style={{
                  aspectRatio: "16/9",
                  background: "var(--paper-warm)",
                  borderRadius: 4,
                }}
              >
                <SkeletonImage
                  src={hero.featuredImage}
                  alt={hero.title}
                  priority={priority}
                  className="transition-transform duration-700 group-hover:scale-[1.03]"
                />

                {hero.category && (
                  <div className="absolute top-4 left-4">
                    <span
                      className="kn-breaking-badge"
                      style={{ background: "var(--accent)" }}
                    >
                      {hero.newsData?.isBreaking && (
                        <span className="kn-pulse-dot" />
                      )}
                      {hero.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Headline + lede */}
              <div className="space-y-4">
                <h3
                  className="group-hover:opacity-80 transition-opacity"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                    lineHeight: 1.12,
                    letterSpacing: "-0.025em",
                    color: "var(--ink)",
                  }}
                >
                  {hero.title}
                </h3>

                {hero.newsData?.theLede && (
                  <p
                    className="line-clamp-3"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "1.0625rem",
                      fontStyle: "italic",
                      color: "var(--ink-soft)",
                      lineHeight: 1.65,
                    }}
                  >
                    {hero.newsData.theLede}
                  </p>
                )}

                <div
                  className="flex items-center gap-4 pt-4"
                  style={{ borderTop: "1px solid var(--rule)" }}
                >
                  <div className="flex items-center gap-2">
                    <Calendar size={12} style={{ color: "var(--accent)" }} />
                    <span
                      style={{
                        fontFamily: "var(--font-ui)",
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "var(--ink-muted)",
                      }}
                    >
                      {formattedDate}
                    </span>
                  </div>

                  <span
                    className="ml-auto inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all"
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--accent)",
                    }}
                  >
                    Read story
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </ArticleLink>
          </div>

          {/* Latest sidebar — 4 cols */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-20">
              <div
                className="flex items-center justify-between pb-4 mb-1"
                style={{ borderBottom: "1px solid var(--rule)" }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--ink-soft)",
                  }}
                >
                  Latest
                </span>
                <span className="kn-live-dot" />
              </div>

              <div>
                {sidebarPosts.map((post, i) => (
                  <ArticleLink
                    key={post.slug}
                    categorySlug={post.category}
                    slug={post.slug}
                    className="kn-latest-item"
                  >
                    <span className="kn-latest-num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <span className="kn-latest-cat">{post.category}</span>
                      <h4 className="kn-latest-headline">{post.title}</h4>
                      <span
                        className="block mt-1"
                        style={{
                          fontFamily: "var(--font-ui)",
                          fontSize: 10,
                          color: "var(--ink-faint)",
                          letterSpacing: "0.04em",
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

              <div
                className="mt-5 pt-5"
                style={{ borderTop: "1px solid var(--rule)" }}
              >
                <Link
                  href={`/${hero.category?.toLowerCase()}`}
                  className="kn-newsletter-btn"
                  style={{ background: "var(--ink)" }}
                >
                  View all {hero.category} stories
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile view all */}
        <div
          className="mt-10 pt-8 lg:hidden"
          style={{ borderTop: "1px solid var(--rule)" }}
        >
          <Link
            href={`/${hero.category?.toLowerCase()}`}
            className="flex items-center justify-center gap-2 group"
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent)",
              textDecoration: "none",
            }}
          >
            All {hero.category} stories
            <ArrowRight
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
