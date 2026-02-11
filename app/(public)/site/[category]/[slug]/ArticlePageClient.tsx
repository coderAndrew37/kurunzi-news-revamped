"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";

interface ArticlePageClientProps {
  article: ArticleDetail & {
    mainImageUrl: string;
    authorImageUrl: string | null;
  };
  latestArticles: Post[];
  relatedArticles: Post[];
}

export default function ArticlePageClient({
  article,
  latestArticles,
  relatedArticles,
}: ArticlePageClientProps) {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Format dates
  const publishedDate = new Date(article.publishedAt);
  const formattedDate = publishedDate.toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const timeAgo = getTimeAgo(publishedDate);
  const readingTime = calculateReadingTime(article.body);

  // Reading progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const articleHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / articleHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Bookmark functionality
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In a real app, you would save to localStorage or API
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    if (isBookmarked) {
      const filtered = bookmarks.filter((id: string) => id !== article._id);
      localStorage.setItem("bookmarks", JSON.stringify(filtered));
    } else {
      localStorage.setItem(
        "bookmarks",
        JSON.stringify([...bookmarks, article._id]),
      );
    }
  };

  // Share functionality
  const handleShare = (
    platform: "twitter" | "facebook" | "linkedin" | "copy",
  ) => {
    const url = window.location.href;
    const title = article.title;
    const text = article.excerpt;

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
          "_blank",
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank",
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          "_blank",
        );
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        break;
    }
    setShowShareOptions(false);
  };

  // Calculate reading time
  function calculateReadingTime(body: any): number {
    const wordCount = JSON.stringify(body).split(/\s+/).length;
    const wordsPerMinute = 200;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  // Time ago helper
  function getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return `${Math.floor(diffInDays / 7)}w ago`;
  }

  return (
    <article className="min-h-screen bg-white">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-gray-200">
        <div
          className="h-full bg-red-600 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Back Button */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 py-4 text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to News
          </button>
        </div>
      </div>

      {/* Article Hero */}
      <div className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Category */}
          <Link
            href={`/${article.categorySlug}`}
            className="inline-block text-red-600 hover:text-red-700 font-semibold text-sm uppercase tracking-wide mb-4"
          >
            {article.categoryTitle}
          </Link>

          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-6">
            {article.title}
          </h1>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-600">
            <div className="flex items-center gap-3">
              {article.authorImageUrl ? (
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <SanityImage
                    asset={article.authorImageUrl}
                    alt={article.authorName}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
              )}
              <div>
                <Link
                  href={`/k/author/${article.authorSlug}`}
                  className="font-medium hover:text-gray-900"
                >
                  {article.authorName}
                </Link>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formattedDate}
                </div>
              </div>
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{readingTime} min read</span>
              </div>
              <div className="h-6 w-px bg-gray-300" />
              <div className="relative">
                <button
                  onClick={() => setShowShareOptions(!showShareOptions)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>

                {showShareOptions && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50 min-w-50">
                    <div className="text-xs font-semibold text-gray-500 mb-2">
                      Share via
                    </div>
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() => handleShare("twitter")}
                        className="flex-1 flex items-center justify-center gap-2 p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-sm"
                      >
                        <Twitter className="w-4 h-4" />
                        Twitter
                      </button>
                      <button
                        onClick={() => handleShare("facebook")}
                        className="flex-1 flex items-center justify-center gap-2 p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-sm"
                      >
                        <Facebook className="w-4 h-4" />
                        Facebook
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleShare("linkedin")}
                        className="flex-1 flex items-center justify-center gap-2 p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-sm"
                      >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </button>
                      <button
                        onClick={() => handleShare("copy")}
                        className="flex-1 flex items-center justify-center gap-2 p-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md text-sm"
                      >
                        {isCopied ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        {isCopied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleBookmark}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                <Bookmark
                  className={`w-5 h-5 ${isBookmarked ? "fill-current text-red-600" : ""}`}
                />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Article Content */}
          <div className="lg:w-2/3 max-w-3xl mx-auto">
            {/* Featured Image */}
            <figure className="mb-10">
              <div className="relative w-full aspect-video bg-gray-100 rounded-xl overflow-hidden mb-4">
                <SanityImage
                  asset={article.mainImageUrl}
                  alt={article.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              {(article.mainImageCaption || article.mainImageSource) && (
                <figcaption className="text-sm text-gray-500 pt-2 border-t border-gray-200">
                  {article.mainImageCaption}
                  {article.mainImageSource && (
                    <span className="block text-xs text-gray-400 mt-1">
                      Credit: {article.mainImageSource}
                    </span>
                  )}
                </figcaption>
              )}
            </figure>

            {/* Article Body */}
            <div className="prose prose-lg max-w-none prose-red">
              <CustomPortableText value={article.body} />
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Link
                      key={tag.slug}
                      href={`/topic/${tag.slug}`}
                      className="px-4 py-2 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 text-sm font-medium rounded-full transition-colors"
                    >
                      #{tag.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-1/3">
            <div className="lg:sticky lg:top-24 space-y-8">
              {/* Latest News */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    Latest News
                  </h3>
                  <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                </div>

                <div className="space-y-6">
                  {latestArticles.map((post, index) => (
                    <ArticleLink
                      key={post._id}
                      categorySlug={post.category || ""}
                      slug={post.slug}
                      className="group block pb-6 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 w-8">
                          <div className="w-6 h-6 flex items-center justify-center bg-gray-100 group-hover:bg-red-50 rounded-full">
                            <span className="text-xs font-medium text-gray-600 group-hover:text-red-600">
                              {index + 1}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-red-600 uppercase tracking-wide mb-1">
                            {post.category}
                          </div>
                          <h4 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-3 text-sm">
                            {post.title}
                          </h4>
                        </div>
                      </div>
                    </ArticleLink>
                  ))}
                </div>
              </div>

              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">
                    Related Articles
                  </h3>
                  <div className="space-y-4">
                    {relatedArticles.slice(0, 3).map((post) => (
                      <ArticleLink
                        key={post._id}
                        categorySlug={post.category || ""}
                        slug={post.slug}
                        className="group block"
                      >
                        <div className="flex gap-3">
                          <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                            <SanityImage
                              asset={post.mainImage}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 text-sm">
                              {post.title}
                            </h4>
                            <div className="flex items-center text-xs text-gray-500 mt-2">
                              <span>
                                {new Date(post.date).toLocaleDateString(
                                  "en-KE",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  },
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </ArticleLink>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter */}
              <div className="bg-linear-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-2">Stay Informed</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Get daily news updates and exclusive analysis directly in your
                  inbox.
                </p>
                <Link
                  href="/subscribe"
                  className="inline-flex items-center justify-center w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Subscribe to Newsletter
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Author Bio */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start gap-6">
            <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 bg-gray-100">
              {article.authorImageUrl ? (
                <SanityImage
                  asset={article.authorImageUrl}
                  alt={article.authorName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg">
                {article.authorName}
              </h4>
              {article.authorBio && (
                <p className="text-gray-600 mt-2">{article.authorBio}</p>
              )}
              <Link
                href={`/k/author/${article.authorSlug}`}
                className="inline-block mt-4 text-red-600 hover:text-red-700 font-medium text-sm"
              >
                View all articles by {article.authorName} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
