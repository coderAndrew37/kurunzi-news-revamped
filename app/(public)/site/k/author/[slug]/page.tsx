// app/author/[slug]/page.tsx
import { fetchAuthorProfile } from "@/lib/sanity/api";
import { urlFor } from "@/lib/sanity/image";
import { mapPostToUi } from "@/lib/sanity/mapper";
import { NewsCardProps } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SanityImage from "@/app/_components/SanityImage"; // reuse if possible

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = await fetchAuthorProfile(slug);

  if (!author) notFound();

  const posts: NewsCardProps[] = author.posts.map(mapPostToUi);

  return (
    <main className="max-w-5xl mx-auto px-4 py-16">
      {/* Author Header – refined */}
      <section className="flex flex-col md:flex-row items-center gap-8 mb-16 border-b border-gray-200 pb-12">
        <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
          {author.image ? (
            <SanityImage
              asset={author.image}
              alt={author.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-4xl font-bold">
              {author.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            {author.name}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
            {author.bio}
          </p>
        </div>
      </section>

      {/* Author's Articles */}
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Articles by {author.name}
        </h2>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {posts.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-3xl">
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
            No articles published yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/${post.category}/${post.slug}`}
              className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image container with improved border */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100 border-b border-gray-200">
                <SanityImage
                  asset={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Category badge */}
                <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-md">
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 mb-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3 font-serif">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs font-medium text-gray-500">
                    {post.date}
                  </span>
                  <span className="text-red-600 text-xs font-bold group-hover:text-red-700">
                    Read full story →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
