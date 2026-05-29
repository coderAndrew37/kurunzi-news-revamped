"use client";

import { SportsPost } from "@/lib/wordpress/types";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import SkeletonImage from "../ui/SkeletonImage";
import ArticleLink from "./WPArticleLink";

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

// ─── Editorial Selection Algorithm ────────────────────────────────────────────

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

  const byDate = (a: SportsPost, b: SportsPost) =>
    new Date(b.date).getTime() - new Date(a.date).getTime();

  const breaking = posts.filter((p) => p.newsData?.isBreaking).sort(byDate);
  const hero = posts
    .filter((p) => p.newsData?.isHero && !p.newsData?.isBreaking)
    .sort(byDate);
  const recent = posts
    .filter((p) => !p.newsData?.isHero && !p.newsData?.isBreaking)
    .sort(byDate);

  const carouselPool = [...breaking.slice(0, 1), ...hero, ...recent];
  const carousel = pick(carouselPool, 5);

  const secondaryPool = [...hero, ...recent, ...breaking];
  const secondary = pick(secondaryPool, 3);

  return { carousel, secondary };
}

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
          <span className={`text-[13px] font-bold tabular-nums ${isLive ? "text-gray-900" : "text-gray-500"}`}>
            {match.homeScore}
          </span>
        )}
      </div>

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
          <span className={`text-[13px] font-bold tabular-nums ${isLive ? "text-gray-900" : "text-gray-500"}`}>
            {match.awayScore}
          </span>
        )}
      </div>

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
      <div className="absolute inset-0 overflow-hidden">
        {post.featuredImage ? (
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

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-9">
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
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
            {post.category}
          </span>
        </div>

        <h2
          className="text-white font-black leading-tight mb-2 group-hover:text-red-400 transition-colors"
          style={{
            fontSize: "clamp(1.3rem, 3vw, 2.2rem)",
            letterSpacing: "-0.03em",
          }}
        >
          {post.title}
        </h2>

        {post.newsData?.theLede && (
          <p className="text-white/70 text-sm leading-relaxed line-clamp-2 max-w-2xl mb-4">
            {post.newsData.theLede}
          </p>
        )}

        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-white group-hover:underline decoration-red-600 decoration-2">
          Read story <ChevronRight size={12} />
        </span>
      </div>
    </ArticleLink>
  );
}

// ── Optimized Carousel Image Handler ──────────────────────────────────────────

function CarouselImage({ src, alt, priority }: { src: string; alt: string; priority: boolean }) {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes="(max-width: 1024px) 100vw, 980px"
      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
    />
  );
}

// ─── Expanded High-Attention Secondary Card ───────────────────────────────────

