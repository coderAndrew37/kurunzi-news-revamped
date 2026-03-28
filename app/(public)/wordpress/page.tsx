import HeroSection from "@/app/_components/wordpress/WPHeroSection";
import { SportsPost, getSportsPosts } from "@/lib/wordpress/wp-api";
import BreakingNewsTicker from "../../_components/wordpress/WPBreakingNewsTicker";
import NewsSection from "../../_components/wordpress/WPNewsSection";

export default async function HomePage() {
  const allPosts: SportsPost[] = await getSportsPosts();

  if (!allPosts || allPosts.length === 0) {
    return (
      <div className="p-20 text-center">
        No posts found. Check WordPress connection.
      </div>
    );
  }

  // 1. Extract the Hero Article
  const heroArticle =
    allPosts.find((post) => post.newsData.isHero) || allPosts[0];

  // 2. Filter out the hero from the list to avoid duplication
  const remainingPosts = allPosts.filter(
    (post) => post.slug !== heroArticle.slug,
  );

  // 3. Generate Unique Categories
  // We use p.category which is now defined in our interface
  const categories = Array.from(new Set(remainingPosts.map((p) => p.category)));

  // 4. Create Sections
  const sections = categories.map((cat) => ({
    title: cat,
    slug: cat.toLowerCase().replace(/\s+/g, "-"), // Clean slug for URLs (e.g. "Local News" -> "local-news")
    posts: remainingPosts.filter((p) => p.category === cat),
  }));

  return (
    <main className="flex flex-col gap-12 bg-white pb-20">
      <BreakingNewsTicker />

      {heroArticle && <HeroSection article={heroArticle} />}

      {sections.map((section) => (
        <NewsSection
          key={section.slug}
          slug={section.slug}
          title={section.title || ""}
          posts={section.posts}
        />
      ))}
    </main>
  );
}
