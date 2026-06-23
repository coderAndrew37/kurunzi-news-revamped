// lib/wordpress/select-hero-posts.ts
// Single source of truth for which posts win the homepage hero slots.
// Both SportsHeroSection (renders them) and page.tsx (excludes them from the
// feed sections below) import this — no more mirrored/duplicated selection
// logic living in two files that can quietly drift apart.

import { SportsPost } from "./types";

export interface HeroSelection {
  main: SportsPost | null;
  secondary: SportsPost[];
}

export function selectHeroPosts(posts: SportsPost[]): HeroSelection {
  const seen = new Set<string>();

  const pick = (arr: SportsPost[], limit: number): SportsPost[] => {
    const out: SportsPost[] = [];
    for (const p of arr) {
      if (seen.has(p.slug)) continue;
      seen.add(p.slug);
      out.push(p);
      if (out.length === limit) break;
    }
    return out;
  };

  const byDate = (a: SportsPost, b: SportsPost) =>
    new Date(b.date).getTime() - new Date(a.date).getTime();

  const breaking = posts.filter((p) => p.newsData?.isBreaking).sort(byDate);
  const hero = posts
    .filter((p) => p.newsData?.isHero && !p.newsData?.isBreaking)
    .sort(byDate);
  const recent = posts
    .filter((p) => !p.newsData?.isHero && !p.newsData?.isBreaking)
    .sort(byDate);

  // Anchor story: breaking takes priority, then editorial "hero" picks, then recency.
  const [main] = pick([...breaking.slice(0, 1), ...hero, ...recent], 1);

  // "More Top Stories" stack: up to 4, hero-flagged posts first.
  const secondary = pick([...hero, ...recent, ...breaking], 4);

  return { main: main ?? null, secondary };
}

export function getHeroSlugs(posts: SportsPost[]): Set<string> {
  const { main, secondary } = selectHeroPosts(posts);
  const slugs = new Set<string>();
  if (main) slugs.add(main.slug);
  for (const p of secondary) slugs.add(p.slug);
  return slugs;
}