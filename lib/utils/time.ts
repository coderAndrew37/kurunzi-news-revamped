// lib/utils/time.ts
// Shared "time ago" formatter — BBC-style short labels (5m, 5h, 2d).
// Single source of truth so the hero, feed cards, and ribbon never drift
// into slightly different date formatting.

export function getElapsedLabel(dateString: string): string {
  const then = new Date(dateString).getTime();
  if (Number.isNaN(then)) return "";

  const now = Date.now();
  const diffMs = Math.max(0, now - then);

  const MIN = 60_000;
  const HOUR = 60 * MIN;
  const DAY = 24 * HOUR;
  const WEEK = 7 * DAY;

  if (diffMs < MIN) return "Just now";
  if (diffMs < HOUR) return `${Math.floor(diffMs / MIN)}m`;
  if (diffMs < DAY) return `${Math.floor(diffMs / HOUR)}h`;
  if (diffMs < WEEK) return `${Math.floor(diffMs / DAY)}d`;

  return new Date(then).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
  });
}