import SanityImage from "@/app/_components/SanityImage";
import ArticleLink from "@/app/_components/ArticleLink";
import { NewsCardProps } from "@/types";
import Link from "next/link";

interface NewsSectionProps {
  title: string;
  slug: string;
  posts: NewsCardProps[];
}

export default function NewsSection({ title, slug, posts }: NewsSectionProps) {
  if (!posts || posts.length === 0) return null;

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
            href={`/${slug || mainPost.category || "#"}`}
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
            {/* Hero Story */}
            <ArticleLink
              categorySlug={mainPost.category}
              slug={mainPost.slug}
              className="group block"
            >
              <div className="relative overflow-hidden mb-6">
                <div className="aspect-video w-full bg-gray-100 overflow-hidden">
                  <SanityImage
                    asset={mainPost.image}
                    alt={mainPost.title}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-red-600 text-white text-xs font-bold px-4 py-2 uppercase tracking-wider">
                    {mainPost.category}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight group-hover:text-red-600 transition-colors">
                  {mainPost.title}
                </h3>

                {mainPost.excerpt && (
                  <p className="text-gray-600 text-lg leading-relaxed line-clamp-3">
                    {mainPost.excerpt}
                  </p>
                )}

                <div className="flex items-center text-gray-500 text-sm">
                  <span className="font-medium">
                    By {mainPost.author || "Staff Reporter"}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{mainPost.date}</span>
                </div>
              </div>
            </ArticleLink>

            {/* Sub-feature Stories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-200">
              {subFeatures.map((post) => (
                <ArticleLink
                  key={post.slug}
                  categorySlug={post.category}
                  slug={post.slug}
                  className="group"
                >
                  <div className="relative overflow-hidden mb-4">
                    <div className="aspect-video w-full bg-gray-100 overflow-hidden">
                      <SanityImage
                        asset={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-xs font-bold uppercase tracking-wider">
                      <span className="text-red-600">{post.category}</span>
                      <span className="mx-2">•</span>
                      <span className="text-gray-500">{post.date}</span>
                    </div>

                    <h4 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-red-600 transition-colors line-clamp-3">
                      {post.title}
                    </h4>

                    {post.excerpt && (
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </ArticleLink>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Sidebar Header */}
              <div className="pb-4 border-b border-gray-200">
                <h4 className="text-lg font-bold text-gray-900">
                  More in {title}
                </h4>
                <p className="text-gray-500 text-sm mt-1">
                  Latest updates and stories
                </p>
              </div>

              {/* Sidebar Posts */}
              <div className="space-y-6">
                {sidebarPosts.map((post, index) => (
                  <ArticleLink
                    key={post.slug}
                    categorySlug={post.category}
                    slug={post.slug}
                    className="group flex gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    {/* Number Indicator for Top 5 */}
                    <div className="shrink-0">
                      <div className="w-8 h-8 flex items-center justify-center bg-gray-100 group-hover:bg-red-50 rounded-full transition-colors">
                        <span className="text-sm font-bold text-gray-600 group-hover:text-red-600">
                          {index + 1}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center text-xs font-semibold uppercase tracking-wide mb-1">
                        <span className="text-red-600">{post.category}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-gray-500">{post.date}</span>
                      </div>

                      <h5 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-3 text-sm leading-snug">
                        {post.title}
                      </h5>
                    </div>
                  </ArticleLink>
                ))}
              </div>

              {/* View All Button */}
              <Link
                href={`/${slug || mainPost.category || "#"}`}
                className="block w-full text-center px-6 py-4 bg-red-600 text-white font-bold uppercase tracking-wider text-sm hover:bg-red-700 transition-colors rounded-lg"
              >
                View All {title} Stories
              </Link>

              {/* Newsletter Signup (Optional) */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h5 className="font-bold text-gray-900 mb-2">Stay Updated</h5>
                <p className="text-gray-600 text-sm mb-4">
                  Get the latest {title} news delivered to your inbox.
                </p>
                <Link
                  href="/subscribe"
                  className="inline-flex items-center text-red-600 font-semibold text-sm hover:text-red-700"
                >
                  Subscribe to newsletter
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile View All Link */}
        <div className="mt-12 pt-8 border-t border-gray-200 lg:hidden">
          <Link
            href={`/${slug || mainPost.category || "#"}`}
            className="flex items-center justify-center text-red-600 hover:text-red-700 font-semibold uppercase tracking-wider text-sm transition-colors group"
          >
            View All {title} Stories
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
      </div>
    </section>
  );
}
