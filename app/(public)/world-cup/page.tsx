// app/world-cup/page.tsx
// Dedicated World Cup 2026 coverage page.
// Filters posts from WordPress that belong to a "World Cup" or "FIFA"
// category/tag. Falls back gracefully if no tagged posts exist yet.

import Link from "next/link";
import { Trophy, ArrowLeft, Calendar } from "lucide-react";
import { getSportsPosts } from "@/lib/wordpress/data";
import { SportsPost } from "@/lib/wordpress/types";

import ArticleLink from "@/app/_components/wordpress/WPArticleLink";
import SkeletonImage from "@/app/_components/ui/SkeletonImage";
import PostListItem from "@/app/_components/wordpress/WPArchiveListItem";

export const metadata = {
  title: "FIFA World Cup 2026 — Kurunzi Sports",
  description:
    "Full coverage of the FIFA World Cup 2026. News, fixtures, results, analysis and more from USA, Canada and Mexico.",
};

// ── Terms that identify a World Cup post (case-insensitive) ──────────────────
const WC_TERMS = ["world cup", "worldcup", "fifa", "world-cup", "2026"];

function isWorldCupPost(post: SportsPost): boolean {
  const haystack = [post.title, post.category, post.excerpt, post.newsData?.theLede]
    .join(" ")
    .toLowerCase();
  return WC_TERMS.some((term) => haystack.includes(term));
}

// ── World Cup groups for visual context ──────────────────────────────────────
const GROUPS = [
  { id: "A", teams: ["USA", "Morocco", "Panama", "TBD"] },
  { id: "B", teams: ["Mexico", "Australia", "Honduras", "TBD"] },
  { id: "C", teams: ["Argentina", "Chile", "Ecuador", "TBD"] },
  { id: "D", teams: ["France", "Uruguay", "South Korea", "TBD"] },
  { id: "E", teams: ["Spain", "Portugal", "Croatia", "TBD"] },
  { id: "F", teams: ["Brazil", "Canada", "Nigeria", "TBD"] },
];

// ── Lead article card ─────────────────────────────────────────────────────────
function LeadCard({ post }: { post: SportsPost }) {
  const catSlug = post.category?.toLowerCase().replace(/\s+/g, "-") ?? "news";
  return (
    <ArticleLink
      categorySlug={catSlug}
      slug={post.slug}
      className="group block"
    >
      <SkeletonImage
        src={post.featuredImage}
        alt={post.title}
        priority
        className="group-hover:scale-[1.02]"
      />
      <div className="mt-3">
        {post.newsData?.isBreaking && (
          <span className="inline-flex items-center gap-1 mb-2 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm">
            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
            Breaking
          </span>
        )}
        <h2 className="text-xl sm:text-2xl font-black text-[var(--ink)] font-['Barlow_Condensed'] leading-tight group-hover:opacity-75 transition-opacity"
          style={{ letterSpacing: "-0.02em" }}>
          {post.title}
        </h2>
        {post.newsData?.theLede && (
          <p className="mt-1.5 text-[14px] text-[var(--ink-soft)] italic font-['Source_Serif_4'] leading-relaxed line-clamp-2">
            {post.newsData.theLede}
          </p>
        )}
        <div className="flex items-center gap-1.5 mt-2 text-[var(--ink-faint)]">
          <Calendar size={9} />
          <span className="text-[10px] font-semibold uppercase tracking-wider font-['Barlow_Condensed']">
            {new Date(post.date).toLocaleDateString("en-KE", {
              day: "numeric", month: "short", year: "numeric",
            })}
          </span>
        </div>
      </div>
    </ArticleLink>
  );
}

