// lib/wordpress.ts
// All data-fetching functions for Kurunzi Sports.
// Import from here in pages/components — never call fetchAPI directly.

import { fetchAPI, QUERIES } from './wp-api'
import type {
  SportsPost,
  WPPostNode,
  NavCategory,
  PageInfo,
  SitemapPostNode,
} from './types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Strips HTML tags from WP caption strings e.g. "<p>Photo: Reuters</p>" → "Photo: Reuters" */
function stripTags(html: string | null): string | null {
  if (!html) return null
  return html.replace(/<[^>]*>/g, '').trim() || null
}

/** Maps a raw WPPostNode to the lean SportsPost card shape */
function toSportsPost(post: WPPostNode): SportsPost {
  return {
    title: post.title,
    slug: post.slug,
    date: post.date,
    excerpt: post.excerpt ?? '',
    featuredImage: post.featuredImage?.node.sourceUrl ?? null,
    category: post.categories.nodes[0]?.name ?? 'General',
    newsData: {
      isHero: post.articleFields?.newsData?.isHero ?? false,
      isBreaking: post.articleFields?.newsData?.isBreaking ?? false,
      theLede: post.articleFields?.newsData?.theLede ?? 'No summary available.',
    },
  }
}

// ─── Posts ────────────────────────────────────────────────────────────────────

/** Homepage / feed — lean card data, 100 most recent posts */
export async function getSportsPosts(): Promise<SportsPost[]> {
  const data = await fetchAPI<{ posts: { nodes: WPPostNode[] } }>(
    QUERIES.GET_SPORTS_POSTS,
    {},
    60,
    ['posts', 'collection'],
  )
  return (data.posts?.nodes ?? []).map(toSportsPost)
}

/**
 * Full article by slug — returns the complete WPPostNode including
 * articleFields, matchData, author, SEO, and featured image caption.
 * Returns null if the post doesn't exist (triggers 404 in the page).
 */
export async function getArticleBySlug(slug: string): Promise<WPPostNode | null> {
  const data = await fetchAPI<{ post: WPPostNode | null }>(
    QUERIES.GET_ARTICLE_BY_SLUG,
    { slug },
    60,
    [`post-${slug}`],
  )

  if (!data.post) return null

  // Normalise caption to plain text
  if (data.post.featuredImage?.node.caption) {
    data.post.featuredImage.node.caption = stripTags(
      data.post.featuredImage.node.caption,
    )
  }

  return data.post
}

// ─── Archives ─────────────────────────────────────────────────────────────────

export async function getCategoryArchive(
  categorySlug: string,
  first: number = 10,
  after: string | null = null,
): Promise<{ posts: SportsPost[]; pageInfo: PageInfo }> {
  const data = await fetchAPI<{
    posts: { nodes: WPPostNode[]; pageInfo: PageInfo }
  }>(
    QUERIES.GET_CATEGORY_ARCHIVE,
    { category: categorySlug, first, after },
    60,
    [`category-${categorySlug}`],
  )

  return {
    posts: (data.posts?.nodes ?? []).map(toSportsPost),
    pageInfo: data.posts?.pageInfo ?? { hasNextPage: false, endCursor: null },
  }
}

export async function getPostsByTag(
  tagSlug: string,
  first: number = 10,
  after: string | null = null,
): Promise<{ tagInfo: { name: string; count: number; slug: string } | null; posts: SportsPost[]; pageInfo: PageInfo }> {
  const data = await fetchAPI<{
    tag: { name: string; count: number; slug: string } | null
    posts: { nodes: WPPostNode[]; pageInfo: PageInfo }
  }>(
    QUERIES.GET_POSTS_BY_TAG,
    { tag: [tagSlug], first, after },
    60,
    [`tag-${tagSlug}`],
  )

  return {
    tagInfo: data.tag ?? null,
    posts: (data.posts?.nodes ?? []).map(toSportsPost),
    pageInfo: data.posts?.pageInfo ?? { hasNextPage: false, endCursor: null },
  }
}

// ─── Author ───────────────────────────────────────────────────────────────────

export async function getAuthorProfile(
  slug: string,
  first: number = 10,
  after: string | null = null,
): Promise<{
  author: { name: string; description: string | null; avatar: { url: string } | null } | null
  posts: SportsPost[]
  pageInfo: PageInfo
}> {
  const data = await fetchAPI<{
    user: {
      name: string
      description: string | null
      avatar: { url: string } | null
      posts: { nodes: WPPostNode[]; pageInfo: PageInfo }
    } | null
  }>(
    QUERIES.GET_AUTHOR_PROFILE,
    { slug, first, after },
    300,
    [`author-${slug}`],
  )

  return {
    author: data.user
      ? { name: data.user.name, description: data.user.description ?? null, avatar: data.user.avatar ?? null }
      : null,
    posts: (data.user?.posts?.nodes ?? []).map(toSportsPost),
    pageInfo: data.user?.posts?.pageInfo ?? { hasNextPage: false, endCursor: null },
  }
}

// ─── Navigation ───────────────────────────────────────────────────────────────

/** Cached for 1 hour — categories rarely change */
export async function getNavCategories(): Promise<NavCategory[]> {
  const data = await fetchAPI<{ categories: { nodes: Array<{ name: string; slug: string }> } }>(
    QUERIES.GET_NAV_CATEGORIES,
    {},
    3600,
    ['navigation'],
  )
  return (data.categories?.nodes ?? []).map((cat) => ({
    title: cat.name,
    slug: cat.slug,
  }))
}

// ─── Search ───────────────────────────────────────────────────────────────────

/** Short revalidate (10s) — search results should feel fresh */
export async function searchArticles(searchTerm: string): Promise<SportsPost[]> {
  const data = await fetchAPI<{ posts: { nodes: WPPostNode[] } }>(
    QUERIES.SEARCH_ARTICLES,
    { query: searchTerm },
    10,
    ['search'],
  )
  return (data.posts?.nodes ?? []).map(toSportsPost)
}

// ─── Sitemap ──────────────────────────────────────────────────────────────────

/** Used by next-sitemap or generateStaticParams. Cached for 24h. */
export async function getAllPostSlugs(): Promise<
  { slug: string; date: string; category: string }[]
> {
  const data = await fetchAPI<{ posts: { nodes: SitemapPostNode[] } }>(
    QUERIES.GET_ALL_SLUGS,
    {},
    86400,
    ['sitemap-data'],
  )
  return (data.posts?.nodes ?? []).map((post) => ({
    slug: post.slug,
    date: post.date,
    category: post.categories?.nodes[0]?.slug ?? 'news',
  }))
}