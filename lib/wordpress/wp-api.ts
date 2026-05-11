// lib/api.ts
// Core fetcher + all GraphQL query strings.
// Import fetchAPI and QUERIES into wordpress.ts only — not into pages directly.

// ─── Core Fetcher ─────────────────────────────────────────────────────────────

export async function fetchAPI<T>(
  query: string,
  variables: Record<string, unknown> = {},
  revalidate: number = 60,
  tags: string[] = ['wordpress-data'],
): Promise<T> {
  const url = process.env.WORDPRESS_API_URL

  if (!url) {
    throw new Error('WORDPRESS_API_URL is not set in environment variables')
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { revalidate, tags },
  })

  if (!res.ok) {
    throw new Error(`WordPress API responded with ${res.status}: ${res.statusText}`)
  }

  const json = await res.json()

  if (json.errors) {
    console.error('[WP-API Error]:', JSON.stringify(json.errors, null, 2))
    throw new Error(json.errors[0]?.message ?? 'Failed to fetch from WordPress')
  }

  return json.data as T
}

// ─── Query Strings ────────────────────────────────────────────────────────────
// Rules:
// - newsData, matchData, etc. always live under articleFields { }
// - featuredImage always includes caption and mediaDetails for next/image
// - seo block requires WPGraphQL for RankMath plugin

export const QUERIES = {

  // ── Homepage / feed ─────────────────────────────────────────────────────────
  GET_SPORTS_POSTS: `
    query GetSportsData {
      posts(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          title
          slug
          date
          excerpt
          categories { nodes { name slug } }
          featuredImage {
            node {
              sourceUrl
              altText
              caption
              mediaDetails { width height }
            }
          }
          articleFields {
            newsData { isHero isBreaking theLede }
            articleCategoryType
            isHeroSlider
          }
        }
      }
    }
  `,

  // ── Single article ───────────────────────────────────────────────────────────
  // caption on featuredImage = photo credit line shown below hero image.
  // content contains the full post body HTML including any inline <img> blocks
  // added via Gutenberg image blocks — these are handled on the frontend
  // by the RichText / content renderer component.
  GET_ARTICLE_BY_SLUG: `
    query GetArticleBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        title
        content
        date
        excerpt
        slug
        categories { nodes { name slug } }
        tags { nodes { name slug } }
        featuredImage {
          node {
            sourceUrl
            altText
            caption
            mediaDetails { width height }
          }
        }
        articleFields {
          newsData { isHero isBreaking theLede }
          matchData {
            homeTeam
            awayTeam
            finalScore
            competition
            matchDatetime
            venue
            matchStatus
          }
          articleCategoryType
          readingTime
          featuredVideo
          isHeroSlider
          relatedArticles {
            nodes {
              ... on Post { title slug }
            }
          }
        }
        author {
          node {
            name
            slug
            description
            avatar { url }
          }
        }
        seo {
          title
          description
          canonicalUrl
          openGraph {
            title
            description
            image { url }
          }
        }
      }
    }
  `,

  // ── Category archive with pagination ────────────────────────────────────────
  GET_CATEGORY_ARCHIVE: `
    query GetCategoryArchive($category: String!, $first: Int!, $after: String) {
      posts(
        where: { categoryName: $category, orderby: { field: DATE, order: DESC } }
        first: $first
        after: $after
      ) {
        pageInfo { hasNextPage endCursor }
        nodes {
          title
          slug
          date
          excerpt
          categories { nodes { name slug } }
          featuredImage {
            node {
              sourceUrl
              altText
              caption
              mediaDetails { width height }
            }
          }
          articleFields {
            newsData { theLede isHero isBreaking }
            articleCategoryType
          }
        }
      }
    }
  `,

  // ── Author profile + their posts ─────────────────────────────────────────────
  GET_AUTHOR_PROFILE: `
    query GetAuthorProfile($slug: ID!, $first: Int!, $after: String) {
      user(id: $slug, idType: SLUG) {
        name
        description
        avatar { url }
        posts(
          first: $first
          after: $after
          where: { orderby: { field: DATE, order: DESC } }
        ) {
          pageInfo { hasNextPage endCursor }
          nodes {
            title
            slug
            date
            excerpt
            categories { nodes { name slug } }
            featuredImage {
              node {
                sourceUrl
                altText
                caption
                mediaDetails { width height }
              }
            }
            articleFields { newsData { theLede isHero isBreaking } }
          }
        }
      }
    }
  `,

  // ── Nav categories (1h cache, rarely changes) ────────────────────────────────
  GET_NAV_CATEGORIES: `
    query GetNavCategories {
      categories(first: 10, where: { hideEmpty: true, exclude: "1" }) {
        nodes { name slug }
      }
    }
  `,

  // ── Search (short 10s cache) ─────────────────────────────────────────────────
  SEARCH_ARTICLES: `
    query SearchPosts($query: String!) {
      posts(where: { search: $query }, first: 20) {
        nodes {
          title
          slug
          date
          excerpt
          categories { nodes { name slug } }
          featuredImage {
            node {
              sourceUrl
              altText
              caption
              mediaDetails { width height }
            }
          }
          articleFields { newsData { theLede } }
        }
      }
    }
  `,

  // ── Tag archive with pagination ──────────────────────────────────────────────
  GET_POSTS_BY_TAG: `
    query GetPostsByTag($tag: [String], $first: Int!, $after: String) {
      tag(id: $tag, idType: SLUG) { name count slug }
      posts(where: { tagIn: $tag }, first: $first, after: $after) {
        pageInfo { hasNextPage endCursor }
        nodes {
          title
          slug
          date
          excerpt
          categories { nodes { name slug } }
          featuredImage {
            node {
              sourceUrl
              altText
              caption
              mediaDetails { width height }
            }
          }
          articleFields { newsData { theLede } }
        }
      }
    }
  `,

  // ── All slugs for generateStaticParams + sitemap (24h cache) ────────────────
  GET_ALL_SLUGS: `
    query GetAllPostSlugs {
      posts(first: 10000, where: { status: PUBLISH }) {
        nodes {
          slug
          date
          categories { nodes { slug } }
        }
      }
    }
  `,
}