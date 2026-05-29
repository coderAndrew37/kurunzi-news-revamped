import SportsHero from "@/app/_components/wordpress/SportsHeroSection";
import { getSportsPosts } from "@/lib/wordpress/data";
import { SportsPost } from "@/lib/wordpress/types";
import BreakingNewsTicker from "../_components/wordpress/WPBreakingNewsTicker";
import NewsSection from "../_components/wordpress/WPNewsSection";
import HomePageClient from  "./HomepageClient";

// ─── Mirrors the hero's selectHeroPosts to derive which slugs it consumed ────
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

// ─── Main Server Component ───────────────────────────────────────────────────
export default async function HomePage() {
  const allPosts: SportsPost[] = await getSportsPosts();

  if (!allPosts || allPosts.length === 0) {
    return (
      <div className="p-20 text-center font-medium text-gray-500">
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
  const sortedSections = Array.from(categoryMap.entries())
    .map(([cat, posts]) => ({
      title: cat,
      slug: cat.toLowerCase().replace(/\s+/g, "-"),
      posts,
      score: scoreSection(posts),
    }))
    .sort((a, b) => b.score - a.score)
    .filter((s) => s.posts.length >= 2);

  // Prepare standard sub-layouts inside server context safely
  const renderedSections = sortedSections.map((section) => ({
    slug: section.slug,
    render: (
      <NewsSection
        slug={section.slug}
        title={section.title}
        posts={section.posts}
      />
    ),
  }));

  return (
    <HomePageClient
      ticker={<BreakingNewsTicker />}
      hero={<SportsHero posts={allPosts} />}
      sections={renderedSections}
    />
  );
}