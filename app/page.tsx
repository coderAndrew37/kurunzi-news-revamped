import { fetchHomepageSections } from "@/lib/sanity/api";
import { mapPostToUi } from "@/lib/sanity/mapper";
import NewsSection from "./_components/NewsSection";
import BreakingNewsTicker from "./_components/BreakingNews";

export default async function HomePage() {
  const sections = await fetchHomepageSections();

  return (
    <main className="flex flex-col gap-12 bg-white pb-20">
      {/* 1. Ticker stays outside the loop to render once at the top */}
      <BreakingNewsTicker />

      {/* 2. Map through sections */}
      {sections.map((section) => {
        const mappedPosts = section.posts.map(mapPostToUi);

        return (
          <NewsSection
            key={section.slug} // Stable key is better for performance
            title={section.title}
            posts={mappedPosts}
          />
        );
      })}
    </main>
  );
}
