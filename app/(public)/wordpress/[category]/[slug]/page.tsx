import {
  getArticleBySlug,
  getSportsPosts,
  getAllPostSlugs,
} from "@/lib/wordpress/wp-api";
import { notFound } from "next/navigation";
import ArticlePageClient from "./WPArticlePageClient";
import Script from "next/script";

interface PageParams {
  category: string;
  slug: string;
}

// ─── STATIC GENERATION ──────────────────────────────────────────────────────
// Pre-builds the paths for the sitemap/recent posts for instant loading
export async function generateStaticParams() {
  const posts = await getAllPostSlugs();
  return posts.map((post) => ({
    category: post.category,
    slug: post.slug,
  }));
}

// ─── METADATA ───────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) return { title: "Article Not Found | Kurunzi Sports" };

  const cleanDescription =
    article.newsData?.theLede || article.excerpt?.replace(/<[^>]+>/g, "");

  return {
    title: `${article.title} | Kurunzi Sports`,
    description: cleanDescription,
    openGraph: {
      title: article.title,
      description: cleanDescription,
      images: [article.featuredImage?.node?.sourceUrl || "/og-image.jpg"],
      type: "article",
      publishedTime: article.date,
      authors: [article.author?.node?.name || "Kurunzi Sports"],
    },
  };
}

// ─── PAGE COMPONENT ─────────────────────────────────────────────────────────
export default async function ArticlePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;

  // Parallel data fetching for speed
  const [article, allPosts] = await Promise.all([
    getArticleBySlug(slug),
    getSportsPosts(),
  ]);

  if (!article) notFound();

  // Sidebar Logic
  const latestPosts = allPosts.slice(0, 5);
  const primaryCatName = article.categories?.nodes[0]?.name;
  const relatedPosts = allPosts
    .filter((p) => p.category === primaryCatName && p.slug !== slug)
    .slice(0, 3);

  // Google News Schema (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    image: [article.featuredImage?.node?.sourceUrl],
    datePublished: article.date,
    author: [
      {
        "@type": "Person",
        name: article.author?.node?.name,
        url: `https://kurunzisports.com/author/${article.author?.node?.slug}`,
      },
    ],
  };

  return (
    <>
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticlePageClient
        article={article}
        latestPosts={latestPosts}
        relatedPosts={relatedPosts}
      />
    </>
  );
}
