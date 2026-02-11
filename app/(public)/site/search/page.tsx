// app/search/page.tsx
import { searchArticles } from "@/lib/sanity/api";
import { mapPostToUi } from "@/lib/sanity/mapper";
import { NewsCardProps } from "@/types";
import ArticleListItem from "@/app/_components/ArticleListItem";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";

  const rawResults = query ? await searchArticles(query) : [];
  const results: NewsCardProps[] = rawResults.map(mapPostToUi);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-3xl font-black uppercase mb-8 italic tracking-tighter">
        Search Results for: <span className="text-pd-red">"{query}"</span>
      </h1>

      {results.length > 0 ? (
        <div className="flex flex-col gap-6">
          {results.map((post: NewsCardProps, index) => (
            <ArticleListItem
              key={post.slug}
              post={post}
              priority={index < 2} // Prioritize first two images
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-4xl">
          <p className="text-slate-400 font-bold uppercase tracking-widest italic text-sm">
            No articles found matching your search.
          </p>
          {query && (
            <p className="text-slate-500 mt-2 text-sm">
              Try adjusting your keywords or browse our{" "}
              <a href="/" className="text-pd-red hover:underline">
                latest news
              </a>
              .
            </p>
          )}
        </div>
      )}
    </main>
  );
}
