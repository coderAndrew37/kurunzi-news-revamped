// lib/wordpress/data.ts
// All data-fetching functions. Import from here in pages/components.
// Never call fetchAPI directly from pages.

import { fetchAPI, QUERIES, getNavCategories } from "./wp-api";
import type {
  AuthorProfile,
  NavCategory,
  PageInfo,
  SitemapPostNode,
  SportsPost,
  TagInfo,
  WPPostNode,
} from "./types";

// Re-export getNavCategories from wp-api so consumers keep importing from data.ts
export { getNavCategories };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stripTags(html: string | null): string | null {
  if (!html) return null;
  return html.replace(/<[^>]*>/g, "").trim() || null;
}

function toSportsPost(post: WPPostNode): SportsPost {
  return {
    title: post.title,
    slug: post.slug,
    date: post.date,
    excerpt: post.excerpt ?? "",
    featuredImage: post.featuredImage?.node.sourceUrl ?? null,
    category: post.categories.nodes[0]?.name ?? "General",
    newsData: {
      isHero: post.articleFields?.newsData?.isHero ?? false,
      isBreaking: post.articleFields?.newsData?.isBreaking ?? false,
      theLede: post.articleFields?.newsData?.theLede ?? "",
    },
  };
}

// ─── Internal WP response shapes (never exported) ─────────────────────────────

interface WPUserNode {
  name: string;
  description: string | null;
  avatar: { url: string } | null;
  posts: {
    nodes: WPPostNode[];
    pageInfo: PageInfo;
  };
}

// ─── Posts ────────────────────────────────────────────────────────────────────

export async function getSportsPosts(): Promise<SportsPost[]> {
  const data = await fetchAPI<{ posts: { nodes: WPPostNode[] } }>(
    QUERIES.GET_SPORTS_POSTS,
    {},
    60,
    ["posts", "collection"],
  );
  return (data.posts?.nodes ?? []).map(toSportsPost);
}

export async function getArticleBySlug(
  slug: string,
): Promise<WPPostNode | null> {
  const data = await fetchAPI<{ post: WPPostNode | null }>(
    QUERIES.GET_ARTICLE_BY_SLUG,
    { slug },
    60,
    [`post-${slug}`],
  );

  if (!data.post) return null;

  // Normalise caption HTML → plain text
  const imgNode = data.post.featuredImage?.node;
  if (imgNode?.caption) {
    imgNode.caption = stripTags(imgNode.caption);
  }

  return data.post;
}

// ─── Archives ─────────────────────────────────────────────────────────────────

export async function getCategoryArchive(
  categorySlug: string,
  first = 10,
  after: string | null = null,
): Promise<{ posts: SportsPost[]; pageInfo: PageInfo }> {
  const data = await fetchAPI<{
    posts: { nodes: WPPostNode[]; pageInfo: PageInfo };
  }>(
    QUERIES.GET_CATEGORY_ARCHIVE,
    { category: categorySlug, first, after },
    60,
    [`category-${categorySlug}`],
  );

  return {
    posts: (data.posts?.nodes ?? []).map(toSportsPost),
    pageInfo: data.posts?.pageInfo ?? { hasNextPage: false, endCursor: null },
  };
}

export async function getPostsByTag(
  tagSlug: string,
  first = 10,
  after: string | null = null,
): Promise<{
  tagInfo: TagInfo | null;
  posts: SportsPost[];
  pageInfo: PageInfo;
}> {
  const data = await fetchAPI<{
    tag: TagInfo | null;
    posts: { nodes: WPPostNode[]; pageInfo: PageInfo };
  }>(
    QUERIES.GET_POSTS_BY_TAG,
    // tagSlug: single string → matches $tagSlug: ID!
    // slugs:   array        → matches $slugs: [String] used in tagSlugIn
    { tagSlug, slugs: [tagSlug], first, after },
    60,
    [`tag-${tagSlug}`],
  );

  return {
    tagInfo: data.tag ?? null,
    posts: (data.posts?.nodes ?? []).map(toSportsPost),
    pageInfo: data.posts?.pageInfo ?? { hasNextPage: false, endCursor: null },
  };
}

// ─── Author ───────────────────────────────────────────────────────────────────

export async function getAuthorProfile(
  slug: string,
  first = 10,
  after: string | null = null,
): Promise<{
  author: AuthorProfile | null;
  posts: SportsPost[];
  pageInfo: PageInfo;
}> {
  const data = await fetchAPI<{ user: WPUserNode | null }>(
    QUERIES.GET_AUTHOR_PROFILE,
    { slug, first, after },
    300,
    [`author-${slug}`],
  );

  return {
    author: data.user
      ? {
          name: data.user.name,
          description: data.user.description,
          avatar: data.user.avatar,
        }
      : null,
    posts: (data.user?.posts?.nodes ?? []).map(toSportsPost),
    pageInfo: data.user?.posts?.pageInfo ?? {
      hasNextPage: false,
      endCursor: null,
    },
  };
}

// ─── Search ───────────────────────────────────────────────────────────────────

export async function searchArticles(
  searchTerm: string,
): Promise<SportsPost[]> {
  const data = await fetchAPI<{ posts: { nodes: WPPostNode[] } }>(
    QUERIES.SEARCH_ARTICLES,
    { query: searchTerm },
    10,
    ["search"],
  );
  return (data.posts?.nodes ?? []).map(toSportsPost);
}

// ─── Sitemap ──────────────────────────────────────────────────────────────────

export async function getAllPostSlugs(): Promise<{ slug: string; date: string; category: string }[]> {
  const data = await fetchAPI<{ posts: { nodes: SitemapPostNode[] } }>(
    QUERIES.GET_ALL_SLUGS,
    {},
    86400,
    ["sitemap-data"],
  );
  return (data.posts?.nodes ?? []).map((post) => ({
    slug: post.slug,
    date: post.date,
    category: post.categories?.nodes[0]?.slug ?? "news",
  }));
}