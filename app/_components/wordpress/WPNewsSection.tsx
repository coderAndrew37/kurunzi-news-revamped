// components/NewsSection.tsx
// Theme locked — red-600 / gray-900 / white palette is the north star.
// Layout improvement: hero now uses overlay pattern (image + gradient text)
// so the featured image is taller and more impactful, matching BBC Sport's
// hero treatment. Sub-features and sidebar are unchanged in structure.
// viewAllHref / viewAllLabel props fully preserved.
// Pure Tailwind, server component.

import Link from "next/link";
import ArticleLink from "@/app/_components/wordpress/WPArticleLink";
import SkeletonImage from "../ui/SkeletonImage";
import { SportsPost } from "@/lib/wordpress/types";

interface NewsSectionProps {
  title: string;
  slug: string;
  posts: SportsPost[];
  viewAllHref?: string;
  viewAllLabel?: string;
}

export default function NewsSection({
  title,
  slug,
  posts,
  viewAllHref,
  viewAllLabel = "View All",
}: NewsSectionProps) {
  if (!posts || posts.length === 0) return null;

  const mainPost = posts[0];
  const subFeatures = posts.slice(1, 3);
  const sidebarPosts = posts.slice(3, 8);

  const resolvedHref = viewAllHref ?? `/${slug}`;

  return (
    <section className="py-10 border-b border-gray-200 last:border-0 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b-2 border-red-600">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-red-600 rounded-sm" />
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
              {title}
            </h2>
          </div>

          <Link
            href={resolvedHref}
            className="hidden lg:flex items-center gap-2 text-red-600 hover:text-gray-900 text-xs font-bold uppercase tracking-wider transition-colors group"
          >
            {viewAllLabel}
            <svg
              className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── Main Content ────────────────────────────────────────────── */}
          <div className="lg:col-span-8 space-y-8">

            {/* 1. Hero — overlay pattern: image fills frame, text on gradient */}
            <ArticleLink
              categorySlug={mainPost.category?.toLowerCase().replace(/\s+/g, "-") ?? slug}
              slug={mainPost.slug}
              className="group block"
            >
              <div className="relative overflow-hidden rounded-lg aspect-[16/9] bg-gray-100">
                {/* Image */}
                <SkeletonImage
                  src={mainPost.featuredImage}
                  alt={mainPost.title}
                  priority
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-red-600 text-white text-[11px] font-bold px-3 py-1.5 uppercase tracking-wider">
                    {title}
                  </span>
                </div>

                {/* Text on overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight mb-2 group-hover:text-red-400 transition-colors">
                    {mainPost.title}
                  </h3>

                  {mainPost.newsData?.theLede && (
                    <p className="hidden sm:block text-white/80 text-sm leading-relaxed line-clamp-2 mb-3">
                      {mainPost.newsData.theLede}
                    </p>
                  )}

                  <div className="flex items-center text-white/60 text-xs font-medium gap-2">
                    <span>Kurunzi Reporter</span>
                    <span>·</span>
                    <time dateTime={mainPost.date}>
                      {new Date(mainPost.date).toLocaleDateString("en-KE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </time>
                  </div>
                </div>
              </div>
            </ArticleLink>

            {/* 2. Sub-feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
              {subFeatures.map((post) => (
                <ArticleLink
                  key={post.slug}
                  categorySlug={post.category?.toLowerCase().replace(/\s+/g, "-") ?? slug}
                  slug={post.slug}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-md aspect-video bg-gray-100 mb-3">
                    <SkeletonImage
                      src={post.featuredImage}
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-red-600">
                      {title}
                    </span>
                    <h4 className="text-base font-bold text-gray-900 leading-snug group-hover:text-red-600 transition-colors line-clamp-3">
                      {post.title}
                    </h4>
                  </div>
                </ArticleLink>
              ))}
            </div>
          </div>

          {/* ── Sidebar ─────────────────────────────────────────────────── */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-6 space-y-5">
              <div className="pb-3 border-b-2 border-red-600">
                <h4 className="text-base font-bold text-gray-900">More in {title}</h4>
              </div>

              <ul className="space-y-5">
                {sidebarPosts.map((post, index) => (
                  <li key={post.slug}>
                    <ArticleLink
                      categorySlug={post.category?.toLowerCase().replace(/\s+/g, "-") ?? slug}
                      slug={post.slug}
                      className="group flex gap-3 pb-5 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      {/* Thumbnail */}
                      <div className="shrink-0 w-20 h-16 relative rounded overflow-hidden bg-gray-100">
                        <SkeletonImage
                          src={post.featuredImage}
                          alt={post.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold bg-red-600 text-white rounded-full shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-widest text-red-600 truncate">
                            {title}
                          </span>
                        </div>

                        <h5 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-tight text-[13px] line-clamp-3">
                          {post.title}
                        </h5>
                      </div>
                    </ArticleLink>
                  </li>
                ))}
              </ul>

              {/* View All CTA */}
              <Link
                href={resolvedHref}
                className="block w-full text-center px-5 py-3 bg-gray-900 text-white font-bold uppercase tracking-wider text-xs hover:bg-red-600 transition-colors rounded"
              >
                {viewAllLabel} {title}
              </Link>
            </div>
          </aside>

        </div>
      </div>
    </section>
  );
}