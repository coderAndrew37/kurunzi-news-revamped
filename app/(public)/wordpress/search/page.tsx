import { searchArticles } from "@/lib/wordpress/wp-api";
import ArticleListItem from "@/app/_components/wordpress/WPArticleListItem";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: query } = await searchParams;
  const results = query ? await searchArticles(query) : [];

  return (
    <main className="max-w-4xl mx-auto px-4 py-16 min-h-screen bg-[#fdfcfb]">
      {/* Search Header */}
      <header className="mb-12 border-b-2 border-[#e8e2da] pb-10">
        <div className="flex items-center gap-3 mb-4 text-[#1a5c38]">
          <Search className="w-6 h-6" />
          <span className="kn-kicker !mb-0">Database Search</span>
        </div>

        <h1 className="kn-headline text-3xl md:text-5xl uppercase tracking-tighter">
          Results for:{" "}
          <span className="text-[#1a5c38]">"{query || "..."}"</span>
        </h1>

        <p className="font-['Source_Serif_4'] text-[#7a736c] italic mt-2">
          Found {results.length} relevant entries in the Kurunzi Sports
          archives.
        </p>
      </header>

      {/* Results Section */}
      {results.length > 0 ? (
        <div className="flex flex-col gap-8">
          {results.map((post: any, index: number) => (
            <ArticleListItem key={post.slug} post={post} priority={index < 2} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center border-2 border-dashed border-[#e8e2da] bg-white rounded-sm">
          <div className="max-w-xs mx-auto">
            <p className="font-['Barlow_Condensed'] text-[#b5aea7] font-bold uppercase tracking-[0.2em] text-sm mb-4">
              No matches found
            </p>
            <p className="text-[#7a736c] text-sm mb-6 font-['Source_Serif_4']">
              Try searching for teams, players, or specific tournaments.
            </p>
            <a
              href="/"
              className="kn-action-btn inline-block bg-[#1a5c38] text-white px-6 py-2 rounded-full"
            >
              Return Home
            </a>
          </div>
        </div>
      )}
    </main>
  );
}
