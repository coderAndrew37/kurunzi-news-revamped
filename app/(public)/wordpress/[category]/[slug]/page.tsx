// app/(public)/wordpress/[category]/[slug]/page.tsx
import { notFound } from "next/navigation";
import Script from "next/script";
import { getAllPostSlugs, getArticleBySlug, getSportsPosts } from "@/lib/wordpress/data";
import ArticlePageClient from "./WPArticlePageClient";

interface PageParams {
  category: string;
  slug: string;
}

// ─── STATIC GENERATION ───────────────────────────────────────────────────────
export async function generateStaticParams() {
  const posts = await getAllPostSlugs();
  return posts.map((post) => ({
    category: post.category,
    slug: post.slug,
  }));
}

// ─── METADATA ────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) return { title: "Article Not Found | Kurunzi Sports" };

  // Prefer Rank Math SEO fields, fall back to ACF lede / excerpt / title
  const title =
    article.seo?.title ?? `${article.title} | Kurunzi Sports`;

  const description =
    article.seo?.description ??
    article.articleFields?.newsData?.theLede ??
    article.excerpt?.replace(/<[^>]+>/g, "") ??
    article.title;

  const ogImage =
    article.seo?.openGraph?.image?.url ??
    article.featuredImage?.node?.sourceUrl ??
    "/og-image.jpg";

  return {
    title,
    description,
    openGraph: {
      title: article.seo?.openGraph?.title ?? article.title,
      description: article.seo?.openGraph?.description ?? description,
      images: [ogImage],
      type: "article",
      publishedTime: article.date,
      authors: [article.author?.node?.name ?? "Kurunzi Sports"],
    },
  };
}

// ─── PAGE ────────────────────────────────────────────────────────────────────
export default async function ArticlePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;

  const [article, allPosts] = await Promise.all([
    getArticleBySlug(slug),
    getSportsPosts(),
  ]);

  if (!article) notFound();

  const latestPosts = allPosts.slice(0, 5);
  const primaryCatName = article.categories?.nodes[0]?.name;
  const relatedPosts = allPosts
    .filter((p) => p.category === primaryCatName && p.slug !== slug)
    .slice(0, 3);

  // siteUrl from env — never import from next-sitemap.config (it's not a TS module)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kurunzisports.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    image: article.featuredImage?.node?.sourceUrl
      ? [article.featuredImage.node.sourceUrl]
      : [],
    datePublished: article.date,
    author: [
      {
        "@type": "Person",
        name: article.author?.node?.name ?? "Kurunzi Sports",
        url: `${siteUrl}/author/${article.author?.node?.slug ?? "editorial"}`,
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