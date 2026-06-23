// app/_components/wordpress/WPLiveScoresRibbon.tsx
// BBC-style "Scores & Fixtures" ribbon — a horizontally scrollable strip of
// compact match cards, sitting directly beneath the hero grid. Server
// component: the only interactivity is native CSS scroll-snap, no client JS
// required.

import Link from "next/link";
import { FixtureMatch } from "@/lib/fixtures/types";

interface Props {
  matches: FixtureMatch[];
}

function TeamRow({
  name,
  abbr,
  score,
  showScore,
  emphasise,
}: {
  name: string;
  abbr: string;
  score?: number;
  showScore: boolean;
  emphasise: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
        <span className="text-[7px] font-black text-gray-500">{abbr.slice(0, 2)}</span>
      </div>
      <span className="flex-1 text-[12px] font-semibold text-gray-900 truncate">{name}</span>
      {showScore && score !== undefined && (
        <span
          className={[
            "text-[13px] font-bold tabular-nums",
            emphasise ? "text-gray-900" : "text-gray-400",
          ].join(" ")}
        >
          {score}
        </span>
      )}
    </div>
  );
}

function MatchCard({ match }: { match: FixtureMatch }) {
  const isLive = match.status === "live";
  const isFinal = match.status === "final";
  const showScore = isLive || isFinal;

  return (
    <div className="flex-shrink-0 w-[200px] bg-white border border-gray-200 rounded-lg px-3.5 py-3 snap-start">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide truncate">
          {match.competition}
        </span>
        {isLive && (
          <span className="flex items-center gap-1 text-[9px] font-bold text-red-600 uppercase tracking-wide">
            <span className="live-pulse" />
            Live
          </span>
        )}
        {isFinal && <span className="text-[9px] font-bold text-gray-400 uppercase">FT</span>}
      </div>

      <div className="space-y-1.5">
        <TeamRow
          name={match.homeTeam}
          abbr={match.homeAbbr}
          score={match.homeScore}
          showScore={showScore}
          emphasise={isLive}
        />
        <TeamRow
          name={match.awayTeam}
          abbr={match.awayAbbr}
          score={match.awayScore}
          showScore={showScore}
          emphasise={isLive}
        />
      </div>

      {!showScore && (
        <div className="mt-2.5 pt-2 border-t border-gray-100 text-[10px] font-medium text-gray-400">
          {match.kickoff} · {match.date}
        </div>
      )}
    </div>
  );
}

export default function LiveScoresRibbon({ matches }: Props) {
  if (!matches.length) return null;

  return (
    <section className="w-full bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-bold text-gray-900 uppercase tracking-tight">
            Scores &amp; Fixtures
          </h2>
          <Link
            href="/fixtures"
            className="text-[11px] font-bold text-red-600 hover:underline uppercase tracking-wide"
          >
            Full Schedule →
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-1 px-1">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </div>

      <style>{`
        .live-pulse {
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