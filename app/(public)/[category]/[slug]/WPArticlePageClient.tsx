"use client";

import "./article-page.css";

import NewsSection from "@/app/_components/wordpress/WPNewsSection";
import { SportsPost, WPPostNode } from "@/lib/wordpress/types";
import ArticleAuthorBio from "./_components/ArticleAuthorBio";
import ArticleBackToTop from "./_components/ArticleBackToTop";
import ArticleBody from "./_components/ArticleBody";
import ArticleHero from "./_components/ArticleHero";
import ArticleProgressBar from "./_components/ArticleProgressBar";
import ArticleSidebar from "./_components/ArticleSidebar";

interface Props {
  article: WPPostNode;
  latestPosts: SportsPost[];
  relatedPosts: SportsPost[];
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

      {/* Main Structural Wrapper Grid */}
      <div className="kn-body-grid max-w-[1140px] mx-auto px-4 sm:px-6 pt-10 pb-20">
        
        {/* Left Column: Flow Content Track */}
        <div className="min-w-0">
          <ArticleHero article={article} />
          <ArticleBody article={article} />
        </div>

        {/* Right Column: Sidebar Track */}
        <ArticleSidebar latestPosts={latestPosts} />
        
      </div>

      {/* Bottom Section - More in this Category */}
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