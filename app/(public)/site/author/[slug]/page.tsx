// app/author/[slug]/page.tsx
import { fetchAuthorProfile } from "@/lib/sanity/api";
import { urlFor } from "@/lib/sanity/image";
import { mapPostToUi } from "@/lib/sanity/mapper";
import { NewsCardProps } from "@/types";
import Image from "next/image";
import { notFound } from "next/navigation";
import ArticleLink from "@/app/_components/ArticleLink"; // Use your custom component

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // Await params for Next.js 15
  const author = await fetchAuthorProfile(slug);

  if (!author) notFound();

  const posts: NewsCardProps[] = author.posts.map(mapPostToUi);

  return (
    <main className="max-w-5xl mx-auto px-4 py-16">
      {/* Author Header */}
      <section className="flex flex-col md:flex-row items-center gap-8 mb-16 border-b pb-12">
        <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-100">
          <Image
            src={author.image ? urlFor(author.image).url() : "/placeholder.png"}
            alt={author.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter italic">
            {author.name}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl font-medium">
            {author.bio}
          </p>
        </div>
      </section>

      {/* Author's Feed */}
      <h2 className="text-2xl font-black uppercase mb-8 flex items-center gap-4 italic">
        Articles by {author.name}
        <div className="h-1 grow bg-pd-red" />
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {posts.map((post: NewsCardProps) => (
          <ArticleLink
            key={post.slug}
            categorySlug={post.category}
            slug={post.slug}
            className="group block"
          >
            <div className="relative aspect-video mb-5 overflow-hidden rounded-4xl border-4 border-slate-50 shadow-sm transition-all group-hover:shadow-xl group-hover:border-white">
              <Image
                src={urlFor(post.image).url()} // FIX: Convert Sanity Object to URL string
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition duration-500 group-hover:scale-110"
              />
            </div>
            <h3 className="text-2xl font-black leading-tight group-hover:text-pd-red transition-colors tracking-tight">
              {post.title}
            </h3>
            <div className="flex items-center gap-3 mt-3">
              <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
                {post.category}
              </span>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                {post.date}
              </p>
            </div>
          </ArticleLink>
        ))}
      </div>
    </main>
  );
}
