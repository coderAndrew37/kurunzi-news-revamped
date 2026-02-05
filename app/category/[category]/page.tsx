
import { fetchCategoryArchive, POSTS_PER_PAGE } from "@/lib/sanity/api";
import { mapPostToUi } from "@/lib/sanity/mapper";
import { NewsCardProps } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CategoryArchivePage({ 
  params, 
  searchParams 
}: { 
  params: { category: string },
  searchParams: { page?: string }
}) {
  const currentPage = parseInt(searchParams.page || "1");
  const data = await fetchCategoryArchive(params.category, currentPage);

  if (!data.category) notFound();

  const posts = data.posts.map(mapPostToUi);
  const totalPages = Math.ceil(data.total / POSTS_PER_PAGE);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-12 border-b pb-6">
        <h1 className="text-4xl font-black uppercase text-slate-900">
          {data.category.title} <span className="text-pd-red">Archive</span>
        </h1>
        <p className="text-slate-500 mt-2 font-medium">
          Showing {posts.length} of {data.total} total articles
        </p>
      </header>

      {/* Article List */}
      <div className="flex flex-col gap-8">
        {posts.map((post:NewsCardProps) => (
          <Link 
            key={post.slug} 
            href={`/${params.category}/${post.slug}`}
            className="group flex flex-row gap-6 items-start border-b pb-8 border-slate-100"
          >
            {/* Left: Text Content */}
            <div className="flex-1 space-y-2">
              <span className="text-pd-red font-bold text-xs uppercase tracking-widest">
                {post.category}
              </span>
              <h2 className="text-xl md:text-2xl font-bold group-hover:text-pd-red transition-colors leading-tight">
                {post.title}
              </h2>
              <p className="text-slate-600 line-clamp-2 text-sm md:text-base hidden md:block">
                {post.excerpt}
              </p>
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
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
          </Link>
        ))}
      </div>

      {/* Simple Pagination */}
      <div className="mt-16 flex justify-between items-center font-bold text-sm">
        {currentPage > 1 ? (
          <Link 
            href={`?page=${currentPage - 1}`} 
            className="px-6 py-3 bg-black text-white rounded-full hover:bg-pd-red transition-all"
          >
            ← Previous
          </Link>
        ) : <div />}

        <span className="text-slate-400 uppercase tracking-widest">
          Page {currentPage} of {totalPages}
        </span>

        {currentPage < totalPages ? (
          <Link 
            href={`?page=${currentPage + 1}`} 
            className="px-6 py-3 bg-black text-white rounded-full hover:bg-pd-red transition-all"
          >
            Next →
          </Link>
        ) : <div />}
      </div>
    </main>
  );
}