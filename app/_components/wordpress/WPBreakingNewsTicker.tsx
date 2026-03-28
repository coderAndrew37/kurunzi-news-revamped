import ArticleLink from "@/app/_components/wordpress/WPArticleLink";
import { getSportsPosts } from "@/lib/wordpress/wp-api";

export default async function BreakingNewsTicker() {
  const allPosts = await getSportsPosts();

  // Filter for posts specifically flagged as "isBreaking" in WordPress
  const breakingArticles = allPosts
    .filter((post) => post.newsData.isBreaking)
    .slice(0, 5);

  if (!breakingArticles.length) return null;

  return (
    <div className="relative bg-gray-900 text-white overflow-hidden border-b border-red-600">
      {/* Gradient overlays for smooth edges during animation */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-900 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-900 to-transparent z-10" />

      <div className="relative flex items-center h-10">
        {/* Breaking News Label */}
        <div className="flex-shrink-0 bg-red-600 h-full flex items-center px-4 z-20">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              BREAKING
            </span>
          </div>
        </div>

        {/* Ticker Content */}
        <div className="flex-1 overflow-hidden py-1">
          <div className="flex whitespace-nowrap items-center">
            {/* Ensure 'animate-ticker' is defined in your globals.css or tailwind.config.js */}
            <div className="flex animate-ticker gap-12 pl-8 hover:[animation-play-state:paused]">
              {breakingArticles.map((article, index) => (
                <div key={article.slug} className="flex items-center">
                  <ArticleLink
                    categorySlug={article.category}
                    slug={article.slug}
                    className="flex items-center gap-3 group"
                  >
                    <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">
                      {article.title}
                    </span>
                    {index < breakingArticles.length - 1 && (
                      <span className="text-red-500 font-bold ml-4">/</span>
                    )}
                  </ArticleLink>
                </div>
              ))}

              {/* Duplicate for seamless looping if the list is short */}
              {breakingArticles.map((article) => (
                <div
                  key={`${article.slug}-clone`}
                  className="flex items-center lg:hidden"
                >
                  <span className="text-xs font-bold text-gray-300 pr-12">
                    {article.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
