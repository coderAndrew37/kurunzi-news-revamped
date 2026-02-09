// app/search/page.tsx
import Link from "next/link";
import Image from "next/image";
import { searchArticles } from "@/lib/sanity/api";
import { mapPostToUi } from "@/lib/sanity/mapper";
import { NewsCardProps } from "@/types";
import { urlFor } from "@/lib/sanity/image"; // 1. Import your helper

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>; // 2. Update to Promise for Next.js 15
}) {
  const resolvedParams = await searchParams; // 3. Await searchParams
  const query = resolvedParams.q || "";

  const rawResults = query ? await searchArticles(query) : [];
  const results: NewsCardProps[] = rawResults.map(mapPostToUi);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-3xl font-black uppercase mb-8 italic">
        Search Results for: <span className="text-pd-red">"{query}"</span>
      </h1>

      {results.length > 0 ? (
        <div className="flex flex-col gap-8">
          {results.map((post: NewsCardProps) => (
            <Link
              key={post.slug}
              href={`/${post.category}/${post.slug}`}
              className="group flex gap-6 border-b pb-6 border-slate-100 transition-all hover:bg-slate-50/50 p-2 rounded-xl"
            >
              <div className="flex-1">
                <h2 className="text-xl font-bold group-hover:text-pd-red transition tracking-tight">
                  {post.title}
                </h2>
                <p className="text-slate-500 text-sm line-clamp-2 mt-2 font-medium">
                  {post.excerpt}
                </p>
                <span className="text-[10px] font-black uppercase mt-4 block text-slate-400 tracking-widest">
                  {post.date}
                </span>
              </div>
              <div className="relative w-32 h-24 shrink-0 overflow-hidden rounded-lg bg-slate-100 shadow-sm">
                <Image
                  // 4. FIX: Transform SanityImage object to URL string
                  src={
                    typeof post.image === "string"
                      ? post.image
                      : urlFor(post.image).url()
                  }
                  alt={post.title}
                  fill
                  sizes="128px"
                  className="object-cover transition duration-500 group-hover:scale-110"
                />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[2rem]">
          <p className="text-slate-400 font-bold uppercase tracking-widest italic text-sm">
            No articles found matching your search.
          </p>
        </div>
      )}
    </main>
  );
}
