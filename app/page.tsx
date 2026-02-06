import { fetchHomepageSections } from "@/lib/sanity/api";
import { mapPostToUi } from "@/lib/sanity/mapper";
import NewsSection from "./_components/NewsSection";
import BreakingNewsTicker from "./_components/BreakingNews";

export default async function HomePage() {
  const sections = await fetchHomepageSections();

  return (
    <main className="flex flex-col gap-12 bg-white pb-20">
      {sections.map((section) => {
        // Map the array of posts for this specific section
        const mappedPosts = section.posts.map(mapPostToUi);

        return (
          <>
            <BreakingNewsTicker />
            <NewsSection
              key={`section-${section.slug}-${Math.random()}`} // Ensure a unique key for each section
              title={section.title}
              posts={mappedPosts}
            />
          </>
        );
      })}
    </main>
  );
}
