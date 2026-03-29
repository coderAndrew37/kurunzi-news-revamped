import { getPostsByTag } from "@/lib/wordpress/wp-api";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Hash } from "lucide-react";
import ArticleListItem from "@/app/_components/wordpress/WPArticleListItem";

interface TagPageProps {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ cursor?: string }>;
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { tag: tagSlug } = await params;
  const { cursor } = await searchParams;

  const { posts, tagInfo, pageInfo } = await getPostsByTag(
    tagSlug,
    10,
    cursor || null,
  );

  // 404 if tag doesn't exist or has no posts on initial load
  if (!tagInfo && posts.length === 0) notFound();

  const tagName =
    tagInfo?.name || decodeURIComponent(tagSlug).replace(/-/g, " ");

  return (
    <main className="max-w-4xl mx-auto px-4 py-16 min-h-screen bg-[#fdfcfb]">
      {/* Editorial Topic Header */}
      <header className="mb-16 border-b-2 border-[#e8e2da] pb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-[#1a5c38] text-white p-1.5 rounded-sm">
            <Hash className="w-4 h-4" />
          </span>
          <span className="text-[#1a5c38] font-bold uppercase tracking-[0.2em] text-[10px]">
            Trending Topic
          </span>
        </div>

        <h1 className="kn-headline text-4xl md:text-5xl mb-4 uppercase tracking-tighter text-[#0d0d0d]">
          {tagName}
        </h1>

        <p className="font-['Source_Serif_4'] text-[#3d3935] text-lg leading-relaxed max-w-2xl italic">
          Comprehensive coverage, deep-dive analysis, and the latest updates on{" "}
          <span className="font-bold border-b border-[#1a5c38]">{tagName}</span>
          .
        </p>

        {tagInfo?.count && (
          <div className="mt-6 font-['Barlow_Condensed'] text-xs font-bold text-[#b5aea7] uppercase tracking-widest">
            {tagInfo.count} archived stories
          </div>
        )}
      </header>

      {/* Article list - Unified Component */}
      {posts.length > 0 ? (
        <div className="flex flex-col gap-2">
          {posts.map((post: any) => (
            <ArticleListItem key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center border-2 border-dashed border-[#e8e2da] bg-white rounded-sm">
          <p className="font-['Barlow_Condensed'] text-[#b5aea7] font-bold uppercase tracking-[0.3em] text-xs">
            No entries found in this digital archive.
          </p>
        </div>
      )}

      {/* Cursor Pagination */}
      {pageInfo.hasNextPage && (
        <nav className="mt-20 pt-8 border-t-2 border-[#e8e2da] flex justify-center">
          <Link
            href={`/topic/${tagSlug}?cursor=${pageInfo.endCursor}`}
            className="bg-black text-white px-10 py-4 rounded-full flex items-center gap-3 hover:bg-[#1a5c38] transition-all font-bold uppercase text-sm tracking-widest shadow-lg"
          >
            Explore More {tagName}
            <ChevronRight className="w-5 h-5" />
          </Link>
        </nav>
      )}
    </main>
  );
}
