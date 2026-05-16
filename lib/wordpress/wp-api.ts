// lib/wordpress/wp-api.ts
// Core fetcher + all GraphQL query strings.
// Only data.ts should import from here.

export async function fetchAPI<T>(
  query: string,
  variables: Record<string, unknown> = {},
  revalidate: number = 60,
  tags: string[] = ["wordpress-data"],
): Promise<T> {
  const url = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_WORDPRESS_API_URL is not set in environment variables",
    );
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate, tags },
  });

  if (!res.ok) {
    throw new Error(
      `WordPress API responded with ${res.status}: ${res.statusText}`,
    );
  }

  const json = await res.json();

  if (json.errors) {
    console.error("[WP-API Error]:", JSON.stringify(json.errors, null, 2));
    throw new Error(
      json.errors[0]?.message ?? "Failed to fetch from WordPress",
    );
  }

  return json.data as T;
}

// ─── Image fragment ───────────────────────────────────────────────────────────

const IMAGE_FIELDS = `
  featuredImage {
    node {
      sourceUrl
      altText
      caption
      mediaDetails {
        width
        height
      }
    }
  }
`;

// ─── Queries ──────────────────────────────────────────────────────────────────

export const QUERIES = {
  GET_SPORTS_POSTS: `
    query GetSportsData {
      posts(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          title slug date excerpt
          categories { nodes { name slug } }
          ${IMAGE_FIELDS}
          articleFields {
            newsData { isHero isBreaking theLede }
            articleCategoryType
            isHeroSlider
          }
        }
      }
    }
  `,

  GET_ARTICLE_BY_SLUG: `
  query GetArticleBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      title 
      content 
      date 
      excerpt 
      slug
      categories { nodes { name slug } }
      tags { nodes { name slug count } }
      ${IMAGE_FIELDS}
      articleFields {
        newsData { isHero isBreaking theLede }
        matchData {
          homeTeam awayTeam finalScore competition matchDatetime venue matchStatus
        }
        articleCategoryType
        readingTime
        featuredVideo
        isHeroSlider
        relatedArticles {
          nodes {
            ... on Post {
              title
              slug
              featuredImage {
                node {
                  sourceUrl
                  altText
                }
              }
              categories {
                nodes {
                  name
                  slug
                }
              }
            }
          }
        }
      }
      author {
        node {
          name slug description
          avatar { url }
        }
      }
    }
  }
`,

  GET_CATEGORY_ARCHIVE: `
    query GetCategoryArchive($category: String!, $first: Int!, $after: String) {
      posts(
        where: { categoryName: $category, orderby: { field: DATE, order: DESC } }
        first: $first after: $after
      ) {
        pageInfo { hasNextPage endCursor }
        nodes {
          title slug date excerpt
          categories { nodes { name slug } }
          ${IMAGE_FIELDS}
          articleFields {
            newsData { theLede isHero isBreaking }
            articleCategoryType
          }
        }
      }
    }
  `,

  GET_AUTHOR_PROFILE: `
    query GetAuthorProfile($slug: ID!, $first: Int!, $after: String) {
      user(id: $slug, idType: SLUG) {
        name description
        avatar { url }
        posts(
          first: $first after: $after
          where: { orderby: { field: DATE, order: DESC } }
        ) {
          pageInfo { hasNextPage endCursor }
          nodes {
            title slug date excerpt
            categories { nodes { name slug } }
            ${IMAGE_FIELDS}
            articleFields { newsData { theLede isHero isBreaking } }
          }
        }
      }
    }
  `,

  GET_NAV_CATEGORIES: `
    query GetNavCategories {
      categories(first: 10, where: { hideEmpty: true, exclude: "1" }) {
        nodes { name slug }
      }
    }
  `,

  SEARCH_ARTICLES: `
    query SearchPosts($query: String!) {
      posts(where: { search: $query }, first: 20) {
        nodes {
          title slug date excerpt
          categories { nodes { name slug } }
          ${IMAGE_FIELDS}
          articleFields { newsData { theLede } }
        }
      }
    }
  `,

  // ── Tag query — variable types must exactly match WPGraphQL's schema ────────
  // tag(id: $tagSlug, idType: SLUG)           → $tagSlug: ID!   (single scalar)
  // posts(where: { tagSlugIn: $slugs })       → $slugs: [String] (slug array)
  // These are two different WPGraphQL resolvers with incompatible input types,
  // so they need two separate variables — a single $tag: [String] satisfies neither.
  GET_POSTS_BY_TAG: `
    query GetPostsByTag($tagSlug: ID!, $slugs: [String], $first: Int!, $after: String) {
      tag(id: $tagSlug, idType: SLUG) {
        name
        count
        slug
      }
      posts(
        first: $first
        after: $after
        where: {
          tagSlugIn: $slugs
          orderby: { field: DATE, order: DESC }
        }
      ) {
        pageInfo { hasNextPage endCursor }
        nodes {
          title slug date excerpt
          categories { nodes { name slug } }
          ${IMAGE_FIELDS}
          articleFields { newsData { theLede } }
        }
      }
    }
  `,

  GET_ALL_SLUGS: `
    query GetAllPostSlugs {
      posts(first: 10000, where: { status: PUBLISH }) {
        nodes {
          slug date
          categories { nodes { slug } }
        }
      }
    }
  `,
};
