import { fetchHeroPost, fetchHomepageSections } from "@/lib/sanity/api";
import { mapPostToUi } from "@/lib/sanity/mapper";
import BreakingNewsTicker from "../../_components/BreakingNews";
import NewsSection from "../../_components/NewsSection";
import HeroSection from "@/app/_components/HeroSection";

export default async function HomePage() {
  const sections = await fetchHomepageSections();
  const heroData = await fetchHeroPost();
  const heroArticle = heroData ? mapPostToUi(heroData) : null;

  return (
    <main className="flex flex-col gap-12 bg-white pb-20">
      {/* 1. Ticker stays outside the loop to render once at the top */}
      <BreakingNewsTicker />

      {/* Show Hero only if an article is flagged as 'Hero' in Sanity */}
      {heroArticle && <HeroSection article={heroArticle} />}

      {/* 2. Map through sections */}
      {sections.map((section) => {
        const mappedPosts = section.posts.map(mapPostToUi);

        return (
          <NewsSection
            key={section.slug}
            slug={section.slug}
            title={section.title}
            posts={mappedPosts}
          />
        );
      })}
    </main>
  );
}
