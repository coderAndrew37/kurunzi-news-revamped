import { fetchLatestArticles } from "@/lib/sanity/api";
import ArticleLink from "@/app/_components/ArticleLink";
import { NewsCardProps } from "@/types";

export default async function BreakingNewsTicker() {
  const articles: NewsCardProps[] = await fetchLatestArticles(5);
  if (!articles.length) return null;

  return (
    <div className="relative bg-gray-900 text-white overflow-hidden border-b border-red-600">
      {/* Gradient overlays for smooth edges */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-900 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-900 to-transparent z-10" />

      <div className="relative flex items-center h-9">
        {/* Breaking News Label */}
        <div className="flex-shrink-0 bg-red-600 h-full flex items-center px-4 z-20">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider">
              BREAKING
            </span>
          </div>
        </div>

        {/* Ticker Content */}
        <div className="flex-1 overflow-hidden py-1">
          <div className="flex whitespace-nowrap items-center">
            <div className="flex animate-ticker gap-8 pl-8 hover:[animation-play-state:paused]">
              {articles.map((article, index) => (
                <div key={article.slug} className="flex items-center">
                  <ArticleLink
                    categorySlug={article.category}
                    slug={article.slug}
                    className="flex items-center gap-3 group"
                  >
                    <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors">
                      {article.title}
                    </span>
                    {index < articles.length - 1 && (
                      <span className="text-red-400 text-lg">•</span>
                    )}
                  </ArticleLink>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
