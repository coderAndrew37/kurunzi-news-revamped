// lib/fixtures/get-live-fixtures.ts
// Data source for the homepage "Scores & Fixtures" ribbon.
//
// TODO: point this at your existing API-Football Route Handler proxy (the
// one already scoped for Kurunzi Sports fixtures, living under its own
// lib/fixtures/ directory, separate from lib/wordpress/, with ISR caching).
// Once that route's path is confirmed, replace the body below with:
//
//   const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/fixtures`, {
//     next: { revalidate: 60 },
//   });
//   if (!res.ok) return FALLBACK_FIXTURES;
//   const data = await res.json();
//   return mapApiFootballToFixtureMatches(data); // write this mapper alongside the proxy
//
// Keeping the ribbon decoupled from the upstream API-Football response shape
// like this means the UI never has to change when the proxy's mapping does.

import { FixtureMatch } from "./types";

const FALLBACK_FIXTURES: FixtureMatch[] = [
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

export async function getLiveFixtures(): Promise<FixtureMatch[]> {
  try {
    // Placeholder until the API-Football proxy route is wired in — see TODO above.
    return FALLBACK_FIXTURES;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[fixtures] getLiveFixtures: falling back to placeholders. " + message);
    return FALLBACK_FIXTURES;
  }
}