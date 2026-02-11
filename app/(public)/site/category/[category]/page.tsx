import { fetchCategoryArchive, POSTS_PER_PAGE } from "@/lib/sanity/api";
import { mapPostToUi } from "@/lib/sanity/mapper";
import { NewsCardProps } from "@/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleListItem from "@/app/_components/ArticleListItem";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function CategoryArchivePage({
  params,
  searchParams,
}: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const categorySlug = resolvedParams.category;
  const currentPage = parseInt(resolvedSearchParams.page || "1");

  const data = await fetchCategoryArchive(categorySlug, currentPage);

  if (!data || !data.category) {
    notFound();
  }

  const posts = data.posts.map(mapPostToUi);
  const totalPages = Math.ceil(data.total / POSTS_PER_PAGE);
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 min-h-screen">
      {/* Archive Header */}
      <header className="mb-12 border-b pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900">
              {data.category.title} <span className="text-pd-red">Archive</span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              {data.total} article{data.total !== 1 ? "s" : ""} • Page{" "}
              {currentPage} of {totalPages}
            </p>
          </div>

          {/* Category Navigation */}
          <Link
            href={`/${categorySlug}`}
            className="text-pd-red font-bold text-sm uppercase tracking-widest hover:text-black transition-colors"
          >
            ← Latest {data.category.title}
          </Link>
        </div>
      </header>

      {/* Article List */}
      {posts.length > 0 ? (
        <div className="flex flex-col gap-6">
          {posts.map((post: NewsCardProps) => (
            <ArticleListItem key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[2rem]">
          <p className="text-slate-400 font-bold uppercase tracking-widest italic text-sm">
            No articles found in this archive.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-16 flex flex-col items-center gap-6">
          <div className="flex items-center gap-4">
            {/* Previous Button */}
            {hasPrevious ? (
              <Link
                href={`/category/${categorySlug}/archive?page=${currentPage - 1}`}
                className="px-6 py-3 bg-black text-white rounded-full hover:bg-pd-red transition-all flex items-center gap-2 text-sm font-bold uppercase tracking-wider"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Link>
            ) : (
              <div className="px-6 py-3 bg-slate-100 text-slate-400 rounded-full flex items-center gap-2 text-sm font-bold uppercase tracking-wider cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
                Previous
              </div>
            )}

            {/* Page Numbers */}
            <div className="hidden md:flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show pages around current page
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else {
                  const start = Math.max(1, currentPage - 2);
                  const end = Math.min(totalPages, start + 4);
                  if (i < end - start + 1) {
                    pageNum = start + i;
                  }
                }
                return pageNum ? (
                  <Link
                    key={pageNum}
                    href={`/category/${categorySlug}/archive?page=${pageNum}`}
                    className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-colors ${
                      pageNum === currentPage
                        ? "bg-pd-red text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {pageNum}
                  </Link>
                ) : null;
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="text-slate-400">...</span>
                  <Link
                    href={`/category/${categorySlug}/archive?page=${totalPages}`}
                    className="w-10 h-10 flex items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 font-bold"
                  >
                    {totalPages}
                  </Link>
                </>
              )}
            </div>

            {/* Next Button */}
            {hasNext ? (
              <Link
                href={`/category/${categorySlug}/archive?page=${currentPage + 1}`}
                className="px-6 py-3 bg-black text-white rounded-full hover:bg-pd-red transition-all flex items-center gap-2 text-sm font-bold uppercase tracking-wider"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="px-6 py-3 bg-slate-100 text-slate-400 rounded-full flex items-center gap-2 text-sm font-bold uppercase tracking-wider cursor-not-allowed">
                Next
                <ChevronRight className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Mobile Page Indicator */}
          <div className="md:hidden text-sm text-slate-500 font-medium">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}
    </main>
  );
}
