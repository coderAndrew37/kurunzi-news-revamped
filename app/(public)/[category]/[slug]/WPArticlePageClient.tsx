"use client";

import "./article-page.css";

import NewsSection from "@/app/_components/wordpress/WPNewsSection";
import { SportsPost, WPPostNode } from "@/lib/wordpress/types";
import ArticleAuthorBio from "./_components/ArticleAuthorBio";
import ArticleBackToTop from "./_components/ArticleBackToTop";
import ArticleBody from "./_components/ArticleBody";
import ArticleHeader from "./_components/ArticleHeader";
import ArticleHero from "./_components/ArticleHero";
import ArticleProgressBar from "./_components/ArticleProgressBar";
import ArticleSidebar from "./_components/ArticleSidebar";

interface Props {
  article: WPPostNode;
  latestPosts: SportsPost[];
  relatedPosts: SportsPost[]; // Same category posts
}

export default function ArticlePageClient({
  article,
  latestPosts,
  relatedPosts,
}: Props) {
  const primaryCategory = article.categories?.nodes[0];
  const categoryName = primaryCategory?.name || "Sports";
  const categorySlug = primaryCategory?.slug || "news";

  return (
    <article className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <ArticleProgressBar />
      <ArticleHeader article={article} />
      <ArticleHero article={article} />

      <div className="kn-body-grid max-w-[1140px] mx-auto px-4 sm:px-6 pb-20">
        <ArticleBody article={article} />
        <ArticleSidebar latestPosts={latestPosts} />
      </div>

      {/* Lower Section - More in this Category */}
      {relatedPosts.length > 0 && (
        <NewsSection
          title={`More in ${categoryName}`}
          slug={categorySlug}
          posts={relatedPosts}
          viewAllHref={`/${categorySlug}`}
          viewAllLabel="View All"
        />
      )}

      <ArticleAuthorBio article={article} />
      <ArticleBackToTop />
    </article>
  );
}
