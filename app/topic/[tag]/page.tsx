import { fetchPostsByTag, POSTS_PER_PAGE } from "@/lib/sanity/api";
import { mapPostToUi } from "@/lib/sanity/mapper";
import { NewsCardProps, Post } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { urlFor } from "@/lib/sanity/image";

// Defining the specific structure returned by the tag query
interface TagResponse {
  posts: Post[];
  total: number;
}

interface TagPageProps {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page?: string }>;
}

/**
 * Helper to resolve images specifically for the listing layout
 */
const resolveThumbnailUrl = (image: NewsCardProps["image"]): string => {
  if (!image) return "/fallback-news.jpg";
  if (typeof image === "string") return image;
  try {
    return urlFor(image).width(400).height(260).url();
  } catch {
    return "/fallback-news.jpg";
  }
};

export default async function TagPage({ params, searchParams }: TagPageProps) {
  // Resolve promises for Next.js 15 compatibility
  const { tag } = await params;
  const sParams = await searchParams;

  const currentPage = parseInt(sParams.page || "1");
  const data: TagResponse = await fetchPostsByTag(tag, currentPage);

  // DEBUG HERE:
  console.log("Tag Search Term:", tag);
  console.log("Data Received:", data);

  // If no posts found, show a 404
  if (!data || data.total === 0) notFound();

  const posts: NewsCardProps[] = data.posts.map(mapPostToUi);
  const totalPages = Math.ceil(data.total / POSTS_PER_PAGE);
  const decodedTagName = decodeURIComponent(tag).replace("-", " ");

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Topic Header */}
      <header className="mb-12">
        <div className="flex items-center gap-3 text-pd-red font-bold uppercase text-xs mb-3 tracking-widest">
          <span className="bg-pd-red text-white px-2 py-1 rounded-sm">
            Topic
          </span>
          <div className="h-[1px] flex-grow bg-slate-100" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black uppercase text-slate-900 italic">
          #{decodedTagName}
        </h1>
        <p className="text-slate-500 mt-4 text-lg font-serif">
          The latest investigative reports, news, and updates regarding
          <span className="text-slate-900 font-bold ml-1">
            {decodedTagName}
          </span>
          .
        </p>
      </header>

      {/* Results List */}
      <div className="flex flex-col border-t border-slate-100">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/${post.category}/${post.slug}`}
            className="group flex flex-row gap-6 items-start py-10 border-b border-slate-100 last:border-0"
          >
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-pd-red font-black text-[10px] uppercase tracking-widest">
                  {post.category}
                </span>
                <span className="text-slate-300 text-xs">•</span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                  {post.date}
                </p>
              </div>

              <h2 className="text-xl md:text-2xl font-bold group-hover:text-pd-red transition-colors leading-tight text-slate-900">
                {post.title}
              </h2>

              {post.excerpt && (
                <p className="text-slate-600 line-clamp-2 text-sm leading-relaxed font-serif hidden md:block">
                  {post.excerpt}
                </p>
              )}
            </div>

            <div className="relative w-28 h-20 md:w-52 md:h-32 flex-shrink-0 overflow-hidden rounded-xl bg-slate-50 shadow-sm border border-slate-100">
              <Image
                src={resolveThumbnailUrl(post.image)}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 112px, 208px"
              />
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav
          className="mt-16 flex justify-between items-center border-t-2 border-slate-900 pt-8"
          aria-label="Pagination"
        >
          {currentPage > 1 ? (
            <Link
              href={`/topic/${tag}?page=${currentPage - 1}`}
              className="font-black text-xs uppercase bg-slate-900 text-white px-4 py-2 hover:bg-pd-red transition"
            >
              ← Newer
            </Link>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Page
            </span>
            <span className="text-sm font-black text-slate-900">
              {currentPage} <span className="text-slate-300 mx-1">/</span>{" "}
              {totalPages}
            </span>
          </div>

          {currentPage < totalPages ? (
            <Link
              href={`/topic/${tag}?page=${currentPage + 1}`}
              className="font-black text-xs uppercase bg-slate-900 text-white px-4 py-2 hover:bg-pd-red transition"
            >
              Older →
            </Link>
          ) : (
            <div />
          )}
        </nav>
      )}
    </main>
  );
}
