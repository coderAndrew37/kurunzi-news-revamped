import { fetchCategoryArchive, POSTS_PER_PAGE } from "@/lib/sanity/api";
import { mapPostToUi } from "@/lib/sanity/mapper";
import { NewsCardProps } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleLink from "@/app/_components/ArticleLink";

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function CategoryArchivePage({
  params,
  searchParams,
}: PageProps) {
  // 1. Await the asynchronous params (Required in Next.js 15+)
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const categorySlug = resolvedParams.category;
  const currentPage = parseInt(resolvedSearchParams.page || "1");

  // 2. Fetch data with the resolved string slug
  const data = await fetchCategoryArchive(categorySlug, currentPage);

  // 3. Safety check - if category doesn't exist in Sanity
  if (!data || !data.category) {
    notFound();
  }

  // 4. Map the raw Sanity data to our UI-friendly props
  const posts = data.posts.map(mapPostToUi);
  const totalPages = Math.ceil(data.total / POSTS_PER_PAGE);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Archive Header */}
      <header className="mb-12 border-b pb-6">
        <h1 className="text-4xl font-black uppercase text-slate-900">
          {data.category.title} <span className="text-pd-red">Archive</span>
        </h1>
        <p className="text-slate-500 mt-2 font-medium">
          Showing {posts.length} of {data.total} total articles in this category
        </p>
      </header>

      {/* Article List */}
      <div className="flex flex-col gap-8">
        {posts.map((post: NewsCardProps) => (
          <ArticleLink
            key={post.slug}
            categorySlug={post.category} // Uses the slug from the mapper
            slug={post.slug} // Uses the flattened slug string
            className="group flex flex-row gap-6 items-start border-b pb-8 border-slate-100 transition-all hover:bg-slate-50/50 p-2 -mx-2 rounded-xl"
          >
            {/* Left: Text Content */}
            <div className="flex-1 space-y-2">
              <span className="text-pd-red font-bold text-xs uppercase tracking-widest">
                {data.category.title}
              </span>
              <h2 className="text-xl md:text-2xl font-bold group-hover:text-pd-red transition-colors leading-tight">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="text-slate-600 line-clamp-2 text-sm md:text-base hidden md:block">
                  {post.excerpt}
                </p>
              )}
              <div className="text-[10px] text-slate-400 font-bold uppercase pt-2">
                {post.date}
              </div>
            </div>

            {/* Right: Image Thumbnail */}
            <div className="relative w-24 h-24 md:w-48 md:h-32 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 96px, 192px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </ArticleLink>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="mt-16 flex justify-between items-center font-bold text-sm">
        {currentPage > 1 ? (
          <Link
            href={`/${categorySlug}/archive?page=${currentPage - 1}`}
            className="px-6 py-3 bg-black text-white rounded-full hover:bg-pd-red transition-all flex items-center gap-2"
          >
            ← Previous
          </Link>
        ) : (
          <div className="w-[120px]" /> /* Spacer to keep "Page X of Y" centered */
        )}

        <span className="text-slate-400 uppercase tracking-widest">
          Page {currentPage} of {totalPages}
        </span>

        {currentPage < totalPages ? (
          <Link
            href={`/${categorySlug}/archive?page=${currentPage + 1}`}
            className="px-6 py-3 bg-black text-white rounded-full hover:bg-pd-red transition-all flex items-center gap-2"
          >
            Next →
          </Link>
        ) : (
          <div className="w-[120px]" />
        )}
      </div>
    </main>
  );
}
