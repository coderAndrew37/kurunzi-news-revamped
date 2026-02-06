import { fetchLatestArticles } from "@/lib/sanity/api";
import ArticleLink from "@/app/_components/ArticleLink";
import { NewsCardProps } from "@/types";

export default async function BreakingNewsTicker() {
  const articles: NewsCardProps[] = await fetchLatestArticles(5);
  if (!articles.length) return null;

  return (
    <div className="bg-black text-white h-10 flex items-center overflow-hidden border-y border-white/10">
      {/* Label */}
      <div className="bg-pd-ticker px-4 h-full flex items-center z-10 relative shadow-[10px_0_15px_rgba(0,0,0,0.5)]">
        <span className="text-[10px] font-black uppercase tracking-tighter whitespace-nowrap animate-pulse">
          Breaking News
        </span>
      </div>

      {/* Ticker */}
      <div className="flex whitespace-nowrap items-center hover:[animation-play-state:paused]">
        {[0, 1].map((loop) => (
          <div
            key={loop}
            className="flex animate-ticker gap-10 pl-10"
            aria-hidden={loop === 1 ? "true" : undefined}
          >
            {articles.map((article) => (
              <ArticleLink
                key={`${loop}-${article.slug}`}
                categorySlug={article.category}
                slug={article.slug}
                className="flex items-center gap-2 group"
              >
                <span className="text-pd-ticker font-black text-lg">•</span>
                <span className="text-xs font-bold uppercase tracking-tight group-hover:text-pd-ticker transition-colors">
                  {article.title}
                </span>
              </ArticleLink>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
