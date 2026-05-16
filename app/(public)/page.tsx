import SportsHero from "@/app/_components/wordpress/SportsHeroSection";
import { getSportsPosts } from "@/lib/wordpress/data";
import { SportsPost } from "@/lib/wordpress/types";
import BreakingNewsTicker from "../_components/wordpress/WPBreakingNewsTicker";
import NewsSection from "../_components/wordpress/WPNewsSection";
import WorldCupBanner from "../_components/wordpress/WPWorldCupBanner";

// ─── Mirrors the hero's selectHeroPosts to derive which slugs it consumed ────
//
// We keep this in sync with SportsHeroSection's algorithm manually.
// If you change the hero's tier logic, update this too.
//
// Hero budget: up to 5 carousel + up to 3 secondary = up to 8 slugs.

function getHeroSlugs(posts: SportsPost[]): Set<string> {
  const seen = new Set<string>();

  const byDate = (a: SportsPost, b: SportsPost) =>
    new Date(b.date).getTime() - new Date(a.date).getTime();

  const breaking = posts.filter((p) => p.newsData?.isBreaking).sort(byDate);
  const hero = posts
    .filter((p) => p.newsData?.isHero && !p.newsData?.isBreaking)
    .sort(byDate);
  const recent = posts
    .filter((p) => !p.newsData?.isHero && !p.newsData?.isBreaking)
    .sort(byDate);

  const pick = (pool: SportsPost[], limit: number) => {
    let count = 0;
    for (const p of pool) {
      if (seen.has(p.slug)) continue;
      seen.add(p.slug);
      if (++count === limit) break;
    }
  };

  pick([...breaking.slice(0, 1), ...hero, ...recent], 5); // carousel
  pick([...hero, ...recent, ...breaking], 3); // secondary

  return seen;
}

// ─── Section scoring ──────────────────────────────────────────────────────────
//
// Ranks each category section by three signals:
//
//   Recency   — how recently was the latest post published?
//               Tiers: <1d (+100), <3d (+60), <7d (+30), <30d (+10)
//
//   Volume    — number of posts in the section × 5
//               (breadth, not dominance — large categories don't crush small ones)
//
//   Editorial — breaking posts in this category get +40 each,
//               hero-flagged posts get +20 each
//               (ensures Rugby with a hero post beats Athletics with stale content)

function scoreSection(posts: SportsPost[]): number {
  if (!posts.length) return 0;

  const now = Date.now();
  const DAY = 86_400_000;

  const latestMs = Math.max(...posts.map((p) => new Date(p.date).getTime()));
  const ageMs = now - latestMs;

  const recencyBonus =
    ageMs < 1 * DAY
      ? 100
      : ageMs < 3 * DAY
        ? 60
        : ageMs < 7 * DAY
          ? 30
          : ageMs < 30 * DAY
            ? 10
            : 0;

  const editorialBonus =
    posts.filter((p) => p.newsData?.isBreaking).length * 40 +
    posts.filter((p) => p.newsData?.isHero).length * 20;

  return posts.length * 5 + recencyBonus + editorialBonus;
}

export default async function HomePage() {
  const allPosts: SportsPost[] = await getSportsPosts();

  if (!allPosts || allPosts.length === 0) {
    return (
      <div className="p-20 text-center">
        No posts found. Check WordPress connection.
      </div>
    );
  }

  // ── Step 1: exclude posts the hero already shows ──────────────────────────
  const heroSlugs = getHeroSlugs(allPosts);
  const sectionPosts = allPosts.filter((p) => !heroSlugs.has(p.slug));

  // ── Step 2: group by category — every category, not just the top N ────────
  const categoryMap = new Map<string, SportsPost[]>();
  for (const post of sectionPosts) {
    const cat = post.category;
    if (!categoryMap.has(cat)) categoryMap.set(cat, []);
    categoryMap.get(cat)!.push(post);
  }

  // ── Step 3: score → sort → filter thin sections ───────────────────────────
  const sections = Array.from(categoryMap.entries())
    .map(([cat, posts]) => ({
      title: cat,
      slug: cat.toLowerCase().replace(/\s+/g, "-"),
      posts,
      score: scoreSection(posts),
    }))
    .sort((a, b) => b.score - a.score)
    // Require at least 2 posts for a section to appear — 1-post sections
    // look empty and signal a data problem rather than a real category.
    .filter((s) => s.posts.length >= 2);

  return (
    <main
      className="flex flex-col gap-0 pb-20"
      style={{ background: "var(--paper)" }}
    >
      <BreakingNewsTicker />

      <SportsHero posts={allPosts} />

      {/* <WorldCupBanner /> */}

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
