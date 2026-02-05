
import { fetchAuthorProfile } from "@/lib/sanity/api";
import { urlFor } from "@/lib/sanity/image";
import { mapPostToUi } from "@/lib/sanity/mapper";
import { NewsCardProps } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AuthorPage({ params }: { params: { slug: string } }) {
  const author = await fetchAuthorProfile(params.slug);
  if (!author) notFound();

  const posts: NewsCardProps[] = author.posts.map(mapPostToUi);

  return (
    <main className="max-w-5xl mx-auto px-4 py-16">
      {/* Author Header */}
      <section className="flex flex-col md:flex-row items-center gap-8 mb-16 border-b pb-12">
        <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-xl">
          <Image src={author.image ? urlFor(author.image).url() : "/placeholder.png"} alt={author.name} fill className="object-cover" />
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="text-4xl font-black text-slate-900 mb-4">{author.name}</h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">{author.bio}</p>
        </div>
      </section>

      {/* Author's Feed */}
      <h2 className="text-2xl font-black uppercase mb-8 flex items-center gap-4">
        Articles by {author.name}
        <div className="h-1 flex-grow bg-pd-green" />
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post: NewsCardProps) => (
          <Link key={post.slug} href={`/${post.category}/${post.slug}`} className="group">
            <div className="relative aspect-video mb-4 overflow-hidden rounded-xl">
              <Image src={post.image} alt={post.title} fill className="object-cover transition group-hover:scale-105" />
            </div>
            <h3 className="text-xl font-bold leading-tight group-hover:text-pd-red transition">{post.title}</h3>
            <p className="text-xs text-slate-400 font-bold uppercase mt-2">{post.date}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}