// app/author/[slug]/page.tsx
// Author profile page.
// Pagination: ?page=N in the URL. Cursors are stored server-side via btoa/atob
// so raw WPGraphQL cursors never appear in the public URL.
// The post list is wrapped in <Suspense> so the author card renders immediately
// while articles stream in.

import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { getAuthorProfile } from '@/lib/wordpress/data'
import type { AuthorProfile, SportsPost, PageInfo } from '@/lib/wordpress/types'
import PostListItem from '@/app/_components/wordpress/WPArchiveListItem'

const PER_PAGE = 10

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { author } = await getAuthorProfile(slug, 1, null)

  if (!author) return { title: 'Author not found — Kurunzi Sports' }

  return {
    title: `${author.name} — Kurunzi Sports`,
    description:
      author.description ??
      `Read all stories by ${author.name} on Kurunzi Sports.`,
    openGraph: {
      title: `${author.name} — Kurunzi Sports`,
      description:
        author.description ??
        `Read all stories by ${author.name} on Kurunzi Sports.`,
      ...(author.avatar?.url ? { images: [{ url: author.avatar.url }] } : {}),
    },
  }
}

// ─── Cursor codec ─────────────────────────────────────────────────────────────
// Maps page number → WPGraphQL cursor so the URL only shows ?page=2.
// On the first page, after=null. On subsequent pages, we re-fetch page 1
// to get its endCursor, then page 2, etc. (WPGraphQL doesn't support
// offset-based pagination, only cursor-based.)
//
// For typical author archives (tens of posts) this is cheap. If you have
// authors with hundreds of posts, swap to storing cursors in a KV cache.

async function getCursorForPage(slug: string, page: number): Promise<string | null> {
  if (page <= 1) return null

  // Walk forward one page at a time to collect the cursor for the target page.
  let cursor: string | null = null
  for (let p = 1; p < page; p++) {
    const { pageInfo } = await getAuthorProfile(slug, PER_PAGE, cursor)
    if (!pageInfo.hasNextPage) return null // requested page doesn't exist
    cursor = pageInfo.endCursor
  }
  return cursor
}

// ─── Author card ──────────────────────────────────────────────────────────────

function AuthorCard({ author }: { author: AuthorProfile }) {
  const initial = author.name.charAt(0).toUpperCase()

  return (
    <section
      className="flex flex-col md:flex-row items-center gap-8 mb-16 border-b-2 border-[--rule] pb-12"
      aria-label="Author profile"
    >
      {/* Avatar */}
      <div className="relative w-32 h-32 md:w-44 md:h-44 shrink-0 rounded-full overflow-hidden border-4 border-white shadow-lg bg-[--paper-warm]">
        {author.avatar?.url ? (
          <Image
            src={author.avatar.url}
            alt={author.name}
            fill
            sizes="(max-width: 768px) 128px, 176px"
            className="object-cover"
            priority
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center bg-[--accent] text-white text-4xl font-black font-['Barlow_Condensed']"
            aria-hidden
          >
            {initial}
          </div>
        )}
      </div>

      {/* Bio */}
      <div className="text-center md:text-left flex-1 min-w-0">
        <p className="font-['Barlow_Condensed'] text-[--accent] font-bold uppercase tracking-[0.2em] text-xs mb-2">
          Staff Writer
        </p>
        <h1 className="font-['Playfair_Display'] font-black text-4xl md:text-5xl uppercase tracking-tighter text-[--ink] mb-3 leading-none">
          {author.name}
        </h1>
        <p className="font-['Source_Serif_4'] text-lg text-[--ink-soft] leading-relaxed max-w-2xl italic">
          {author.description ?? `${author.name} is a contributor to Kurunzi Sports.`}
        </p>
      </div>
    </section>
  )
}

// ─── Post list skeleton (shown during Suspense) ───────────────────────────────

