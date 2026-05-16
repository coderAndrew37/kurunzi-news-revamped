"use client";

import "./article-page.css";

import { WPPostNode, SportsPost } from "@/lib/wordpress/types";
import ArticleProgressBar from "./_components/ArticleProgressBar";
import ArticleBreadcrumb from "./_components/ArticleBreadcrumb";
import ArticleHeader from "./_components/ArticleHeader";
import ArticleHero from "./_components/ArticleHero";
import ArticleBody from "./_components/ArticleBody";
import ArticleSidebar from "./_components/ArticleSidebar";
import ArticleAuthorBio from "./_components/ArticleAuthorBio";
import ArticleBackToTop from "./_components/ArticleBackToTop";
import NewsSection from "@/app/_components/wordpress/WPNewsSection";

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
      <ArticleBreadcrumb primaryCategory={primaryCategory} />
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
