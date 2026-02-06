import { fetchArticleBySlug, fetchRelatedArticles } from "@/lib/sanity/api";
import CustomPortableText from "@/app/_components/PortableText";
import SanityImage from "@/app/_components/SanityImage"; // Centralized component
import ArticleLink from "@/app/_components/ArticleLink"; // Centralized links
import { notFound } from "next/navigation";
import { NewsCardProps } from "@/types";
import { Metadata } from "next";
import { urlFor } from "@/lib/sanity/image";
import Link from "next/link";

interface PageParams {
  category: string;
  slug: string;
}

// Helper to resolve Sanity Image objects to URLs on the Server
const resolveImageUrl = (asset: any) => {
  if (!asset) return "/fallback-news.jpg";
  try {
    return urlFor(asset).width(1200).height(675).url();
  } catch (e) {
    return "/fallback-news.jpg";
  }
};

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);

  if (!article) return { title: "Article Not Found" };

  const imageUrl = resolveImageUrl(article.mainImage);

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      images: [imageUrl],
    },
    twitter: {
      card: "summary_large_image",
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
  const article = await fetchArticleBySlug(slug);

  if (!article) notFound();

  // Map related articles (fetchRelatedArticles should return raw Sanity data, we map it here)
  const relatedRaw = await fetchRelatedArticles(
    article.categorySlug,
    article._id,
  );

  // Resolve image URLs on the server before passing to client components
  const mainImageUrl = resolveImageUrl(article.mainImage);
  const authorImageUrl = article.authorImage
    ? urlFor(article.authorImage).width(100).height(100).url()
    : null;

  return (
    <article className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      {/* Header Section */}
      <header className="max-w-4xl mb-10">
        <Link
          href={`/${article.categorySlug}`}
          className="text-pd-red font-black uppercase text-sm tracking-widest hover:underline"
        >
          {article.categoryTitle}
        </Link>
        <h1 className="text-4xl md:text-6xl font-black mt-4 mb-6 leading-[1.1] text-slate-900 italic">
          {article.title}
        </h1>

        <div className="flex items-center gap-4 border-y py-4 border-slate-100">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100">
            <SanityImage
              asset={authorImageUrl}
              alt={article.authorName}
              fill
              className="object-cover"
            />
          </div>
          <div className="text-sm">
            <Link
              href={`/auth/${article.authorSlug}`}
              className="font-bold text-slate-900 hover:text-pd-red"
            >
              By {article.authorName}
            </Link>
            <p className="text-slate-500 uppercase text-[10px] font-bold tracking-tighter">
              Published{" "}
              {new Date(article.publishedAt).toLocaleDateString("en-KE", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Body (8 Cols) */}
        <div className="lg:col-span-8">
          <div className="relative aspect-video w-full mb-10 overflow-hidden rounded-2xl shadow-2xl bg-slate-100">
            <SanityImage
              asset={mainImageUrl}
              alt={article.title}
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="prose prose-lg prose-slate max-w-none prose-img:rounded-xl">
            <CustomPortableText value={article.body} />
          </div>

          {/* Tags */}
          {article.tags && (
            <div className="mt-12 pt-8 border-t flex flex-wrap gap-2">
              {article.tags.map((tag: { title: string; slug: string }) => (
                <Link
                  key={tag.slug}
                  href={`/topic/${tag.slug}`}
                  className="bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-tight hover:bg-pd-red hover:text-white transition-colors"
                >
                  #{tag.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar (4 Cols) */}
        <aside className="lg:col-span-4 space-y-12">
          <div className="sticky top-28">
            <h4 className="text-xl font-black border-b-4 border-pd-red w-fit pb-1 mb-6 uppercase">
              Related Stories
            </h4>
            <div className="flex flex-col gap-6">
              {relatedRaw.map((post: NewsCardProps) => (
                <ArticleLink
                  key={post.slug}
                  categorySlug={post.category}
                  slug={post.slug}
                  className="group flex gap-4"
                >
                  <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-100">
                    <SanityImage
                      asset={resolveImageUrl(post.image)}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h5 className="font-bold text-sm leading-snug group-hover:text-pd-red transition-colors line-clamp-3">
                    {post.title}
                  </h5>
                </ArticleLink>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
