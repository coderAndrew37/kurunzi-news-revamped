// app/_components/wordpress/WPPagination.tsx
// Reusable cursor-based pagination — server component.
// Styling matches the archive page's existing CSS var tokens:
//   var(--rule), var(--font-ui), var(--ink-soft), var(--ink-faint), var(--accent)
// Pages that use Tailwind tokens (search, tag, author) can pass
// variant="tailwind" to get the gray/red Tailwind version instead.
//
// USAGE:
//   // Archive (CSS vars — matches existing styling):
//   <WPPagination
//     currentPage={currentPage}
//     hasNextPage={pageInfo.hasNextPage}
//     basePath={`/${categorySlug}/archive`}
//   />
//
//   // Search (Tailwind — preserves ?q= across pages):
//   <WPPagination
//     currentPage={currentPage}
//     hasNextPage={pageInfo.hasNextPage}
//     basePath="/search"
//     extraParams={{ q }}
//     variant="tailwind"
//   />
//
// FIXES vs previous version:
//   1. buildHref: page 1 no longer emits ?page=1 — canonical, cache-friendly URL.
//   2. Early return null when there is nothing to paginate (single page of results).
//   3. vars variant: active links now use var(--ink), not var(--ink-soft), so
//      they are visually distinct from disabled spans.
//   4. tailwind variant: page-number span now has an explicit text-gray-400 class.

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WPPaginationProps {
  currentPage: number;
  hasNextPage: boolean;
  basePath: string;
  /** Extra query params preserved across pages (e.g. { q: "harambee stars" }) */
  extraParams?: Record<string, string>;
  /**
   * "vars"     (default) — CSS var tokens matching the archive page
   * "tailwind"           — gray/red Tailwind tokens for search, tag, author pages
   */
  variant?: "vars" | "tailwind";
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Builds the href for a pagination link.
 *
 * FIX: page 1 omits the ?page= parameter entirely so that:
 *   • The first page always has a clean canonical URL (/search?q=foo, not /search?q=foo&page=1)
 *   • Next.js fetch memoisation sees the same URL on first render and page-1 nav
 *   • Search engines don't index a duplicate ?page=1 variant
 */
function buildHref(
  basePath: string,
  page: number,
  extra?: Record<string, string>,
): string {
  const params = new URLSearchParams(extra ?? {});
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function WPPagination({
  currentPage,
  hasNextPage,
  basePath,
  extraParams,
  variant = "vars",
}: WPPaginationProps) {
  const hasPrev = currentPage > 1;

  // FIX: nothing to render when there is only one page of results.
  // Previously this rendered a full border-t container with two disabled spans,
  // wasting layout space and adding meaningless DOM nodes.
  if (!hasPrev && !hasNextPage) return null;

  const prevHref = buildHref(basePath, currentPage - 1, extraParams);
  const nextHref = buildHref(basePath, currentPage + 1, extraParams);

  const isTailwind = variant === "tailwind";

  // ── Class / style tokens ──────────────────────────────────────────────────
  //
  // Active link: vars variant uses var(--ink) (not var(--ink-soft)) so that
  // active links are visually distinct from the disabled var(--ink-soft) spans.
  const activeLinkClass = isTailwind
    ? "inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-600 hover:text-red-600 transition-colors"
    : "inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider transition-colors hover:text-[var(--accent)]";

  const activeStyle = isTailwind
    ? undefined
    : { fontFamily: "var(--font-ui)", color: "var(--ink)" };

  // Disabled span: same in both variants — lower-contrast than active links
  const disabledClass = isTailwind
    ? "inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-300 select-none cursor-default"
    : "inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider opacity-25 cursor-default select-none";

  const disabledStyle = isTailwind
    ? undefined
    : { fontFamily: "var(--font-ui)", color: "var(--ink-soft)" };

  // FIX: page number now has an explicit text-gray-400 class for the tailwind
  // variant. Previously pageNumStyle was undefined and no className provided a
  // color, leaving the number invisible on some backgrounds.
  const pageNumClass = isTailwind
    ? "text-[11px] font-bold tabular-nums text-gray-400"
    : "text-[11px] font-bold tabular-nums";

  const pageNumStyle = isTailwind
    ? undefined
    : { fontFamily: "var(--font-ui)", color: "var(--ink-faint)" };

  return (
    <div
      className="mt-8 pt-8 border-t flex items-center justify-between"
      style={isTailwind ? undefined : { borderColor: "var(--rule)" }}
    >
      {/* ── Previous ──────────────────────────────────────────────────── */}
      {hasPrev ? (
        <Link
          href={prevHref}
          rel="prev"
          className={activeLinkClass}
          style={activeStyle}
        >
          <ChevronLeft size={14} aria-hidden="true" />
          Newer stories
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className={disabledClass}
          style={disabledStyle}
        >
          <ChevronLeft size={14} aria-hidden="true" />
          Newer stories
        </span>
      )}

      {/* ── Page number ───────────────────────────────────────────────── */}
      <span
        className={pageNumClass}
        style={pageNumStyle}
        aria-current="page"
        aria-label={`Page ${currentPage}`}
      >
        {currentPage}
      </span>

      {/* ── Next ──────────────────────────────────────────────────────── */}
      {hasNextPage ? (
        <Link
          href={nextHref}
          rel="next"
          className={activeLinkClass}
          style={activeStyle}
        >
          Older stories
          <ChevronRight size={14} aria-hidden="true" />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className={disabledClass}
          style={disabledStyle}
        >
          Older stories
          <ChevronRight size={14} aria-hidden="true" />
        </span>
      )}
    </div>
  );
}