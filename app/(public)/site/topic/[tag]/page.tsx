import { fetchPostsByTag, POSTS_PER_PAGE } from "@/lib/sanity/api";
import { mapPostToUi } from "@/lib/sanity/mapper";
import { NewsCardProps } from "@/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleListItem from "@/app/_components/ArticleListItem";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TagPageProps {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { tag } = await params;
  const sParams = await searchParams;
  const currentPage = parseInt(sParams.page || "1");

  const data = await fetchPostsByTag(tag, currentPage);

  if (!data || data.total === 0) notFound();

  const posts: NewsCardProps[] = data.posts.map(mapPostToUi);
  const totalPages = Math.ceil(data.total / POSTS_PER_PAGE);
  const decodedTagName = decodeURIComponent(tag).replace(/-/g, " ");

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 min-h-screen">
      {/* Header */}
      <header className="mb-12 border-b border-gray-200 pb-6">
        <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-widest mb-3">
          <span className="bg-red-600 text-white px-3 py-1 rounded-full">
            Topic
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
          #{decodedTagName}
        </h1>
        <p className="text-gray-600 mt-4 text-lg leading-relaxed max-w-3xl">
          Latest news, analysis and updates on{" "}
          <span className="font-semibold text-gray-900">{decodedTagName}</span>.
        </p>
        <div className="mt-3 text-sm text-gray-500">
          {data.total} article{data.total !== 1 ? "s" : ""} • Page {currentPage}{" "}
          of {totalPages}
        </div>
      </header>

      {/* Article list */}
      {posts.length > 0 ? (
        <div className="flex flex-col gap-6">
          {posts.map((post, i) => (
            <ArticleListItem key={post.slug} post={post} priority={i < 2} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-4xl">
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
            No articles found for this topic.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-16 flex flex-col items-center gap-6">
          <div className="flex items-center gap-4">
            {/* Previous */}
            {currentPage > 1 ? (
              <Link
                href={`/topic/${tag}?page=${currentPage - 1}`}
                className="px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-red-600 transition-all flex items-center gap-2 text-sm font-bold uppercase tracking-wider"
              >
                <ChevronLeft className="w-4 h-4" />
                Newer
              </Link>
            ) : (
              <div className="px-6 py-3 bg-gray-100 text-gray-400 rounded-full flex items-center gap-2 text-sm font-bold uppercase tracking-wider cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
                Newer
              </div>
            )}

            {/* Page indicator (desktop) */}
            <div className="hidden md:flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5) {
                  const start = Math.max(1, currentPage - 2);
                  const end = Math.min(totalPages, start + 4);
                  if (i < end - start + 1) pageNum = start + i;
                }
                return pageNum <= totalPages ? (
                  <Link
                    key={pageNum}
                    href={`/topic/${tag}?page=${pageNum}`}
                    className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-colors ${
                      pageNum === currentPage
                        ? "bg-red-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </Link>
                ) : null;
              })}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="text-gray-400">...</span>
                  <Link
                    href={`/topic/${tag}?page=${totalPages}`}
                    className="w-10 h-10 flex items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 font-bold"
                  >
                    {totalPages}
                  </Link>
                </>
              )}
            </div>

            {/* Next */}
            {currentPage < totalPages ? (
              <Link
                href={`/topic/${tag}?page=${currentPage + 1}`}
                className="px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-red-600 transition-all flex items-center gap-2 text-sm font-bold uppercase tracking-wider"
              >
                Older
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="px-6 py-3 bg-gray-100 text-gray-400 rounded-full flex items-center gap-2 text-sm font-bold uppercase tracking-wider cursor-not-allowed">
                Older
                <ChevronRight className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Mobile page indicator */}
          <div className="md:hidden text-sm text-gray-500 font-medium">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}
    </main>
  );
}
