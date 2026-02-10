import {
  fetchArticleBySlug,
  fetchRelatedArticles,
  fetchLatestArticles,
} from "@/lib/sanity/api";
import CustomPortableText from "@/app/_components/PortableText";
import SanityImage from "@/app/_components/SanityImage";
import ArticleLink from "@/app/_components/ArticleLink";
import { notFound } from "next/navigation";
import { ArticleDetail, Post } from "@/types";
import { urlFor } from "@/lib/sanity/image";
import Link from "next/link";
import { Metadata } from "next";

interface PageParams {
  category: string;
  slug: string;
}

/**
 * Type guard for the Inline Related block within the body array
 */
interface InlineRelatedBlock {
  _type: "inlineRelated";
  post: {
    _id: string;
    title: string;
    slug: string;
    categorySlug: string;
    mainImage: ArticleDetail["mainImage"];
  };
}

const resolveImageUrl = (
  asset: ArticleDetail["mainImage"] | string | null | undefined,
): string => {
  if (!asset) return "/fallback-news.jpg";
  try {
    // Check if it's already a string URL or a Sanity Image object
    if (typeof asset === "string") return asset;
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
  const article: ArticleDetail | null = await fetchArticleBySlug(slug);
  if (!article) return { title: "Article Not Found" };

  const imageUrl = resolveImageUrl(article.mainImage);

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { images: [imageUrl] },
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

  // Concurrent data fetching
  const [latestArticles, relatedRaw]: [Post[], Post[]] = await Promise.all([
    fetchLatestArticles(4),
    fetchRelatedArticles(article.categorySlug, article._id),
  ]);

  const mainImageUrl = resolveImageUrl(article.mainImage);
  const authorImageUrl = article.authorImage?.asset?._ref
    ? urlFor(article.authorImage).width(100).height(100).url()
    : null;

  // DEDUPLICATION LOGIC
  // We extract the ID of a post featured inline to ensure it isn't repeated below.
  const inlineBlock = article.body?.find(
    (block): block is InlineRelatedBlock => block._type === "inlineRelated",
  );
  const inlinePostId = inlineBlock?.post?._id;

  const filteredMoreFrom = relatedRaw.filter(
    (post) => post._id !== inlinePostId,
  );

  return (
    <article className="max-w-7xl mx-auto px-4 py-8 md:py-16">
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
            {authorImageUrl && (
              <SanityImage
                asset={authorImageUrl}
                alt={article.authorName}
                fill
                className="object-cover"
              />
            )}
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
                dateStyle: "full",
              })}
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          {/* Main Article Image */}
          <figure className="mb-10">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-2xl bg-slate-100">
              <SanityImage
                asset={mainImageUrl}
                alt={article.title}
                fill
                priority
                className="object-cover"
              />
            </div>
            {(article.mainImageCaption || article.mainImageSource) && (
              <figcaption className="mt-4 text-sm text-slate-500 border-l-4 border-pd-red pl-4 italic">
                {article.mainImageCaption}
                {article.mainImageSource && (
                  <span className="block text-[10px] uppercase font-black not-italic text-slate-400 mt-1">
                    Credit: {article.mainImageSource}
                  </span>
                )}
              </figcaption>
            )}
          </figure>

          {/* Article Body Content */}
          <div className="prose prose-lg prose-slate max-w-none prose-img:rounded-xl">
            <CustomPortableText value={article.body} />
          </div>

          {/* 1. TAGS SECTION */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-16 pt-8 border-t border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
                Tagged in this Story
              </h3>
              <div className="flex flex-wrap gap-3">
                {article.tags.map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/topic/${tag.slug}`}
                    className="px-5 py-2 bg-slate-50 hover:bg-pd-red hover:text-white border border-slate-200 text-slate-800 text-sm font-bold rounded-full transition-all duration-300 uppercase tracking-tighter"
                  >
                    # {tag.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 2. "MORE FROM THIS TOPIC" GRID */}
          <section className="mt-20">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl font-black uppercase italic">
                More from {article.categoryTitle}
              </h2>
              <div className="h-1 flex-1 bg-pd-red" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredMoreFrom.slice(0, 3).map((post) => (
                <ArticleLink
                  key={post._id}
                  categorySlug={post.category || ""}
                  slug={post.slug}
                  className="group"
                >
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-4 shadow-sm bg-slate-100">
                    <SanityImage
                      asset={post.mainImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h4 className="text-xl font-bold leading-snug group-hover:text-pd-red transition-colors line-clamp-3">
                    {post.title}
                  </h4>
                </ArticleLink>
              ))}
            </div>
          </section>
        </div>

        {/* SIDEBAR: STICKY LATEST NEWS */}
        <aside className="lg:col-span-4 space-y-12">
          <div className="sticky top-28">
            <div className="flex items-center justify-between border-b-4 border-slate-900 mb-6 pb-1">
              <h4 className="text-xl font-black uppercase tracking-tighter">
                Latest News
              </h4>
              <span className="flex h-2 w-2 rounded-full bg-pd-red animate-pulse" />
            </div>

            <div className="flex flex-col gap-6">
              {latestArticles.map((post) => (
                <ArticleLink
                  key={post._id}
                  categorySlug={post.category || ""}
                  slug={post.slug}
                  className="group flex gap-4"
                >
                  <div className="relative w-24 h-18 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-100">
                    <SanityImage
                      asset={post.mainImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-pd-red text-[10px] font-black uppercase tracking-wider">
                      {post.category}
                    </span>
                    <h5 className="font-bold text-sm leading-tight group-hover:text-pd-red transition-colors line-clamp-3">
                      {post.title}
                    </h5>
                  </div>
                </ArticleLink>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
