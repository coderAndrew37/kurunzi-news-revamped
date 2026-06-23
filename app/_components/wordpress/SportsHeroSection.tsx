// app/_components/wordpress/SportsHeroSection.tsx
// BBC Sport-style asymmetrical hero grid.
// Left (2/3 on desktop): one massive anchor story — 16:9 image, oversized bold
// headline, short excerpt, category tag, byline + elapsed time.
// Right (1/3 on desktop): a tight vertical stack of secondary stories, each a
// small horizontal card (thumbnail left, text right).
//
// No carousel, no autoplay — BBC's hero is a static editorial pick that
// refreshes on each request/revalidation, not a slideshow. Live scores moved
// out into their own ribbon (WPLiveScoresRibbon) directly beneath this.
//
// Theme locked — red-600 / gray-900 / white palette is the north star.

import ArticleLink from "@/app/_components/wordpress/WPArticleLink";
import SkeletonImage from "@/app/_components/ui/SkeletonImage";
import { SportsPost } from "@/lib/wordpress/types";
import { selectHeroPosts } from "@/lib/wordpress/select-hero-posts";
import { getElapsedLabel } from "@/lib/utils/time";

interface Props {
  posts: SportsPost[];
}

function catSlug(post: SportsPost): string {
  return post.category?.toLowerCase().replace(/\s+/g, "-") ?? "news";
}

// ─── Secondary Card (thumbnail-left, BBC list-item pattern) ──────────────────

function SecondaryCard({ post }: { post: SportsPost }) {
  return (
    <ArticleLink
      categorySlug={catSlug(post)}
      slug={post.slug}
      className="group flex gap-3 py-4 border-b border-gray-200 last:border-0 last:pb-0"
    >
      <div className="relative shrink-0 w-24 sm:w-28 aspect-[4/3] overflow-hidden rounded bg-gray-100">
        <SkeletonImage
          src={post.featuredImage}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex-1 min-w-0">
        <span className="block text-[10px] font-bold uppercase tracking-widest text-red-600 mb-1">
          {post.category}
        </span>
        <h3 className="text-[14px] font-bold text-gray-900 leading-snug group-hover:text-red-600 transition-colors line-clamp-3">
          {post.title}
        </h3>
        <span className="block mt-1.5 text-[11px] font-medium text-gray-400">
          {getElapsedLabel(post.date)}
        </span>
      </div>
    </ArticleLink>
  );
}

// ─── Main Hero ────────────────────────────────────────────────────────────────

export default function SportsHero({ posts }: Props) {
  if (!posts.length) return null;

  const { main, secondary } = selectHeroPosts(posts);
  if (!main) return null;

  return (
    <section className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Anchor story (2/3) ──────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <ArticleLink categorySlug={catSlug(main)} slug={main.slug} className="group block">
              <div className="relative overflow-hidden rounded-lg aspect-video bg-gray-100">
                <SkeletonImage
                  src={main.featuredImage}
                  alt={main.title}
                  priority
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
                {main.newsData?.isBreaking && (
                  <span className="absolute top-4 left-4 bg-red-600 text-white text-[11px] font-bold px-3 py-1.5 uppercase tracking-wider">
                    Breaking
                  </span>
                )}
              </div>

              <div className="mt-4">
                <span className="block text-[11px] font-bold uppercase tracking-widest text-red-600 mb-2">
                  {main.category}
                </span>
                <h1 className="text-[28px] sm:text-[34px] lg:text-[40px] font-extrabold text-gray-900 leading-[1.05] tracking-tight group-hover:text-red-600 transition-colors">
                  {main.title}
                </h1>
                {main.newsData?.theLede && (
                  <p className="mt-3 text-[15px] sm:text-base text-gray-600 leading-relaxed line-clamp-2 max-w-2xl">
                    {main.newsData.theLede}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-2 text-[12px] font-medium text-gray-400">
                  <span>Kurunzi Reporter</span>
                  <span>·</span>
                  <span>{getElapsedLabel(main.date)}</span>
                </div>
              </div>
            </ArticleLink>
          </div>

          {/* ── Secondary stack (1/3) ───────────────────────────────────── */}
          {secondary.length > 0 && (
            <div className="lg:col-span-1 lg:border-l lg:border-gray-200 lg:pl-8">
              <h2 className="text-[13px] font-bold uppercase tracking-widest text-gray-900 mb-1 pb-3 border-b-2 border-red-600">
                More Top Stories
              </h2>
              <div className="flex flex-col">
                {secondary.map((post) => (
                  <SecondaryCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}