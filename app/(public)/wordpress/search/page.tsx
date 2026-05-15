// app/search/page.tsx
// URL-driven search: reads ?q= from searchParams, renders a GET form + results.
// No client state for the query — form submission reloads the page with new ?q=.

import PostListItem from '@/app/_components/wordpress/WPArchiveListItem'
import { searchArticles } from '@/lib/wordpress/data'
import type { SportsPost } from '@/lib/wordpress/types'
import { Search } from 'lucide-react'
import type { Metadata } from 'next'

// Always fetch fresh results — search must never be stale.
export const dynamic = 'force-dynamic'

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q ? `Search: "${q}" — Kurunzi Sports` : 'Search — Kurunzi Sports',
    description: q
      ? `Search results for "${q}" in the Kurunzi Sports archives.`
      : 'Search for teams, players, tournaments, and stories on Kurunzi Sports.',
    robots: { index: false }, // search pages should not be indexed
  }
}

// ─── Search Form ──────────────────────────────────────────────────────────────
// Pure HTML form with GET method — no JS required, works with RSC.

function SearchForm({ query }: { query: string }) {
  return (
    <form
      method="GET"
      action="/search"
      className="relative flex items-center gap-0 mt-8 max-w-2xl"
    >
      <label htmlFor="search-input" className="sr-only">
        Search Kurunzi Sports
      </label>
      <input
        id="search-input"
        name="q"
        type="search"
        defaultValue={query}
        placeholder="Search teams, players, tournaments…"
        autoComplete="off"
        className={[
          "flex-1 h-12 px-5",
          "bg-white border-2 border-[--rule] border-r-0",
          "font-['Source_Serif_4'] text-[--ink] placeholder:text-[--ink-faint]",
          "focus:outline-none focus:border-[--accent]",
          "transition-colors",
        ].join(' ')}
      />
      <button
        type="submit"
        aria-label="Run search"
        className={[
          "h-12 px-6 flex items-center gap-2",
          "bg-[--accent] hover:bg-[--accent-dark] text-white",
          "font-['Barlow_Condensed'] font-bold uppercase tracking-widest text-sm",
          "transition-colors",
        ].join(' ')}
      >
        <Search className="w-4 h-4" aria-hidden />
        Search
      </button>
    </form>
  )
}

// ─── Results list ─────────────────────────────────────────────────────────────

function ResultsList({ posts, query }: { posts: SportsPost[]; query: string }) {
  if (posts.length === 0) {
    return (
      <div className="py-24 text-center border-2 border-dashed border-[--rule] bg-white">
        <p className="font-['Barlow_Condensed'] text-[--ink-faint] font-bold uppercase tracking-[0.2em] text-sm mb-3">
          No matches found
        </p>
        <p className="text-[--ink-muted] text-sm font-['Source_Serif_4'] mb-6">
          No stories found for{' '}
          <span className="italic">&ldquo;{query}&rdquo;</span>. Try searching
          for teams, players, or specific tournaments.
        </p>
        <a
          href="/"
          className={[
            "inline-block bg-[--accent] text-white",
            "px-6 py-2 rounded-full",
            "font-['Barlow_Condensed'] font-bold uppercase tracking-widest text-sm",
            "hover:bg-[--accent-dark] transition-colors",
          ].join(' ')}
        >
          Return Home
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col divide-y divide-[--rule]">
      {posts.map((post, index) => (
         <PostListItem
          key={post.slug}
          post={post}
          priority={index < 2}
          variant="default"
        />
      ))}
    </div>
  )
}

// ─── Prompt state (no query entered yet) ──────────────────────────────────────

function SearchPrompt() {
  return (
    <div className="py-24 text-center border-2 border-dashed border-[--rule]">
      <Search className="w-10 h-10 text-[--ink-faint] mx-auto mb-4" aria-hidden />
      <p className="font-['Barlow_Condensed'] text-[--ink-faint] font-bold uppercase tracking-[0.2em] text-sm mb-2">
        Start typing above
      </p>
      <p className="text-[--ink-muted] text-sm font-['Source_Serif_4']">
        Search the full Kurunzi Sports archive.
      </p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = (q ?? '').trim()
  const results: SportsPost[] = query ? await searchArticles(query) : []

  return (
    <main className="max-w-4xl mx-auto px-4 py-16 min-h-screen bg-[--paper]">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="mb-12 border-b-2 border-[--rule] pb-10">
        <div className="flex items-center gap-3 mb-3 text-[--accent]">
          <Search className="w-5 h-5" aria-hidden />
          <span
            className="font-['Barlow_Condensed'] font-bold uppercase tracking-[0.2em] text-xs"
            aria-hidden
          >
            Database Search
          </span>
        </div>

        <h1 className="font-['Playfair_Display'] font-black text-3xl md:text-5xl uppercase tracking-tighter text-[--ink]">
          {query ? (
            <>
              Results for:{' '}
              <span className="text-[--accent]">&ldquo;{query}&rdquo;</span>
            </>
          ) : (
            'Search the Archive'
          )}
        </h1>

        {query && (
          <p className="font-['Source_Serif_4'] text-[--ink-muted] italic mt-2 text-sm">
            {results.length === 1
              ? '1 story found in the Kurunzi Sports archive.'
              : `${results.length} stories found in the Kurunzi Sports archive.`}
          </p>
        )}

        <SearchForm query={query} />
      </header>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      {query ? (
        <ResultsList posts={results} query={query} />
      ) : (
        <SearchPrompt />
      )}
    </main>
  )
}