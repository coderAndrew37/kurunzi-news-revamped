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

  return (
    <article className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <ArticleProgressBar />
      <ArticleBreadcrumb primaryCategory={primaryCategory} />
      <ArticleHeader article={article} />
      <ArticleHero article={article} />

      <div className="kn-body-grid max-w-[1140px] mx-auto px-4 sm:px-6 pb-20">
        <ArticleBody article={article} />
        <ArticleSidebar latestPosts={latestPosts} relatedPosts={relatedPosts} />
      </div>

      <ArticleAuthorBio article={article} />
      <ArticleBackToTop />
    </article>
  );
}