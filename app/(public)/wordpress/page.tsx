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

  // 1. Hero — prefer a post flagged isHero, otherwise fall back to the latest
  const heroArticle =
    allPosts.find((post) => post.newsData.isHero) || allPosts[0];

  // 2. Everything else, newest first
  const remainingPosts = allPosts.filter(
    (post) => post.slug !== heroArticle.slug,
  );

  // 3. Unique categories from remaining posts (preserves date-desc order)
  const categories = Array.from(new Set(remainingPosts.map((p) => p.category)));

  // 4. Per-category sections
  const sections = categories.map((cat) => ({
    title: cat,
    slug: cat.toLowerCase().replace(/\s+/g, "-"),
    posts: remainingPosts.filter((p) => p.category === cat),
  }));

  return (
    <main
      className="flex flex-col gap-0 pb-20"
      style={{ background: "var(--paper)" }}
    >
      <BreakingNewsTicker />

      {/* Pass hero + full remaining list so the sidebar can show latest posts */}
      <HeroSection hero={heroArticle} latestPosts={remainingPosts} />

      {sections.map((section) => (
        <NewsSection
          key={section.slug}
          slug={section.slug}
          title={section.title}
          posts={section.posts}
        />
      ))}
    </main>
  );
}
