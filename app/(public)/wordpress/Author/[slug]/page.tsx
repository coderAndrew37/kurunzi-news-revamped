import { getAuthorProfile } from "@/lib/wordpress/wp-api";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import ArticleListItem from "@/app/_components/wordpress/WPArticleListItem";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ cursor?: string }>;
}

export default async function AuthorPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { cursor } = await searchParams;

  const { author, posts, pageInfo } = await getAuthorProfile(
    slug,
    10,
    cursor || null,
  );

  if (!author) notFound();

  return (
    <main className="max-w-5xl mx-auto px-4 py-16 min-h-screen bg-[#fdfcfb]">
      {/* Author Header */}
      <section className="flex flex-col md:flex-row items-center gap-8 mb-16 border-b-2 border-[#e8e2da] pb-12">
        <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-white shadow-lg bg-[#f7f4f0]">
          {author.avatar?.url ? (
            <Image
              src={author.avatar.url}
              alt={author.name}
              className="object-cover w-full h-full"
              width={176}
              height={176}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#1a5c38] text-white text-4xl font-bold font-['Barlow_Condensed']">
              {author.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="text-center md:text-left flex-1">
          <span className="kn-kicker text-[#1a5c38] font-bold uppercase tracking-widest text-xs">
            Staff Writer
          </span>
          <h1 className="kn-headline text-4xl md:text-5xl mb-3 uppercase tracking-tighter text-[#0d0d0d]">
            {author.name}
          </h1>
          <p className="font-['Source_Serif_4'] text-lg text-[#3d3935] leading-relaxed max-w-2xl italic">
            {author.description ||
              `${author.name} is a contributor to Kurunzi Sports.`}
          </p>
        </div>
      </section>

      {/* Author's Articles Section */}
      <div className="flex items-center gap-4 mb-12">
        <h2 className="kn-headline text-2xl uppercase text-[#0d0d0d]">
          Latest from {author.name.split(" ")[0]}
        </h2>
        <div className="h-[2px] flex-1 bg-[#e8e2da]" />
      </div>

      {posts.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-[#e8e2da] rounded-sm">
          <p className="font-['Barlow_Condensed'] text-[#b5aea7] font-bold uppercase tracking-widest text-sm">
            No stories filed yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {posts.map((post: any) => (
            <ArticleListItem key={post.slug} post={post} />
          ))}
        </div>
      )}

      {/* Cursor Pagination */}
      {pageInfo.hasNextPage && (
        <nav className="mt-20 pt-8 border-t-2 border-[#e8e2da] flex justify-center">
          <Link
            href={`/author/${slug}?cursor=${pageInfo.endCursor}`}
            className="bg-black text-white px-10 py-4 rounded-full flex items-center gap-3 hover:bg-[#1a5c38] transition-all font-bold uppercase text-sm tracking-widest"
          >
            Load More Stories
            <ChevronRight className="w-5 h-5" />
          </Link>
        </nav>
      )}
    </main>
  );
}
