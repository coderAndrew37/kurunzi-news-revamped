"use client";

import "./article-page.css";

import { SportsPost, ArticleDetail } from "@/lib/wordpress/types";
import ArticleProgressBar from "./_components/ArticleProgressBar";
import ArticleBreadcrumb from "./_components/ArticleBreadcrumb";
import ArticleHeader from "./_components/ArticleHeader";
import ArticleHero from "./_components/ArticleHero";
import ArticleBody from "./_components/ArticleBody";
import ArticleSidebar from "./_components/ArticleSidebar";
import ArticleAuthorBio from "./_components/ArticleAuthorBio";
import ArticleBackToTop from "./_components/ArticleBackToTop";

interface Props {
  article: ArticleDetail;
  latestPosts: SportsPost[];
  relatedPosts: SportsPost[];
}

export default function ArticlePageClient({
  article,
  latestPosts,
  relatedPosts,
}: Props) {
  const primaryCategory = article.categories?.nodes[0];

  return (
    <article
      className="min-h-screen"
      style={{ background: "var(--color-paper)", color: "var(--color-ink)" }}
    >
      {/* Reading progress */}
      <ArticleProgressBar />

      {/* Sticky breadcrumb */}
      <ArticleBreadcrumb primaryCategory={primaryCategory} />

      {/* Headline, deck, byline */}
      <ArticleHeader article={article} />

      {/* Hero image */}
      <ArticleHero article={article} />

      {/* Body + sidebar grid */}
      <div className="kn-body-grid max-w-[1140px] mx-auto px-4 sm:px-6 pb-20">
        <ArticleBody article={article} />
        <ArticleSidebar latestPosts={latestPosts} relatedPosts={relatedPosts} />
      </div>

      {/* Author bio */}
      <ArticleAuthorBio article={article} />

      {/* Back to top */}
      <ArticleBackToTop />
    </article>
  );
}