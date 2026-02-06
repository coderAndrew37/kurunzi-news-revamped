import SanityImage from "@/app/_components/SanityImage";
import ArticleLink from "@/app/_components/ArticleLink";
import { NewsCardProps } from "@/types";
import Link from "next/link";

interface NewsSectionProps {
  title: string;
  slug: string; // Passed from the parent query
  posts: NewsCardProps[];
}

export default function NewsSection({ title, slug, posts }: NewsSectionProps) {
  if (!posts || posts.length === 0) return null;

  const mainPost = posts[0];
  const subFeatures = posts.slice(1, 3);
  const sidebarPosts = posts.slice(3, 8);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 border-b border-slate-100 last:border-0">
      {/* Section Header with People Daily Style Accent */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4 flex-1">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">
            {title}
          </h2>
          <div className="h-[4px] flex-1 bg-pd-red max-w-[100px]" />
        </div>
        <Link
          href={`/${slug || mainPost.category || "#"}`}
          className="hidden md:block text-xs font-black uppercase tracking-widest text-slate-400 hover:text-pd-red transition-colors"
        >
          See All {title} →
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT CONTENT AREA (8 Columns) */}
        <div className="lg:col-span-8 space-y-10">
          {/* PRIMARY HERO STORY */}
          <ArticleLink
            categorySlug={mainPost.category}
            slug={mainPost.slug}
            className="group block"
          >
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
              <SanityImage
                asset={mainPost.image}
                alt={mainPost.title}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-pd-red text-white text-[10px] font-black px-3 py-1.5 rounded-sm uppercase tracking-widest shadow-xl">
                  {mainPost.category}
                </span>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <h3 className="text-3xl md:text-4xl font-black leading-[1.1] text-slate-900 group-hover:text-pd-red transition-colors">
                {mainPost.title}
              </h3>
              {mainPost.excerpt && (
                <p className="text-slate-600 line-clamp-3 font-serif text-lg leading-relaxed">
                  {mainPost.excerpt}
                </p>
              )}
            </div>
          </ArticleLink>

          {/* SUB-FEATURE GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
            {subFeatures.map((post) => (
              <ArticleLink
                key={post.slug}
                categorySlug={post.category}
                slug={post.slug}
                className="group"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-4 bg-slate-100">
                  <SanityImage
                    asset={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h4 className="text-xl font-bold leading-snug group-hover:text-pd-red transition-colors line-clamp-2">
                  {post.title}
                </h4>
              </ArticleLink>
            ))}
          </div>
        </div>

        {/* RIGHT SIDEBAR (4 Columns) */}
        <aside className="lg:col-span-4">
          <div className="bg-slate-50 rounded-2xl p-6 lg:sticky lg:top-24">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-6 border-b pb-2">
              Don't Miss
            </h4>
            <div className="flex flex-col gap-6">
              {sidebarPosts.map((post, idx) => (
                <ArticleLink
                  key={post.slug}
                  categorySlug={post.category}
                  slug={post.slug}
                  className="flex gap-4 group"
                >
                  <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-200">
                    <SanityImage
                      asset={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h5 className="font-bold text-sm leading-tight group-hover:text-pd-red transition-colors line-clamp-3 text-slate-900">
                      {post.title}
                    </h5>
                    <span className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tighter">
                      {post.date}
                    </span>
                  </div>
                </ArticleLink>
              ))}
            </div>

            {/* Redesigned "More" Button */}
            <Link
              href={`/${slug || mainPost.category || "#"}`}
              className="mt-8 flex items-center justify-center w-full bg-slate-900 text-white font-black text-xs py-4 px-6 rounded-xl transition-all hover:bg-pd-red uppercase tracking-widest shadow-lg active:scale-95"
            >
              More from {title}
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
