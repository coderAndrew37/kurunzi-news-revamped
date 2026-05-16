"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { SportsPost } from "@/lib/wordpress/types";
import ArticleLink from "./WPArticleLink";
import SkeletonImage from "../ui/SkeletonImage";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Match {
  id: string;
  homeTeam: string;
  homeAbbr: string;
  homeCrest?: string;
  awayTeam: string;
  awayAbbr: string;
  awayCrest?: string;
  kickoff: string;
  date: string;
  competition: string;
  status: "upcoming" | "live" | "final";
  homeScore?: number;
  awayScore?: number;
}

interface Props {
  posts: SportsPost[];
  categoryTitle?: string;
  categorySlug?: string;
}

// ─── BBC-style editorial algorithm ────────────────────────────────────────────
//
// Priority tiers (mimics how BBC Sport / Guardian editors surface content):
//
//  Tier 1 — Breaking news: isBreaking flag, always leads if present
//  Tier 2 — Hero-flagged: isHero === true, editorially promoted stories
//  Tier 3 — Recency: most recent posts fill remaining slots
//
// The carousel gets 5 posts. The bottom row gets the next 3 distinct posts.
// We deduplicate so a post never appears in both rows.
//
// This mirrors newsroom logic: editors flag top stories (hero/breaking),
// recency fills the rest, and the algorithm respects both signals.

function selectHeroPosts(posts: SportsPost[]): {
  carousel: SportsPost[];
  secondary: SportsPost[];
} {
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

  // Sort helpers
  const byDate = (a: SportsPost, b: SportsPost) =>
    new Date(b.date).getTime() - new Date(a.date).getTime();

  const breaking = posts.filter((p) => p.newsData?.isBreaking).sort(byDate);
  const hero = posts
    .filter((p) => p.newsData?.isHero && !p.newsData?.isBreaking)
    .sort(byDate);
  const recent = posts
    .filter((p) => !p.newsData?.isHero && !p.newsData?.isBreaking)
    .sort(byDate);

  // Carousel: 1 breaking max, then hero, then recent
  const carouselPool = [...breaking.slice(0, 1), ...hero, ...recent];
  const carousel = pick(carouselPool, 5);

  // Secondary: hero/recent not already used, up to 3
  const secondaryPool = [...hero, ...recent, ...breaking];
  const secondary = pick(secondaryPool, 3);

  return { carousel, secondary };
}

// ─── Placeholder matches — swap with real API data later ─────────────────────

const PLACEHOLDER_MATCHES: Match[] = [
  {
    id: "1",
    homeTeam: "Manchester City",
    homeAbbr: "MCI",
    awayTeam: "Crystal Palace",
    awayAbbr: "CPL",
    kickoff: "10:00 PM",
    date: "May 13",
    competition: "Premier League",
    status: "upcoming",
  },
  {
    id: "2",
    homeTeam: "AFC Leopards",
    homeAbbr: "AFC",
    awayTeam: "Gor Mahia",
    awayAbbr: "GOR",
    kickoff: "3:00 PM",
    date: "Today",
    competition: "KPL",
    status: "live",
    homeScore: 1,
    awayScore: 0,
  },
  {
    id: "3",
    homeTeam: "Harambee Stars",
    homeAbbr: "KEN",
    awayTeam: "Taifa Stars",
    awayAbbr: "TAN",
    kickoff: "FT",
    date: "Yesterday",
    competition: "AFCON Qualifier",
    status: "final",
    homeScore: 2,
    awayScore: 1,
  },
  {
    id: "4",
    homeTeam: "Everton",
    homeAbbr: "EVE",
    awayTeam: "Sunderland",
    awayAbbr: "SUN",
    kickoff: "5:00 PM",
    date: "May 17",
    competition: "Premier League",
    status: "upcoming",
  },
];

// ─── MatchRow ─────────────────────────────────────────────────────────────────

