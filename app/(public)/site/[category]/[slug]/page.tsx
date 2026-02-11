import {
  fetchArticleBySlug,
  fetchRelatedArticles,
  fetchLatestArticles,
} from "@/lib/sanity/api";
import { notFound } from "next/navigation";
import { ArticleDetail, Post } from "@/types";
import { urlFor } from "@/lib/sanity/image";
import ArticlePageClient from "./ArticlePageClient";

interface PageParams {
  slug: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const article: ArticleDetail | null = await fetchArticleBySlug(slug);

  if (!article)
    return {
      title: "Article Not Found | Kurunzi News",
    };

  const imageUrl = article.mainImage
    ? urlFor(article.mainImage).width(1200).height(630).url()
    : "/og-image.jpg";

  return {
    title: `${article.title} | Kurunzi News`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [imageUrl],
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.authorName],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [imageUrl],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const article: ArticleDetail | null = await fetchArticleBySlug(slug);

  if (!article) notFound();

  const [latestArticles, relatedArticles] = await Promise.all([
    fetchLatestArticles(5),
    fetchRelatedArticles(article.categorySlug, article._id),
  ]);

  // Prepare data for client component
  const articleData = {
    ...article,
    mainImageUrl: article.mainImage
      ? urlFor(article.mainImage).width(1200).height(675).url()
      : "/fallback-news.jpg",
    authorImageUrl: article.authorImage?.asset?._ref
      ? urlFor(article.authorImage).width(100).height(100).url()
      : null,
  };

  return (
    <ArticlePageClient
      article={articleData}
      latestArticles={latestArticles}
      relatedArticles={relatedArticles}
    />
  );
}
