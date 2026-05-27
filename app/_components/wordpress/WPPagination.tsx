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

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface WPPaginationProps {
  currentPage: number;
  hasNextPage: boolean;
  basePath: string;
  // Extra query params preserved across pages (e.g. { q: "harambee stars" })
  extraParams?: Record<string, string>;
  // "vars" (default) — CSS var tokens matching the archive page
  // "tailwind"       — gray/red Tailwind tokens for search, tag, author pages
  variant?: "vars" | "tailwind";
}

function buildHref(
  basePath: string,
  page: number,
  extra?: Record<string, string>
): string {
  const params = new URLSearchParams({ ...extra, page: String(page) });
  return `${basePath}?${params.toString()}`;
}

export default function WPPagination({
  currentPage,
  hasNextPage,
  basePath,
  extraParams,
  variant = "vars",
}: WPPaginationProps) {
  const hasPrev = currentPage > 1;
  const prevHref = buildHref(basePath, currentPage - 1, extraParams);
  const nextHref = buildHref(basePath, currentPage + 1, extraParams);

  const isTailwind = variant === "tailwind";

  // Shared className for active links
  const activeLinkClass = isTailwind
    ? "inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-600 hover:text-red-600 transition-colors"
    : "inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider transition-colors hover:text-[var(--accent)]";

  // Shared className for disabled spans
  const disabledClass = isTailwind
    ? "inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-300 select-none cursor-default"
    : "inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider opacity-25 cursor-default";

  const activeStyle = isTailwind
    ? undefined
    : { fontFamily: "var(--font-ui)", color: "var(--ink-soft)" };

  const disabledStyle = isTailwind
    ? undefined
    : { fontFamily: "var(--font-ui)", color: "var(--ink-soft)" };

  const pageNumStyle = isTailwind
    ? undefined
    : { fontFamily: "var(--font-ui)", color: "var(--ink-faint)" };

  return (
    <div
      className="mt-8 pt-8 border-t flex items-center justify-between"
      style={isTailwind ? undefined : { borderColor: "var(--rule)" }}
    >
      {/* ── Previous ────────────────────────────────────────────────── */}
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

      {/* ── Page number ─────────────────────────────────────────────── */}
      <span
        className="text-[11px] font-bold tabular-nums"
        style={pageNumStyle}
        aria-current="page"
        aria-label={`Page ${currentPage}`}
      >
        {currentPage}
      </span>

      {/* ── Next ────────────────────────────────────────────────────── */}
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