function MatchRow({ match }: { match: Match }) {
  const isLive = match.status === "live";
  const isFinal = match.status === "final";
  const hasScore = isLive || isFinal;

  return (
    <div className="flex flex-col gap-2 py-3 border-b border-gray-100 last:border-0">
      {/* Competition + status */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
          {match.competition}
        </span>
        {isLive && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 uppercase tracking-wide">
            <span className="live-dot" />
            Live
          </span>
        )}
        {isFinal && (
          <span className="text-[10px] font-semibold text-gray-400 uppercase">
            FT
          </span>
        )}
      </div>

      {/* Home */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
          <span className="text-[8px] font-black text-gray-500">
            {match.homeAbbr.slice(0, 2)}
          </span>
        </div>
        <span className="flex-1 text-[12.5px] font-medium text-gray-900 truncate">
          {match.homeTeam}
        </span>
        {hasScore && match.homeScore !== undefined && (
          <span
            className={`text-[13px] font-bold tabular-nums ${isLive ? "text-gray-900" : "text-gray-500"}`}
          >
            {match.homeScore}
          </span>
        )}
      </div>

      {/* Away */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
          <span className="text-[8px] font-black text-gray-500">
            {match.awayAbbr.slice(0, 2)}
          </span>
        </div>
        <span className="flex-1 text-[12.5px] font-medium text-gray-900 truncate">
          {match.awayTeam}
        </span>
        {hasScore && match.awayScore !== undefined && (
          <span
            className={`text-[13px] font-bold tabular-nums ${isLive ? "text-gray-900" : "text-gray-500"}`}
          >
            {match.awayScore}
          </span>
        )}
      </div>

      {/* Kickoff — upcoming only */}
      {!hasScore && (
        <div className="flex items-center gap-1.5 text-gray-400 pt-0.5">
          <Clock size={9} />
          <span className="text-[10px] font-medium">
            {match.kickoff} · {match.date}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── CarouselSlide ────────────────────────────────────────────────────────────

function CarouselSlide({ post, index }: { post: SportsPost; index: number }) {
  const catSlug = post.category?.toLowerCase().replace(/\s+/g, "-") ?? "news";

  return (
    <ArticleLink
      categorySlug={catSlug}
      slug={post.slug}
      className="group relative block w-full h-full flex-shrink-0"
    >
      {/* SkeletonImage fills the entire slide as a background */}
      <div className="absolute inset-0 overflow-hidden">
        {post.featuredImage ? (
          // We need fill behaviour here, so we go direct to next/image
          // SkeletonImage's figure/aspect wrapper doesn't suit full-bleed carousel slides.
          // We replicate its dev/prod logic inline for the carousel only.
          <CarouselImage
            src={post.featuredImage}
            alt={post.title}
            priority={index === 0}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="flex items-center gap-2 opacity-20">
              <div className="w-8 h-1 bg-red-600" />
              <span className="text-xs font-black tracking-widest text-gray-400 uppercase">
                Kurunzi Sports
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-7">
        <div className="flex items-center gap-2 mb-2">
          {post.newsData?.isBreaking && (
            <span className="bg-red-600 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm">
              Breaking
            </span>
          )}
          {post.newsData?.isHero && !post.newsData?.isBreaking && (
            <span className="bg-white/20 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm backdrop-blur-sm">
              Top Story
            </span>
          )}
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/70">
            {post.category}
          </span>
        </div>

        <h2
          className="text-white font-bold leading-tight mb-2 group-hover:text-white/90 transition-colors"
          style={{
            fontSize: "clamp(1.1rem, 2.4vw, 1.65rem)",
            letterSpacing: "-0.02em",
          }}
        >
          {post.title}
        </h2>

        {post.newsData?.theLede && (
          <p className="text-white/60 text-sm leading-relaxed line-clamp-2 max-w-lg mb-3 italic">
            {post.newsData.theLede}
          </p>
        )}

        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">
          Read story <ChevronRight size={10} />
        </span>
      </div>
    </ArticleLink>
  );
}

// ── Inline fill-image component for carousel (full-bleed, no aspect wrapper) ──
function CarouselImage({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority: boolean;
}) {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    return (
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
      />
    );
  }

  // Use next/image with fill in production
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
    />
  );
}

// ─── BottomCard ───────────────────────────────────────────────────────────────

function BottomCard({ post }: { post: SportsPost }) {
  const catSlug = post.category?.toLowerCase().replace(/\s+/g, "-") ?? "news";

  return (
    <ArticleLink
      categorySlug={catSlug}
      slug={post.slug}
      className="group flex items-start gap-3 p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors bg-white"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1.5">
          {post.newsData?.isBreaking && (
            <span className="bg-red-600 text-white text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm">
              Breaking
            </span>
          )}
          <span className="block text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">
            {post.category}
          </span>
        </div>
        <h3 className="text-[13px] font-semibold text-gray-900 leading-snug line-clamp-3 group-hover:text-gray-600 transition-colors">
          {post.title}
        </h3>
        {post.newsData?.theLede && (
          <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
            {post.newsData.theLede}
          </p>
        )}
      </div>

      {/* Thumbnail via SkeletonImage — but we need a fixed box, not aspect-ratio wrapper */}
      {post.featuredImage && (
        <div className="relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden bg-gray-100">
          <SkeletonImage
            src={post.featuredImage}
            alt={post.title}
            // Override the aspect-ratio wrapper with a className that fills the container
            className="!aspect-auto absolute inset-0 w-full h-full object-cover rounded-none"
          />
        </div>
      )}
    </ArticleLink>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function SportsHero({
  posts,
  categoryTitle,
  categorySlug,
}: Props) {
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // ── BBC-style editorial selection ──────────────────────────────────────────
  const { carousel: carouselPosts, secondary: bottomPosts } =
    selectHeroPosts(posts);

  const goTo = useCallback((index: number) => {
    setActiveSlide(index);
    carouselRef.current?.scrollTo({
      left: index * carouselRef.current.offsetWidth,
      behavior: "smooth",
    });
  }, []);

  const prev = () => goTo(Math.max(0, activeSlide - 1));
  const next = () => goTo(Math.min(carouselPosts.length - 1, activeSlide + 1));

  if (!posts.length) return null;

  return (
    <section className="w-full bg-white border-b border-gray-200">
      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4 flex flex-col gap-4">
        {/* ── TOP ROW ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 items-stretch">
          {/* Featured Matches */}
          <div className="border border-gray-200 rounded-xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="text-[13px] font-bold text-gray-900">
                Featured matches
              </span>
              <Link
                href="/fixtures"
                className="text-[11px] font-semibold text-[var(--accent)] hover:underline"
              >
                See full schedule →
              </Link>
            </div>
            <div className="px-4 flex-1">
              {PLACEHOLDER_MATCHES.map((match) => (
                <MatchRow key={match.id} match={match} />
              ))}
            </div>
          </div>

          {/* Carousel */}
          <div
            className="relative rounded-xl overflow-hidden bg-gray-100"
            style={{ aspectRatio: "16/9" }}
          >
            <div
              ref={carouselRef}
              className="flex h-full overflow-x-hidden"
              style={{ scrollSnapType: "x mandatory" }}
              onScroll={(e) => {
                const el = e.currentTarget;
                setActiveSlide(Math.round(el.scrollLeft / el.offsetWidth));
              }}
            >
              {carouselPosts.map((post, i) => (
                <div
                  key={post.slug}
                  className="flex-shrink-0 w-full h-full relative"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <CarouselSlide post={post} index={i} />
                </div>
              ))}
            </div>

            {activeSlide > 0 && (
              <button
                onClick={prev}
                aria-label="Previous"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
              >
                <ChevronLeft size={15} className="text-gray-700" />
              </button>
            )}

            {activeSlide < carouselPosts.length - 1 && (
              <button
                onClick={next}
                aria-label="Next"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
              >
                <ChevronRight size={15} className="text-gray-700" />
              </button>
            )}

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
              {carouselPosts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Slide ${i + 1}`}
                  className="rounded-full border-none transition-all duration-200"
                  style={{
                    width: i === activeSlide ? 20 : 6,
                    height: 6,
                    background:
                      i === activeSlide ? "#fff" : "rgba(255,255,255,0.45)",
                  }}
                />
              ))}
            </div>

            {/* Slide counter — top right, BBC-style */}
            {carouselPosts.length > 1 && (
              <div className="absolute top-3 right-3 z-10 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full tabular-nums">
                {activeSlide + 1} / {carouselPosts.length}
              </div>
            )}
          </div>
        </div>

        {/* ── BOTTOM ROW: up to 3 secondary leads ─────────────────────── */}
        {bottomPosts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {bottomPosts.map((post) => (
              <BottomCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Minimal global CSS that Tailwind cannot express */}
      <style>{`
        .live-dot {
          display: inline-block;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #dc2626;
          animation: livepulse 1.2s ease-in-out infinite;
        }
        @keyframes livepulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .scrollbar-none { scrollbar-width: none; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