export default async function WorldCupPage() {
  const allPosts = await getSportsPosts();

  // Filter to World Cup posts; fall back to all posts if none tagged yet
  let wcPosts = allPosts.filter(isWorldCupPost);
  const hasWcPosts = wcPosts.length > 0;
  if (!hasWcPosts) wcPosts = allPosts.slice(0, 12); // graceful fallback

  const leadPost = wcPosts[0];
  const secondaryPosts = wcPosts.slice(1, 4);
  const listPosts = wcPosts.slice(4);

  return (
    <main className="min-h-screen pb-24" style={{ background: "var(--paper)" }}>

      {/* ── Hero header ────────────────────────────────────────────────────── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ background: "#0a0f1a" }}
      >
        {/* Pitch stripes */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -55deg,
              #22c55e 0px, #22c55e 32px,
              transparent 32px, transparent 64px
            )`,
          }}
          aria-hidden
        />
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#dc2626]" aria-hidden />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/80 transition-colors text-[11px] font-semibold uppercase tracking-widest font-['Barlow_Condensed'] mb-6"
          >
            <ArrowLeft size={12} />
            Home
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-40 rounded-full" aria-hidden />
                  <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center shadow-xl">
                    <Trophy size={22} className="text-yellow-900" />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#dc2626] font-['Barlow_Condensed']">
                    FIFA · USA · Canada · Mexico
                  </p>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-['Barlow_Condensed'] leading-none">
                    World Cup{" "}
                    <span className="text-[#dc2626]">2026</span>
                  </h1>
                </div>
              </div>
              <p className="text-white/50 text-sm font-['Source_Serif_4'] italic max-w-lg">
                Full coverage of the biggest football tournament on Earth.
                News, fixtures, analysis, and every result — all in one place.
              </p>
            </div>

            {/* Tournament info pills */}
            <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end sm:gap-1.5">
              {[
                { label: "Kick-off", value: "Jun 11, 2026" },
                { label: "Final", value: "Jul 19, 2026" },
                { label: "Host cities", value: "16 cities" },
                { label: "Teams", value: "48 nations" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/30 font-['Barlow_Condensed']">
                    {label}:
                  </span>
                  <span className="text-[11px] font-black text-white/80 font-['Barlow_Condensed'] uppercase tracking-wide">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── No WC posts notice ───────────────────────────────────────────── */}
        {!hasWcPosts && (
          <div className="mb-6 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-sm text-[12px] text-yellow-800 font-['Barlow_Condensed'] font-semibold uppercase tracking-wider">
            No World Cup articles published yet — showing latest stories below.
            Tag posts with $&quot;World Cup$&quot; or &quot;FIFA&quot; in WordPress to populate this page.
          </div>
        )}

        {/* ── GROUPS at a glance ───────────────────────────────────────────── */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[var(--rule)]">
            <span className="text-[var(--accent)] font-black text-xl font-['Barlow_Condensed']" aria-hidden>»</span>
            <h2 className="text-lg font-black uppercase tracking-tight text-[var(--ink)] font-['Barlow_Condensed']">
              Groups at a Glance
            </h2>
            <span className="ml-auto text-[10px] text-[var(--ink-faint)] font-['Barlow_Condensed'] font-semibold uppercase tracking-wider">
              Provisional • subject to draw
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {GROUPS.map((group) => (
              <div
                key={group.id}
                className="border border-[var(--rule)] rounded-sm bg-white overflow-hidden"
              >
                <div className="bg-[#0a0f1a] px-3 py-1.5 flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40 font-['Barlow_Condensed']">
                    Group
                  </span>
                  <span className="text-base font-black text-white font-['Barlow_Condensed']">
                    {group.id}
                  </span>
                </div>
                <div className="px-3 py-2 space-y-1">
                  {group.teams.map((team) => (
                    <p
                      key={team}
                      className={`text-[11px] font-semibold font-['Barlow_Condensed'] uppercase tracking-wide ${
                        team === "TBD"
                          ? "text-[var(--ink-faint)]"
                          : "text-[var(--ink)]"
                      }`}
                    >
                      {team}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── EDITORIAL GRID ───────────────────────────────────────────────── */}
        {leadPost && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-[var(--ink)]">
              <span className="text-[var(--accent)] font-black text-xl font-['Barlow_Condensed']" aria-hidden>»</span>
              <h2 className="text-lg font-black uppercase tracking-tight text-[var(--ink)] font-['Barlow_Condensed']">
                Latest Coverage
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
              {/* Lead story */}
              <LeadCard post={leadPost} />

              {/* Secondary stack */}
              {secondaryPosts.length > 0 && (
                <div className="flex flex-col divide-y divide-[var(--rule)]">
                  {secondaryPosts.map((post, i) => (
                    <div key={post.slug} className="py-4 first:pt-0 last:pb-0">
                      <PostListItem post={post} priority={i === 0} variant="compact" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── MORE STORIES list ────────────────────────────────────────────── */}
        {listPosts.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[var(--rule)]">
              <span className="text-[var(--accent)] font-black text-xl font-['Barlow_Condensed']" aria-hidden>»</span>
              <h2 className="text-lg font-black uppercase tracking-tight text-[var(--ink)] font-['Barlow_Condensed']">
                More Stories
              </h2>
            </div>
            <div className="max-w-3xl">
              {listPosts.map((post, i) => (
                <PostListItem key={post.slug} post={post} priority={i === 0} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}