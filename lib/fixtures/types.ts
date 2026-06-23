// lib/fixtures/types.ts
// Match shape for the homepage "Scores & Fixtures" ribbon.
// Lives outside lib/wordpress/ on purpose — this data comes from API-Football,
// not WPGraphQL, per the existing fixtures architecture (separate lib/fixtures/
// directory, Route Handler proxy, ISR caching).

export interface FixtureMatch {
  id: string;
  homeTeam: string;
  homeAbbr: string;
  homeCrest?: string | null;
  awayTeam: string;
  awayAbbr: string;
  awayCrest?: string | null;
  kickoff: string;
  date: string;
  competition: string;
  status: "upcoming" | "live" | "final";
  homeScore?: number;
  awayScore?: number;
}