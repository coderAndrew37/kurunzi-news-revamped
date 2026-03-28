import { getCategoryArchive } from "@/lib/wordpress/wp-api";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

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

  // Using the new cursor-based function
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
            <span className="kn-kicker">Digital Archive</span>
            <h1 className="kn-headline text-4xl mb-2 uppercase">
              {categoryName} <span className="text-[#1a5c38]">History</span>
            </h1>
            <p className="font-['Source_Serif_4'] text-[#7a736c] italic">
              Browsing the {categoryName} records
            </p>
          </div>

          <Link
            href={`/${categorySlug}`}
            className="kn-action-btn hover:bg-[#1a5c38] hover:text-white"
          >
            ← Latest {categoryName}
          </Link>
        </div>
      </header>

      {/* Article List */}
      <div className="flex flex-col gap-12">
        {posts.map((post: any) => (
          <article
            key={post.slug}
            className="group grid md:grid-cols-[200px_1fr] gap-8 items-start"
          >
            {/* Thumbnail */}
            <div className="kn-hero-ratio aspect-[4/3] rounded-sm overflow-hidden bg-[#f7f4f0]">
              <img
                src={post.featuredImage?.node?.sourceUrl || "/placeholder.jpg"}
                alt={post.title}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Content */}
            <div>
              <h2 className="kn-headline text-xl mb-3 group-hover:text-[#1a5c38] transition-colors">
                <Link href={`/${categorySlug}/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="font-['Source_Serif_4'] text-[#3d3935] line-clamp-2 mb-4 leading-relaxed">
                {post.newsData?.theLede ||
                  post.excerpt?.replace(/<[^>]+>/g, "")}
              </p>
              <div className="flex items-center gap-4 text-[#b5aea7] font-['Barlow_Condensed'] font-bold text-xs uppercase tracking-widest">
                <span>
                  {new Date(post.date).toLocaleDateString("en-KE", {
                    dateStyle: "long",
                  })}
                </span>
                <span className="w-1 h-1 bg-[#e8e2da] rounded-full" />
                <Link
                  href={`/${categorySlug}/${post.slug}`}
                  className="text-[#1a5c38] hover:underline"
                >
                  Read Story
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Cursor Pagination */}
      {pageInfo.hasNextPage && (
        <nav className="mt-20 pt-8 border-t-2 border-[#e8e2da] flex justify-center">
          <Link
            href={`/category/${categorySlug}?cursor=${pageInfo.endCursor}`}
            className="kn-action-btn bg-black text-white px-10 py-4 rounded-full flex items-center gap-3 hover:bg-[#1a5c38] transition-all"
          >
            Load Older Stories
            <ChevronRight className="w-5 h-5" />
          </Link>
        </nav>
      )}

      {/* Back to Top for Mobile */}
      {!pageInfo.hasNextPage && posts.length > 0 && (
        <div className="mt-20 text-center">
          <p className="font-['Barlow_Condensed'] text-[#b5aea7] uppercase tracking-tighter font-bold">
            End of Archive
          </p>
        </div>
      )}
    </main>
  );
}
