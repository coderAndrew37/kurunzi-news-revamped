import Image from "next/image";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { SportsPost } from "@/lib/wordpress/wp-api";
import ArticleLink from "./WPArticleLink";

interface HeroSectionProps {
  article: SportsPost;
  priority?: boolean;
}

export default function HeroSection({
  article,
  priority = true,
}: HeroSectionProps) {
  if (!article) return null;

  // Formatting the date for Kenyan audience
  const formattedDate = new Date(article.date).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="relative bg-white border-b border-gray-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="lg:col-span-5 order-2 lg:order-1 space-y-6">
            <div className="flex items-center gap-3">
              <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-sm uppercase tracking-[0.2em] flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Developing
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-l pl-3 border-gray-200">
                {/* Fallback to Sports if category is missing */}
                Sports News
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight">
              <ArticleLink
                slug={article.slug}
                className="hover:text-red-600 transition-colors duration-300"
              >
                {article.title}
              </ArticleLink>
            </h1>

            {article.newsData.theLede && (
              <p className="text-lg text-gray-600 leading-relaxed font-serif line-clamp-3">
                {article.newsData.theLede}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 pt-6 text-gray-500 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-red-600" />
                <span className="text-xs font-bold uppercase tracking-tighter">
                  {formattedDate}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-600" />
                <span className="text-xs font-bold uppercase tracking-tighter">
                  Quick Read
                </span>
              </div>

              <ArticleLink
                slug={article.slug}
                className="ml-auto inline-flex items-center gap-2 text-red-600 hover:text-black font-black text-[10px] uppercase tracking-[0.2em] transition-all group"
              >
                Read Story
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </ArticleLink>
            </div>
          </div>

          {/* Image Content */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <ArticleLink
              slug={article.slug}
              className="block group relative overflow-hidden rounded-xl bg-gray-100 shadow-2xl"
            >
              <div className="relative aspect-video lg:aspect-4/3 xl:aspect-16/10 w-full">
                <Image
                  src={
                    article.featuredImage?.node.sourceUrl ||
                    "/images/placeholder.jpg"
                  }
                  alt={article.title}
                  fill
                  priority={priority}
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              {/* Subtle Overlay for depth */}
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-xl" />
            </ArticleLink>
          </div>
        </div>
      </div>
    </section>
  );
}
