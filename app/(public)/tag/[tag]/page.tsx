// app/tag/[tag]/page.tsx
// Tag archive — mirrors the search page structure exactly.
// White header (breadcrumb + red-bar title + count) on gray-50 page background.
// Cursor-based pagination via WPPagination (variant="tailwind").
// PD title pattern: first post's title as page <title> on page 1.

import WPPostListItem from '@/app/_components/wordpress/WPArchiveListItem'
import WPPagination from '@/app/_components/wordpress/WPPagination'
import { getPostsByTag } from '@/lib/wordpress/data'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const PER_PAGE = 15

interface PageProps {
  params: Promise<{ tag: string }>
  searchParams: Promise<{ page?: string }>
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { tag: tagSlug } = await params
  const { page: pageParam } = await searchParams
  const currentPage = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  const after = currentPage > 1
    ? btoa(`arrayconnection:${(currentPage - 1) * PER_PAGE - 1}`)
    : null

  const { tagInfo, posts } = await getPostsByTag(tagSlug, PER_PAGE, after)
  const tagName = tagInfo?.name ?? decodeURIComponent(tagSlug).replace(/-/g, ' ')

  const title =
    currentPage === 1 && posts.length > 0
      ? `${posts[0].title} | Kurunzi Sports`
      : currentPage > 1 && posts.length > 0
        ? `#${tagName} — Page ${currentPage} | Kurunzi Sports`
        : `#${tagName} | Kurunzi Sports`

  return {
    title,
    description: `Stories tagged #${tagName} on Kurunzi Sports.`,
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function TagPage({ params, searchParams }: PageProps) {
  const { tag: tagSlug } = await params
  const { page: pageParam } = await searchParams

  const currentPage = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)
  const after = currentPage > 1
    ? btoa(`arrayconnection:${(currentPage - 1) * PER_PAGE - 1}`)
    : null

  const { tagInfo, posts, pageInfo } = await getPostsByTag(tagSlug, PER_PAGE, after)

  if (posts.length === 0) notFound()

  const tagName = tagInfo?.name ?? decodeURIComponent(tagSlug).replace(/-/g, ' ')

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
            <Link href="/tags" className="hover:text-red-600 transition-colors">
              Tags
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-gray-600">{tagName}</span>
          </nav>

          {/* Title row */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-8 bg-red-600 rounded-sm shrink-0" aria-hidden="true" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              <span className="text-red-600">#</span>{tagName}
            </h1>
          </div>

          {/* Count + page indicator */}
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
            {tagInfo?.count
              ? `${tagInfo.count} ${tagInfo.count === 1 ? 'story' : 'stories'}`
              : 'Tagged stories'}
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
        <div className="rounded-lg shadow-sm border border-gray-100 bg-white divide-y divide-gray-100 px-4 sm:px-6">
          {posts.map((post, index) => (
            <WPPostListItem
              key={post.slug}
              post={post}
              priority={index < 2}
              variant="default"
            />
          ))}
        </div>

        <WPPagination
          currentPage={currentPage}
          hasNextPage={pageInfo.hasNextPage}
          basePath={`/tag/${tagSlug}`}
          variant="tailwind"
        />
      </div>

    </main>
  )
}