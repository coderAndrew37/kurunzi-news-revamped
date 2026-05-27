// app/search/page.tsx
// URL-driven search: reads ?q= and ?page= from searchParams.
// searchArticles returns SportsPost[] (full result set) — we slice in-page.
// Pagination via WPPagination (variant="tailwind", extraParams={{ q }}).
// PD title pattern: first result's title is the page <title> on page 1.
// Search pages are noindex.

import WPPostListItem from '@/app/_components/wordpress/WPArchiveListItem'
import WPPagination from '@/app/_components/wordpress/WPPagination'
import { searchArticles } from '@/lib/wordpress/data'
import type { SportsPost } from '@/lib/wordpress/types'
import { Search } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const PER_PAGE = 10

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}): Promise<Metadata> {
  const { q, page: pageParam } = await searchParams
  const query = (q ?? '').trim()
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  if (!query) {
    return {
      title: 'Search — Kurunzi Sports',
      description: 'Search for teams, players, tournaments, and stories on Kurunzi Sports.',
      robots: { index: false },
    }
  }

  // searchArticles returns SportsPost[] — memoized with page component's call
  const allResults: SportsPost[] = await searchArticles(query)
  const pageResults = allResults.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const title =
    page === 1 && allResults.length > 0
      ? `${allResults[0].title} | Kurunzi Sports`
      : page > 1 && pageResults.length > 0
        ? `Search: "${query}" — Page ${page} | Kurunzi Sports`
        : `No results for "${query}" — Kurunzi Sports`

  return {
    title,
    description: `Search results for "${query}" on Kurunzi Sports.`,
    robots: { index: false },
  }
}

// ── Search Form ───────────────────────────────────────────────────────────────
// No hidden page input — changing the query always resets to page 1.

function SearchForm({ query }: { query: string }) {
  return (
    <form
      method="GET"
      action="/search"
      className="flex items-center mt-6 max-w-xl"
    >
      <label htmlFor="search-input" className="sr-only">
        Search Kurunzi Sports
      </label>
      <input
        id="search-input"
        name="q"
        type="search"
        defaultValue={query}
        placeholder="Teams, players, tournaments…"
        autoComplete="off"
        className="flex-1 h-11 px-4 bg-white border-2 border-gray-200 border-r-0 text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-red-600 transition-colors"
      />
      <button
        type="submit"
        aria-label="Run search"
        className="h-11 px-5 flex items-center gap-2 bg-red-600 hover:bg-gray-900 text-white font-bold uppercase tracking-wider text-xs transition-colors"
      >
        <Search className="w-4 h-4" aria-hidden="true" />
        Search
      </button>
    </form>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────

function NoResults({ query }: { query: string }) {
  return (
    <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-lg bg-white">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
        No matches found
      </p>
      <p className="text-sm text-gray-500 mb-6">
        No stories found for{' '}
        <span className="italic">&ldquo;{query}&rdquo;</span>.
        Try searching for a team, player, or tournament.
      </p>
      <Link
        href="/"
        className="inline-block bg-red-600 hover:bg-gray-900 text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors rounded"
      >
        Return Home
      </Link>
    </div>
  )
}

// ── Prompt state ──────────────────────────────────────────────────────────────

function SearchPrompt() {
  return (
    <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-lg bg-white">
      <Search className="w-8 h-8 text-gray-300 mx-auto mb-3" aria-hidden="true" />
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
        Start typing above
      </p>
      <p className="text-sm text-gray-500">
        Search the full Kurunzi Sports archive.
      </p>
    </div>
  )
}

// ── Results list ──────────────────────────────────────────────────────────────

function ResultsList({ posts }: { posts: SportsPost[] }) {
  return (
    <div className=" divide-y divide-gray-100 px-4 sm:px-6">
      {posts.map((post, index) => (
        <WPPostListItem
          key={post.slug}
          post={post}
          priority={index < 2}
          variant="default"
        />
      ))}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q, page: pageParam } = await searchParams
  const query = (q ?? '').trim()
  const currentPage = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  // searchArticles returns SportsPost[] — slice here for the current page
  const allResults: SportsPost[] = query ? await searchArticles(query) : []

  const totalCount = allResults.length
  const totalPages = Math.ceil(totalCount / PER_PAGE)
  const hasNextPage = currentPage < totalPages

  const pageResults = allResults.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  )

  return (
    <main className="min-h-screen bg-gray-50 pb-16">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[760px] mx-auto px-4 sm:px-6 pt-8 pb-8">

          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 mb-5 text-[10px] font-bold uppercase tracking-widest text-gray-400"
          >
            <Link href="/" className="hover:text-red-600 transition-colors">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-gray-600">Search</span>
          </nav>

          {/* Title row */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-8 bg-red-600 rounded-sm shrink-0" aria-hidden="true" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              {query ? (
                <>
                  Results for{' '}
                  <span className="text-red-600">&ldquo;{query}&rdquo;</span>
                </>
              ) : (
                'Search'
              )}
            </h1>
          </div>

          {/* Result count + page indicator */}
          {query && (
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
              {totalCount === 0
                ? 'No results'
                : totalCount === 1
                  ? '1 story found'
                  : `${totalCount} stories found`}
              {totalPages > 1 && (
                <>
                  <span className="text-gray-300 mx-2" aria-hidden="true">·</span>
                  Page {currentPage} of {totalPages}
                </>
              )}
            </p>
          )}

          <SearchForm query={query} />
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-6">
        {!query && <SearchPrompt />}
        {query && totalCount === 0 && <NoResults query={query} />}
        {query && pageResults.length > 0 && (
          <>
            <ResultsList posts={pageResults} />
            <WPPagination
              currentPage={currentPage}
              hasNextPage={hasNextPage}
              basePath="/search"
              extraParams={{ q: query }}
              variant="tailwind"
            />
          </>
        )}
      </div>

    </main>
  )
}