function SecondaryCard({ post }: { post: SportsPost }) {
  const catSlug = post.category?.toLowerCase().replace(/\s+/g, "-") ?? "news";

  return (
    <ArticleLink
      categorySlug={catSlug}
      slug={post.slug}
      className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-gray-300 transition-all"
    >
      {/* Significantly larger attention grabbing visual space */}
      {post.featuredImage && (
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
          <SkeletonImage
            src={post.featuredImage}
            alt={post.title}
            sizes="(max-width: 640px) 100vw, 33vw"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            {post.newsData?.isBreaking && (
              <span className="bg-red-600 text-white text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm">
                Breaking
              </span>
            )}
            <span className="block text-[10px] font-bold uppercase tracking-widest text-red-600">
              {post.category}
            </span>
          </div>

          <h3 className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
            {post.title}
          </h3>

          {post.newsData?.theLede && (
            <p className="text-[12.5px] text-gray-500 mt-2 line-clamp-2 leading-relaxed">
              {post.newsData.theLede}
            </p>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-gray-900 transition-colors">
          <span>Read Story</span>
          <ChevronRight size={12} className="transform group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </ArticleLink>
  );
}

// ─── Main Hero Layout Container ───────────────────────────────────────────────

export default function SportsHero({ posts }: Props) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const { carousel: carouselPosts, secondary: secondaryPosts } = selectHeroPosts(posts);

  const goTo = useCallback((index: number) => {
    if (!carouselRef.current) return;
    setActiveSlide(index);
    carouselRef.current.scrollTo({
      left: index * carouselRef.current.offsetWidth,
      behavior: "smooth",
    });
  }, []);

// AFTER
const prev = () => goTo(Math.max(0, activeSlide - 1));
const next = () => {
  goTo(activeSlide === carouselPosts.length - 1 ? 0 : activeSlide + 1);
};

  // Autoplay Logic Stream (Pauses neatly when user hovers to interact)
  useEffect(() => {
    if (isHovered || carouselPosts.length <= 1) return;

    const interval = setInterval(() => {
      next();
    }, 5000); // Transitions smoothly every 5 seconds

    return () => clearInterval(interval);
  }, [next, isHovered, carouselPosts.length]);

  if (!posts.length) return null;

  return (
    <section className="w-full bg-gray-50 border-b border-gray-200">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        
        {/* ── TOP ROW ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-stretch">
          {/* Featured Matchboard */}
          <div className="border border-gray-200 rounded-xl overflow-hidden flex flex-col bg-white shadow-sm">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 bg-gray-50/70">
              <span className="text-[13px] font-bold text-gray-900 tracking-tight">
                Featured Matches
              </span>
              <Link
                href="/fixtures"
                className="text-[11px] font-bold text-red-600 hover:underline tracking-tight"
              >
                Schedule →
              </Link>
            </div>
            <div className="px-4 flex-1 flex flex-col justify-center">
              {PLACEHOLDER_MATCHES.map((match) => (
                <MatchRow key={match.id} match={match} />
              ))}
            </div>
          </div>

          {/* Carousel Viewport */}
          <div
            className="relative rounded-xl overflow-hidden bg-gray-950 shadow-md group/carousel"
            style={{ aspectRatio: "16/9" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              ref={carouselRef}
              className="flex h-full overflow-x-hidden scrollbar-none"
              style={{ scrollSnapType: "x mandatory" }}
              onScroll={(e) => {
                const el = e.currentTarget;
                if (el.offsetWidth > 0) {
                  setActiveSlide(Math.round(el.scrollLeft / el.offsetWidth));
                }
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

            {/* Nav Arrows (Hidden cleanly on mobile touch displays) */}
            {activeSlide > 0 && (
              <button
                onClick={prev}
                aria-label="Previous"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 border border-gray-200 hidden sm:flex items-center justify-center shadow-md hover:bg-white transition-all opacity-0 group-hover/carousel:opacity-100"
              >
                <ChevronLeft size={16} className="text-gray-800" />
              </button>
            )}

            {activeSlide < carouselPosts.length - 1 && (
              <button
                onClick={next}
                aria-label="Next"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 border border-gray-200 hidden sm:flex items-center justify-center shadow-md hover:bg-white transition-all opacity-0 group-hover/carousel:opacity-100"
              >
                <ChevronRight size={16} className="text-gray-800" />
              </button>
            )}

            {/* Active Pagination Bar Lines */}
            <div className="absolute bottom-4 left-6 z-10 flex items-center gap-2">
              {carouselPosts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Slide ${i + 1}`}
                  className="h-1 rounded-full border-none transition-all duration-300"
                  style={{
                    width: i === activeSlide ? 28 : 8,
                    background: i === activeSlide ? "#dc2626" : "rgba(255,255,255,0.4)",
                  }}
                />
              ))}
            </div>

            {/* Counter Badge */}
            {carouselPosts.length > 1 && (
              <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full tabular-nums tracking-wider">
                {activeSlide + 1} / {carouselPosts.length}
              </div>
            )}
          </div>
        </div>

        {/* ── BOTTOM ROW: High-Attention Secondary Cards Grid ─────────────────── */}
        {secondaryPosts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-2">
            {secondaryPosts.map((post) => (
              <SecondaryCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>

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