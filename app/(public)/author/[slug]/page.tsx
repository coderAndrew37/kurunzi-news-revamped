// app/author/[slug]/page.tsx
// Author archive — mirrors search and tag page structure.
// White header (breadcrumb + avatar + name + bio) on gray-50 page background.
// Cursor-based pagination via WPPagination (variant="tailwind").
// PD title pattern: first post's title as page <title> on page 1.

import WPPostListItem from '@/app/_components/wordpress/WPArchiveListItem'
import WPPagination from '@/app/_components/wordpress/WPPagination'
import { getAuthorProfile } from '@/lib/wordpress/data'
import type { AuthorProfile } from '@/lib/wordpress/types'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const PER_PAGE = 10

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

// ── Cursor helper ─────────────────────────────────────────────────────────────
// Maps ?page=N → WPGraphQL cursor. Keeps raw cursors out of the public URL.

async function getCursorForPage(slug: string, page: number): Promise<string | null> {
  if (page <= 1) return null
  let cursor: string | null = null
  for (let p = 1; p < page; p++) {
    const { pageInfo } = await getAuthorProfile(slug, PER_PAGE, cursor)
    if (!pageInfo.hasNextPage) return null
    cursor = pageInfo.endCursor
  }
  return cursor
}

// ── Metadata ──────────────────────────────────────────────────────────────────
// PD pattern on page 1 when posts exist; neutral title on subsequent pages.

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  const cursor = await getCursorForPage(slug, page)
  const { author, posts } = await getAuthorProfile(slug, PER_PAGE, cursor)

  if (!author) return { title: 'Author not found — Kurunzi Sports' }

  const title =
    page === 1 && posts.length > 0
      ? `${posts[0].title} | Kurunzi Sports`
      : page > 1 && posts.length > 0
        ? `${author.name} — Page ${page} | Kurunzi Sports`
        : `${author.name} | Kurunzi Sports`

  return {
    title,
    description: author.description ?? `Read all stories by ${author.name} on Kurunzi Sports.`,
    openGraph: {
      title,
      description: author.description ?? `Read all stories by ${author.name} on Kurunzi Sports.`,
      ...(author.avatar?.url ? { images: [{ url: author.avatar.url }] } : {}),
    },
  }
}

// ── Author card ───────────────────────────────────────────────────────────────

function AuthorCard({ author }: { author: AuthorProfile }) {
  const initial = author.name.charAt(0).toUpperCase()

  return (
    <div className="flex items-center gap-5 sm:gap-6">
      {/* Avatar */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gray-100 shrink-0 ring-2 ring-gray-100">
        {author.avatar?.url ? (
          <Image
            src={author.avatar.url}
            alt={author.name}
            fill
            sizes="80px"
            className="object-cover"
            priority
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center bg-red-600 text-white text-2xl font-black"
            aria-hidden="true"
          >
            {initial}
          </div>
        )}
      </div>

      {/* Name + bio */}
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-0.5">
          Staff Writer
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight">
          {author.name}
        </h1>
        {author.description && (
          <p className="mt-1 text-sm text-gray-500 leading-snug line-clamp-2">
            {author.description}
          </p>
        )}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AuthorPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  const currentPage = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  const cursor = await getCursorForPage(slug, currentPage)
  const { author, posts, pageInfo } = await getAuthorProfile(slug, PER_PAGE, cursor)

  if (!author || posts.length === 0) notFound()

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
            <span className="text-gray-600">Authors</span>
            <span aria-hidden="true">/</span>
            <span className="text-gray-600">{author.name}</span>
          </nav>

          <AuthorCard author={author} />

          {/* Story count + page indicator */}
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
            Stories by {author.name.split(' ')[0]}
            {currentPage > 1 && (
              <>
                <span className="text-gray-300 mx-2" aria-hidden="true">·</span>
                Page {currentPage}
              </>
            )}
          </p>

        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-6">
        <div className=" divide-y divide-gray-100 px-4 sm:px-6">
          {posts.map((post, index) => (
            <WPPostListItem
              key={post.slug}
              post={post}
              priority={currentPage === 1 && index < 2}
              variant="default"
            />
          ))}
        </div>

        <WPPagination
          currentPage={currentPage}
          hasNextPage={pageInfo.hasNextPage}
          basePath={`/author/${slug}`}
          variant="tailwind"
        />
      </div>

    </main>
  )
}