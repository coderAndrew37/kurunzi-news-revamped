import { getPostsByTag } from "@/lib/wordpress/wp-api";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Hash } from "lucide-react";

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
          <span className="kn-kicker !mb-0 text-[#1a5c38]">Trending Topic</span>
        </div>

        <h1 className="kn-headline text-4xl md:text-5xl mb-4 uppercase tracking-tighter">
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

      {/* Article list */}
      {posts.length > 0 ? (
        <div className="flex flex-col gap-12">
          {posts.map((post: any) => {
            const category = post.categories?.nodes[0];
            return (
              <article
                key={post.slug}
                className="group grid md:grid-cols-[240px_1fr] gap-8 items-start"
              >
                {/* Thumbnail */}
                <Link
                  href={`/${category?.slug || "news"}/${post.slug}`}
                  className="kn-hero-ratio aspect-[16/9] md:aspect-[4/3] rounded-sm overflow-hidden bg-[#f7f4f0]"
                >
                  <img
                    src={
                      post.featuredImage?.node?.sourceUrl || "/placeholder.jpg"
                    }
                    alt={post.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>

                {/* Content */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-['Barlow_Condensed'] text-[10px] font-bold text-[#1a5c38] uppercase tracking-[0.2em]">
                      {category?.name || "General"}
                    </span>
                  </div>
                  <h2 className="kn-headline text-xl mb-3 group-hover:text-[#1a5c38] transition-colors leading-tight">
                    <Link href={`/${category?.slug || "news"}/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>
                  <p className="font-['Source_Serif_4'] text-[#3d3935] text-sm line-clamp-2 mb-4 leading-relaxed">
                    {post.newsData?.theLede ||
                      post.excerpt?.replace(/<[^>]+>/g, "")}
                  </p>
                  <div className="flex items-center gap-4 text-[#b5aea7] font-['Barlow_Condensed'] font-bold text-[10px] uppercase tracking-widest">
                    <span>
                      {new Date(post.date).toLocaleDateString("en-KE", {
                        dateStyle: "long",
                      })}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
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
            className="kn-action-btn bg-black text-white px-10 py-4 rounded-full flex items-center gap-3 hover:bg-[#1a5c38] transition-all"
          >
            Explore More {tagName}
            <ChevronRight className="w-5 h-5" />
          </Link>
        </nav>
      )}
    </main>
  );
}
