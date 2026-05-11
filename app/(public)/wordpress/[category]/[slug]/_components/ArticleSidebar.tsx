import Link from "next/link";
import ArticleLink from "@/app/_components/wordpress/WPArticleLink";
import SkeletonImage from "@/app/_components/ui/SkeletonImage";
import { SportsPost } from "@/lib/wordpress/types";

interface Props {
  latestPosts: SportsPost[];
  relatedPosts: SportsPost[];
}

export default function ArticleSidebar({ latestPosts, relatedPosts }: Props) {
  return (
    <aside>
      <div className="sticky top-16 flex flex-col gap-6">
        {/* ── Latest ─────────────────────────────────────────────────────── */}
        <div className="kn-sidebar-card">
          <div
            className="flex items-center justify-between px-5 py-3.5"
            style={{
              borderBottom: "1px solid var(--color-rule)",
              background: "var(--color-paper-warm)",
            }}
          >
            <span className="font-[family-name:var(--font-ui)] text-[10px] font-bold tracking-[.2em] uppercase text-[var(--color-ink-soft)]">
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
                className="kn-latest-item group"
              >
                <span className="kn-latest-num group-hover:text-[var(--color-accent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <span className="kn-latest-cat">{post.category}</span>
                  <h4 className="kn-latest-headline group-hover:text-[var(--color-accent)]">
                    {post.title}
                  </h4>
                </div>
              </ArticleLink>
            ))}
          </div>
        </div>

        {/* ── Related ─────────────────────────────────────────────────────── */}
        {relatedPosts.length > 0 && (
          <div className="kn-sidebar-card">
            <div
              className="px-5 py-3.5"
              style={{
                borderBottom: "1px solid var(--color-rule)",
                background: "var(--color-paper-warm)",
              }}
            >
              <span className="font-[family-name:var(--font-ui)] text-[10px] font-bold tracking-[.2em] uppercase text-[var(--color-ink-soft)]">
                Related
              </span>
            </div>

            <div>
              {relatedPosts.slice(0, 3).map((post) => (
                <ArticleLink
                  key={post.slug}
                  categorySlug={post.category}
                  slug={post.slug}
                  className="kn-related-item group"
                >
                  <div className="kn-related-thumb">
                    <SkeletonImage
                      src={post.featuredImage}
                      alt={post.title}
                      className="kn-related-img group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <h4 className="kn-related-headline group-hover:text-[var(--color-accent)]">
                      {post.title}
                    </h4>
                    <span className="font-[family-name:var(--font-ui)] text-[10px] text-[var(--color-ink-faint)]">
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

        {/* ── Newsletter CTA ──────────────────────────────────────────────── */}
        <div
          className="p-6 rounded-[4px]"
          style={{ background: "var(--color-ink)" }}
        >
          <p className="kn-newsletter-tag">Stay ahead</p>
          <h3 className="kn-newsletter-heading">Daily briefing, no noise.</h3>
          <p className="kn-newsletter-body">
            Curated stories from Kenya and the world, every morning.
          </p>
          <Link href="/subscribe" className="kn-newsletter-btn">
            Subscribe free →
          </Link>
        </div>
      </div>
    </aside>
  );
}