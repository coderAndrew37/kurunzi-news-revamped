import { getCategoryArchive } from "@/lib/wordpress/wp-api";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import ArticleListItem from "@/app/_components/wordpress/WPArticleListItem";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ cursor?: string }>;
}

export default async function CategoryArchivePage({
  params,
  searchParams,
}: PageProps) {
  const { slug: categorySlug } = await params;
  const { cursor } = await searchParams;

  // Using the cursor-based function for infinite scroll/pagination
  const { posts, pageInfo } = await getCategoryArchive(
    categorySlug,
    10,
    cursor || null,
  );

  // 404 if no posts found on initial load
  if (posts.length === 0 && !cursor) notFound();

  const categoryName = posts[0]?.categories?.nodes[0]?.name || categorySlug;

  return (
    <main className="max-w-4xl mx-auto px-4 py-16 min-h-screen bg-[#fdfcfb]">
      {/* Editorial Archive Header */}
      <header className="mb-16 border-b-2 border-[#e8e2da] pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[#1a5c38] font-bold uppercase tracking-[0.2em] text-[10px]">
              Digital Archive
            </span>
            <h1 className="kn-headline text-4xl mb-2 uppercase text-[#0d0d0d]">
              {categoryName} <span className="text-[#1a5c38]">History</span>
            </h1>
            <p className="font-['Source_Serif_4'] text-[#7a736c] italic">
              Browsing the {categoryName} records
            </p>
          </div>

          <Link
            href={`/category/${categorySlug}`}
            className="inline-flex items-center px-6 py-2 border-2 border-[#1a5c38] text-[#1a5c38] font-bold uppercase text-xs tracking-widest hover:bg-[#1a5c38] hover:text-white transition-all rounded-sm"
          >
            ← Latest {categoryName}
          </Link>
        </div>
      </header>

      {/* Article List - Unified Component */}
      <div className="flex flex-col gap-2">
        {posts.map((post: any) => (
          <ArticleListItem key={post.slug} post={post} />
        ))}
      </div>

      {/* Cursor Pagination */}
      {pageInfo.hasNextPage && (
        <nav className="mt-20 pt-8 border-t-2 border-[#e8e2da] flex justify-center">
          <Link
            href={`/category/${categorySlug}?cursor=${pageInfo.endCursor}`}
            className="bg-black text-white px-10 py-4 rounded-full flex items-center gap-3 hover:bg-[#1a5c38] transition-all font-bold uppercase text-sm tracking-widest shadow-xl"
          >
            Load Older Stories
            <ChevronRight className="w-5 h-5" />
          </Link>
        </nav>
      )}

      {/* End of Archive Footer */}
      {!pageInfo.hasNextPage && posts.length > 0 && (
        <div className="mt-20 text-center py-10 border-t border-[#e8e2da]">
          <p className="font-['Barlow_Condensed'] text-[#b5aea7] uppercase tracking-[0.3em] font-black text-xs">
            End of Archive
          </p>
        </div>
      )}
    </main>
  );
}
