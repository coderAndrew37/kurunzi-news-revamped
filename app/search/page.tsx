
import Link from "next/link";
import Image from "next/image";
import { searchArticles } from "@/lib/sanity/api";
import { mapPostToUi } from "@/lib/sanity/mapper";
import { NewsCardProps } from "@/types";

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || "";
  const rawResults = query ? await searchArticles(query) : [];
  const results: NewsCardProps[] = rawResults.map(mapPostToUi);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-3xl font-black uppercase mb-8">
        Search Results for: <span className="text-pd-red">"{query}"</span>
      </h1>

      {results.length > 0 ? (
        <div className="flex flex-col gap-8">
          {results.map((post: NewsCardProps) => (
            <Link key={post.slug} href={`/${post.category}/${post.slug}`} className="group flex gap-6 border-b pb-6">
              <div className="flex-1">
                <h2 className="text-xl font-bold group-hover:text-pd-red transition">{post.title}</h2>
                <p className="text-slate-500 text-sm line-clamp-2 mt-2">{post.excerpt}</p>
                <span className="text-[10px] font-bold uppercase mt-4 block text-slate-400">{post.date}</span>
              </div>
              <div className="relative w-32 h-20 flex-shrink-0">
                <Image src={post.image} alt={post.title} fill className="object-cover rounded" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-slate-500 italic">No articles found matching your search.</p>
        </div>
      )}
    </main>
  );
}