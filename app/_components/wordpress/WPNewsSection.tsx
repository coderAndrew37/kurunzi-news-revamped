import Link from "next/link";
import ArticleLink from "@/app/_components/wordpress/WPArticleLink";
import { SportsPost } from "@/lib/wordpress/wp-api";
import SkeletonImage from "../ui/SkeletonImage";

interface NewsSectionProps {
  title: string;
  slug: string;
  posts: SportsPost[];
}

export default function NewsSection({ title, slug, posts }: NewsSectionProps) {
  if (!posts || posts.length === 0) return null;

  // Layout Logic: 1 Big (Main), 2 Medium (Sub-features), up to 5 Sidebar (List)
  const mainPost = posts[0];
  const subFeatures = posts.slice(1, 3);
  const sidebarPosts = posts.slice(3, 8);

  return (
    <section className="py-16 border-b border-gray-200 last:border-0 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-4">
            <div className="w-2 h-10 bg-red-600" />
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              {title}
            </h2>
          </div>

          <Link
            href={`/category/${slug}`}
            className="hidden lg:flex items-center text-red-600 hover:text-red-700 text-sm font-semibold uppercase tracking-wider transition-colors group"
          >
            View All
            <svg
              className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-12">
            {/* 1. Main Hero Story */}
            <ArticleLink slug={mainPost.slug} className="group block">
              <div className="relative overflow-hidden mb-6">
                <div className="aspect-video w-full bg-gray-100 relative rounded-lg overflow-hidden">
                  <SkeletonImage
                    src={mainPost.featuredImage}
                    alt={mainPost.title}
                    priority
                    className="transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-red-600 text-white text-xs font-bold px-4 py-2 uppercase tracking-wider shadow-md">
                    {title}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight group-hover:text-red-600 transition-colors">
                  {mainPost.title}
                </h3>

                {mainPost.newsData.theLede && (
                  <p className="text-gray-600 text-lg leading-relaxed line-clamp-3">
                    {mainPost.newsData.theLede}
                  </p>
                )}

                <div className="flex items-center text-gray-500 text-sm font-medium">
                  <span>Kurunzi Reporter</span>
                  <span className="mx-2">•</span>
                  <span>
                    {new Date(mainPost.date).toLocaleDateString("en-KE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </ArticleLink>

            {/* 2. Sub-feature Stories (Grid of 2) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-200">
              {subFeatures.map((post) => (
                <ArticleLink key={post.slug} slug={post.slug} className="group">
                  <div className="relative overflow-hidden mb-4">
                    <div className="aspect-video w-full bg-gray-100 relative rounded-md overflow-hidden">
                      <SkeletonImage
                        src={post.featuredImage}
                        alt={post.title}
                        className="transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-red-600">
                      <span>{title}</span>
                    </div>

                    <h4 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-red-600 transition-colors line-clamp-3">
                      {post.title}
                    </h4>
                  </div>
                </ArticleLink>
              ))}
            </div>
          </div>

          {/* 3. Sidebar (Numbered List) */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="pb-4 border-b-2 border-red-600 w-fit">
                <h4 className="text-lg font-bold text-gray-900">
                  More in {title}
                </h4>
              </div>

              <div className="space-y-6">
                {sidebarPosts.map((post, index) => (
                  <ArticleLink
                    key={post.slug}
                    slug={post.slug}
                    className="group flex gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <div className="shrink-0">
                      <div className="w-8 h-8 flex items-center justify-center bg-gray-100 group-hover:bg-red-600 group-hover:text-white rounded-full transition-all">
                        <span className="text-sm font-bold text-gray-600 group-hover:text-white">
                          {index + 1}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-3 text-sm leading-snug">
                        {post.title}
                      </h5>
                    </div>
                  </ArticleLink>
                ))}
              </div>

              <Link
                href={`/category/${slug}`}
                className="block w-full text-center px-6 py-4 bg-gray-900 text-white font-bold uppercase tracking-wider text-xs hover:bg-red-600 transition-colors rounded-md"
              >
                View All {title}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
