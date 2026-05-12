"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { SportsPost } from "@/lib/wordpress/types";
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

// ─── Placeholder — swap with real API data later ──────────────────────────────

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
          <span className="text-[10px] font-semibold text-gray-400 uppercase">FT</span>
        )}
      </div>

      {/* Home */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
          {match.homeCrest ? (
            <Image src={match.homeCrest} alt={match.homeTeam} width={16} height={16} className="object-contain" />
          ) : (
            <span className="text-[8px] font-black text-gray-500">{match.homeAbbr.slice(0, 2)}</span>
          )}
        </div>
        <span className="flex-1 text-[12.5px] font-medium text-gray-900 truncate">{match.homeTeam}</span>
        {hasScore && match.homeScore !== undefined && (
          <span className={`text-[13px] font-bold tabular-nums ${isLive ? "text-gray-900" : "text-gray-500"}`}>
            {match.homeScore}
          </span>
        )}
      </div>

      {/* Away */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
          {match.awayCrest ? (
            <Image src={match.awayCrest} alt={match.awayTeam} width={16} height={16} className="object-contain" />
          ) : (
            <span className="text-[8px] font-black text-gray-500">{match.awayAbbr.slice(0, 2)}</span>
          )}
        </div>
        <span className="flex-1 text-[12.5px] font-medium text-gray-900 truncate">{match.awayTeam}</span>
        {hasScore && match.awayScore !== undefined && (
          <span className={`text-[13px] font-bold tabular-nums ${isLive ? "text-gray-900" : "text-gray-500"}`}>
            {match.awayScore}
          </span>
        )}
      </div>

      {/* Kickoff — upcoming only */}
      {!hasScore && (
        <div className="flex items-center gap-1.5 text-gray-400 pt-0.5">
          <Clock size={9} />
          <span className="text-[10px] font-medium">{match.kickoff} · {match.date}</span>
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
      {post.featuredImage ? (
        <Image
          src={post.featuredImage}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          priority={index === 0}
          sizes="(max-width: 1024px) 100vw, 70vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-200" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-7">
        <div className="flex items-center gap-2 mb-2">
          {post.newsData?.isBreaking && (
            <span className="bg-red-600 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm">
              Breaking
            </span>
          )}
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/70">
            {post.category}
          </span>
        </div>

        <h2
          className="text-white font-bold leading-tight mb-2 group-hover:text-white/90 transition-colors"
          style={{ fontSize: "clamp(1.1rem, 2.4vw, 1.65rem)", letterSpacing: "-0.02em" }}
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
        <span className="block text-[10px] font-bold uppercase tracking-widest text-[var(--accent)] mb-1.5">
          {post.category}
        </span>
        <h3 className="text-[13px] font-semibold text-gray-900 leading-snug line-clamp-3 group-hover:text-gray-600 transition-colors">
          {post.title}
        </h3>
        {post.newsData?.theLede && (
          <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
            {post.newsData.theLede}
          </p>
        )}
      </div>
      {post.featuredImage && (
        <div className="relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden bg-gray-100">
          <Image src={post.featuredImage} alt={post.title} fill className="object-cover" sizes="80px" />
        </div>
      )}
    </ArticleLink>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function SportsHero({ posts, categoryTitle, categorySlug }: Props) {
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const carouselPosts = posts.slice(0, 5);
  const bottomPosts = posts.slice(5, 8);

  const goTo = useCallback((index: number) => {
    setActiveSlide(index);
    carouselRef.current?.scrollTo({
      left: index * (carouselRef.current.offsetWidth),
      behavior: "smooth",
    });
  }, []);

  const prev = () => goTo(Math.max(0, activeSlide - 1));
  const next = () => goTo(Math.min(carouselPosts.length - 1, activeSlide + 1));

  if (!posts.length) return null;

  const NAV_TABS = categoryTitle
    ? [{ label: categoryTitle, slug: categorySlug ?? "" }]
    : [
        { label: "Sports", slug: "" },
        { label: "Soccer", slug: "football" },
        { label: "Premier League", slug: "premier-league" },
        { label: "Champions League", slug: "champions-league" },
        { label: "La Liga", slug: "la-liga" },
        { label: "Europa League", slug: "europa-league" },
        { label: "Athletics", slug: "athletics" },
        { label: "Rugby", slug: "rugby" },
        { label: "Cricket", slug: "cricket" },
      ];

  return (
    <section className="w-full bg-white border-b border-gray-200">

      {/* ── Nav tabs ─────────────────────────────────────────────────────── */}
      <div className="border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="flex items-center overflow-x-auto scrollbar-none">
            {NAV_TABS.map((tab, i) => (
              <Link
                key={tab.slug}
                href={tab.slug ? `/${tab.slug}` : "/"}
                className={`flex-shrink-0 px-4 py-2.5 text-[13px] whitespace-nowrap transition-colors border-b-2 ${
                  i === 0
                    ? "font-bold text-[var(--accent)] border-[var(--accent)]"
                    : "font-medium text-gray-500 hover:text-gray-900 border-transparent hover:border-gray-300"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4 flex flex-col gap-4">

        {/* ── TOP ROW ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 items-stretch">

          {/* Featured Matches */}
          <div className="border border-gray-200 rounded-xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="text-[13px] font-bold text-gray-900">Featured matches</span>
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
                    background: i === activeSlide ? "#fff" : "rgba(255,255,255,0.45)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── BOTTOM ROW: 3 cards ──────────────────────────────────────── */}
        {bottomPosts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {bottomPosts.map((post) => (
              <BottomCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Only CSS that Tailwind cannot do: custom keyframe + scrollbar hide */}
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