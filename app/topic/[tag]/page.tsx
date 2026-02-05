
import { fetchPostsByTag, POSTS_PER_PAGE } from "@/lib/sanity/api";
import { mapPostToUi } from "@/lib/sanity/mapper";
import { NewsCardProps } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface TagPageProps {
  params: { tag: string };
  searchParams: { page?: string };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { tag } = params;
  const currentPage = parseInt(searchParams.page || "1");
  const data = await fetchPostsByTag(tag, currentPage);

  // If no posts found, we can show a 404 or a "No results" state
  if (data.total === 0) notFound();

  const posts: NewsCardProps[] = data.posts.map(mapPostToUi);
  const totalPages = Math.ceil(data.total / POSTS_PER_PAGE);
  const decodedTagName = decodeURIComponent(tag);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Topic Header */}
      <header className="mb-12">
        <div className="flex items-center gap-2 text-pd-red font-bold uppercase text-sm mb-2">
          <span className="bg-pd-red text-white px-2 py-0.5 rounded">Topic</span>
          <div className="h-[1px] flex-grow bg-slate-200" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black uppercase text-slate-900">
          #{decodedTagName}
        </h1>
        <p className="text-slate-500 mt-4 font-medium italic">
          Everything we&apos;ve published about <strong>{decodedTagName}</strong>.
        </p>
      </header>

      {/* Results List */}
      <div className="flex flex-col gap-10">
        {posts.map((post) => (
          <Link 
            key={post.slug} 
            href={`/${post.category}/${post.slug}`}
            className="group flex flex-row gap-6 items-start"
          >
            <div className="flex-1 space-y-2">
              <span className="text-pd-green font-bold text-[10px] uppercase tracking-widest">
                {post.category}
              </span>
              <h2 className="text-xl md:text-2xl font-bold group-hover:text-pd-red transition-colors leading-tight">
                {post.title}
              </h2>
              <p className="text-slate-600 line-clamp-2 text-sm hidden md:block">
                {post.excerpt}
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">
                {post.date}
              </p>
            </div>

            <div className="relative w-28 h-20 md:w-44 md:h-28 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 shadow-sm">
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-16 flex justify-between items-center border-t pt-8">
          {currentPage > 1 ? (
            <Link href={`?page=${currentPage - 1}`} className="font-black text-sm uppercase hover:text-pd-red transition">
              ← Newer Stories
            </Link>
          ) : <div />}

          <span className="text-xs font-bold text-slate-400">
            {currentPage} / {totalPages}
          </span>

          {currentPage < totalPages ? (
            <Link href={`?page=${currentPage + 1}`} className="font-black text-sm uppercase hover:text-pd-red transition">
              Older Stories →
            </Link>
          ) : <div />}
        </div>
      )}
    </main>
  );
}