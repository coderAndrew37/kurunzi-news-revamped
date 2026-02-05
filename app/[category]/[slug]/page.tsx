import { fetchArticleBySlug, fetchRelatedArticles } from "@/lib/sanity/api";
import CustomPortableText from "@/app/_components/PortableText";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsCardProps } from "@/types";
import { Metadata } from "next";

// 1. Define the Full Article shape from Sanity
interface FullArticle {
  _id: string;
  _updatedAt: string;
  title: string;
  slug: string;
  mainImage: string;
  publishedAt: string;
  excerpt: string;
  body: any;
  categoryTitle: string;
  categorySlug: string;
  authorName: string;
  authorImage: string;
  authorSlug: string;
  tags?: {
    title: string;
    slug: string;
  }[];
}

interface PageParams {
  category: string;
  slug: string;
}

// 2. Metadata Generation - Fixed with await params
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<PageParams> 
}): Promise<Metadata> {
  const { slug } = await params;
  const article: FullArticle | null = await fetchArticleBySlug(slug);
  
  if (!article) return { title: "Article Not Found" };

  return {
    title: article.title,
    description: article.excerpt,
    category: article.categoryTitle,
    openGraph: {
      type: 'article',
      url: `https://kurunzinews.co.ke/${article.categorySlug}/${article.slug}`,
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt,
      modifiedTime: article._updatedAt,
      authors: [article.authorName],
      tags: article.tags?.map(t => t.title),
      images: [article.mainImage],
    },
    alternates: {
      canonical: `https://kurunzinews.co.ke/${article.categorySlug}/${article.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.mainImage],
      creator: '@kurunzinews',
    }
  };
}

export default async function ArticlePage({ 
  params 
}: { 
  params: Promise<PageParams> 
}) {
  // CRITICAL FIX: Await the params
  const { slug } = await params;
  
  const article: FullArticle | null = await fetchArticleBySlug(slug);
  
  if (!article) notFound();

  // Fetch related articles
  const related: NewsCardProps[] = await fetchRelatedArticles(article.categorySlug, article._id);

  // 3. Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.excerpt,
    "image": [article.mainImage],
    "datePublished": article.publishedAt,
    "dateModified": article._updatedAt,
    "author": [{
      "@type": "Person",
      "name": article.authorName,
      "url": `https://kurunzinews.co.ke/auth/${article.authorSlug}`
    }],
    "publisher": {
      "@type": "Organization",
      "name": "Kurunzi News",
      "logo": {
        "@type": "ImageObject",
        "url": "https://kurunzinews.co.ke/logo.png"
      }
    }
  };

  return (
    <article className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
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
            {article.authorImage ? (
              <Image 
                src={article.authorImage} 
                alt={article.authorName} 
                fill 
                className="object-cover" 
              />
            ) : (
              <div className="w-full h-full bg-slate-200 flex items-center justify-center text-xs font-bold">KN</div>
            )}
          </div>
          <div className="text-sm">
            <Link href={`/auth/${article.authorSlug}`} className="font-bold text-slate-900 hover:text-pd-red">
              By {article.authorName}
            </Link>
            <p className="text-slate-500 uppercase text-[10px] font-bold tracking-tighter">
              Published {new Date(article.publishedAt).toLocaleDateString('en-KE', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Body (8 Cols) */}
        <div className="lg:col-span-8">
          <div className="relative aspect-video w-full mb-10 overflow-hidden rounded-2xl shadow-2xl bg-slate-100">
            <Image 
              src={article.mainImage} 
              alt={article.title} 
              fill 
              priority 
              className="object-cover" 
            />
          </div>

          <div className="prose prose-lg prose-slate max-w-none">
            <CustomPortableText value={article.body} />
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t flex flex-wrap gap-2">
            {article.tags?.map((tag) => (
              <Link 
                key={tag.slug} 
                href={`/topic/${tag.slug}`}
                className="bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-tight hover:bg-pd-red hover:text-white transition-colors"
              >
                #{tag.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar (4 Cols) */}
        <aside className="lg:col-span-4 space-y-12">
          <div className="sticky top-28">
            <h4 className="text-xl font-black border-b-4 border-pd-red w-fit pb-1 mb-6 uppercase">Related Stories</h4>
            <div className="flex flex-col gap-6">
              {related.map((post: NewsCardProps) => (
                <Link 
                  key={post.slug} 
                  href={`/${post.category}/${post.slug}`} 
                  className="group flex gap-4"
                >
                  <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-100">
                    <Image 
                      src={post.image} 
                      alt={post.title} 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  <h5 className="font-bold text-sm leading-snug group-hover:text-pd-red transition-colors line-clamp-3">
                    {post.title}
                  </h5>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}