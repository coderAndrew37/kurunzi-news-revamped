import SportsHero from "@/app/_components/wordpress/SportsHeroSection";
import BreakingNewsTicker from "../../_components/wordpress/WPBreakingNewsTicker";
import NewsSection from "../../_components/wordpress/WPNewsSection";
import { getSportsPosts } from "@/lib/wordpress/data";
import { SportsPost } from "@/lib/wordpress/types";

export default async function HomePage() {
  const allPosts: SportsPost[] = await getSportsPosts();

  if (!allPosts || allPosts.length === 0) {
    return (
      <div className="p-20 text-center">
        No posts found. Check WordPress connection.
      </div>
    );
  }

  // Everything except the first 5 (carousel) goes to category sections
  const remainingPosts = allPosts.slice(5);

  // Unique categories from remaining posts
  const categories = Array.from(new Set(remainingPosts.map((p) => p.category)));

  // Per-category sections
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

      {/* SportsHero uses posts[0–4] for carousel, posts[5–9] for trending */}
      <SportsHero posts={allPosts} />

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