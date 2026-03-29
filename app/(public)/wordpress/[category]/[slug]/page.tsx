import { getArticleBySlug, getSportsPosts } from "@/lib/wordpress/wp-api";
import { notFound } from "next/navigation";
import ArticlePageClient from "./WPArticlePageClient";

interface PageParams {
  category: string;
  slug: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) return { title: "Article Not Found | Kurunzi Sports" };

  return {
    title: `${article.title} | Kurunzi Sports`,
    description:
      article.newsData?.theLede || article.excerpt?.replace(/<[^>]+>/g, ""),
    openGraph: {
      title: article.title,
      description:
        article.newsData?.theLede || article.excerpt?.replace(/<[^>]+>/g, ""),
      images: [article.featuredImage?.node?.sourceUrl || "/og-image.jpg"],
      type: "article",
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;

  // 1. Fetch the main article
  const article = await getArticleBySlug(slug);

  // If no article, notFound() stops execution here
  if (!article) notFound();

  // 2. Fetch sidebar data
  const allPosts = await getSportsPosts();
  const latestPosts = allPosts.slice(0, 5);

  const primaryCatName = article.categories?.nodes[0]?.name;
  const relatedPosts = allPosts
    .filter((p) => p.category === primaryCatName && p.slug !== slug)
    .slice(0, 3);

  // At this point, TS knows 'article' is a WPPostNode (not null)
  return (
    <ArticlePageClient
      article={article}
      latestPosts={latestPosts}
      relatedPosts={relatedPosts}
    />
  );
}