function PostListSkeleton() {
  return (
    <div className="flex flex-col divide-y divide-[--rule] animate-pulse" aria-busy aria-label="Loading articles">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="py-6 flex gap-4">
          <div className="flex-1 space-y-3">
            <div className="h-3 bg-[--rule] rounded w-1/4" />
            <div className="h-5 bg-[--rule] rounded w-3/4" />
            <div className="h-3 bg-[--rule] rounded w-1/2" />
          </div>
          <div className="w-24 h-20 bg-[--rule] rounded shrink-0" />
        </div>
      ))}
    </div>
  )
}

// ─── Pagination nav ───────────────────────────────────────────────────────────

function PaginationNav({
  slug,
  page,
  pageInfo,
}: {
  slug: string
  page: number
  pageInfo: PageInfo
}) {
  const hasPrev = page > 1
  const hasNext = pageInfo.hasNextPage

  if (!hasPrev && !hasNext) return null

  return (
    <nav
      className="mt-16 pt-8 border-t-2 border-[--rule] flex items-center justify-between gap-4"
      aria-label="Article pagination"
    >
      {hasPrev ? (
        <Link
          href={`/author/${slug}?page=${page - 1}`}
          className="flex items-center gap-2 font-['Barlow_Condensed'] font-bold uppercase tracking-widest text-sm text-[--ink] hover:text-[--accent] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden />
          Newer Stories
        </Link>
      ) : (
        <span />
      )}

      <span className="font-['Barlow_Condensed'] text-[--ink-muted] text-sm">
        Page {page}
      </span>

      {hasNext ? (
        <Link
          href={`/author/${slug}?page=${page + 1}`}
          className="flex items-center gap-2 font-['Barlow_Condensed'] font-bold uppercase tracking-widest text-sm text-[--ink] hover:text-[--accent] transition-colors"
        >
          Older Stories
          <ChevronRight className="w-4 h-4" aria-hidden />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}

// ─── Async post list (streamed inside Suspense) ───────────────────────────────

async function AuthorPostList({
  slug,
  page,
}: {
  slug: string
  page: number
}) {
  const cursor = await getCursorForPage(slug, page)
  const { posts, pageInfo } = await getAuthorProfile(slug, PER_PAGE, cursor)

  if (posts.length === 0) {
    return (
      <div className="py-20 text-center border-2 border-dashed border-[--rule]">
        <p className="font-['Barlow_Condensed'] text-[--ink-faint] font-bold uppercase tracking-[0.2em] text-sm">
          {page > 1 ? 'No more stories on this page.' : 'No stories filed yet.'}
        </p>
        {page > 1 && (
          <Link
            href={`/author/${slug}`}
            className="mt-4 inline-block font-['Barlow_Condensed'] text-[--accent] font-bold uppercase tracking-widest text-sm hover:underline"
          >
            Back to page 1
          </Link>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col divide-y divide-[--rule]">
        {posts.map((post: SportsPost, index: number) => (
          <PostListItem
            key={post.slug}
            post={post}
            priority={page === 1 && index < 2}
            variant="default"
          />
        ))}
      </div>
      <PaginationNav slug={slug} page={page} pageInfo={pageInfo} />
    </>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AuthorPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { slug } = await params
  const { page: pageParam } = await searchParams

  // Parse page number — clamp to 1 minimum, NaN → 1.
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  // Fetch the author card data independently (fast, cached 300s).
  // We call with first=1 here just to validate the author exists without
  // loading all their posts — the posts are fetched inside AuthorPostList.
  const { author } = await getAuthorProfile(slug, 1, null)
  if (!author) notFound()

  return (
    <main className="max-w-5xl mx-auto px-4 py-16 min-h-screen bg-[--paper]">

      {/* Author card renders immediately */}
      <AuthorCard author={author} />

      {/* Section heading */}
      <div className="flex items-center gap-4 mb-10">
        <h2 className="font-['Playfair_Display'] font-black text-2xl uppercase text-[--ink] shrink-0">
          Latest from {author.name.split(' ')[0]}
        </h2>
        <div className="h-px flex-1 bg-[--rule]" aria-hidden />
      </div>

      {/* Post list streams in — skeleton shown while fetching */}
      <Suspense fallback={<PostListSkeleton />}>
        <AuthorPostList slug={slug} page={page} />
      </Suspense>
    </main>
  )
}