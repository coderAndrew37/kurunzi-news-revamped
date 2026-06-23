// app/page.tsx
// Homepage — assembles the BBC-style layout: asymmetric hero → live scores
// ribbon → uniform category feed grids (with a media band + in-feed ads
// interleaved) → footer (rendered by the layout).
//
// All imports use the @/ alias rather than relative paths, since this file's
// exact folder depth relative to app/_components/ wasn't given — absolute
// imports resolve the same regardless of where page.tsx ends up living.

import type { ReactNode } from "react";
import SportsHero from "@/app/_components/wordpress/SportsHeroSection";
import NewsSection from "@/app/_components/wordpress/WPNewsSection";
import BreakingNewsTicker from "@/app/_components/wordpress/WPBreakingNewsTicker";
import HomePageClient from "./HomepageClient";
import { getSportsPosts } from "@/lib/wordpress/data";
import { getHeroSlugs } from "@/lib/wordpress/select-hero-posts";
import { getLiveFixtures } from "@/lib/fixtures/get-live-fixtures";
import { SportsPost } from "@/lib/wordpress/types";
import LiveScoresRibbon from "../_components/wordpress/WPLiveScoreRibbon";
import AdSlot from "../_components/WPAdSlot";
import MediaFeature from "../_components/WPMediaFeature";

// ─── Section scoring ──────────────────────────────────────────────────────────
// Unchanged from the previous build — still decides which category grid
// appears highest on the page.

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
  const [allPosts, liveFixtures] = await Promise.all([
    getSportsPosts(),
    getLiveFixtures(),
  ]);

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

  // ── Step 2: pull out video posts for the Media Feature band ───────────────
  const videoPosts = sectionPosts.filter((p) => p.featuredVideo).slice(0, 8);
  const feedPosts = sectionPosts.filter((p) => !p.featuredVideo);

  // ── Step 3: group by category — every category, not just the top N ───────
  const categoryMap = new Map<string, SportsPost[]>();
  for (const post of feedPosts) {
    const cat = post.category;
    if (!categoryMap.has(cat)) categoryMap.set(cat, []);
    categoryMap.get(cat)!.push(post);
  }

  // ── Step 4: score → sort → filter thin sections ───────────────────────────
  const sortedSections = Array.from(categoryMap.entries())
    .map(([cat, posts]) => ({
      title: cat,
      slug: cat.toLowerCase().replace(/\s+/g, "-"),
      posts,
      score: scoreSection(posts),
    }))
    .sort((a, b) => b.score - a.score)
    .filter((s) => s.posts.length >= 2);

  // ── Step 5: assemble the ordered list of feed-area blocks ──────────────────
  // Category grids, the media feature band, and in-feed ad slots are all
  // interleaved here so HomePageClient can stagger-animate them generically
  // without knowing what each block actually is.
  const blocks: Array<{ slug: string; render: ReactNode }> = [];

  sortedSections.forEach((section, i) => {
    blocks.push({
      slug: section.slug,
      render: <NewsSection slug={section.slug} title={section.title} posts={section.posts} />,
    });

    if (i === 0 && videoPosts.length > 0) {
      // Media band sits right after the first (highest-scored) category grid —
      // mirrors where BBC drops its video row beneath "More sports news".
      blocks.push({ slug: "media-feature", render: <MediaFeature posts={videoPosts} /> });
    } else if (i > 0 && i % 2 === 0) {
      // In-feed ad every 2 sections after that. Renders nothing if AdSense
      // isn't configured yet — see WPAdSlot.
      blocks.push({
        slug: `ad-infeed-${i}`,
        render: (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <AdSlot slotId={process.env.NEXT_PUBLIC_AD_SLOT_INFEED ?? ""} format="auto" />
          </div>
        ),
      });
    }
  });

  return (
    <HomePageClient
      ticker={<BreakingNewsTicker />}
      hero={<SportsHero posts={allPosts} />}
      liveScores={<LiveScoresRibbon matches={liveFixtures} />}
      topAd={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <AdSlot slotId={process.env.NEXT_PUBLIC_AD_SLOT_TOP ?? ""} format="horizontal" />
        </div>
      }
      sections={blocks}
    />
  );
}