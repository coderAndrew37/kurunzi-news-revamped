// lib/wordpress/wp-api.ts
// Core fetcher + all GraphQL query strings.
// Only data.ts should import from here.

// ─── fetchAPI ─────────────────────────────────────────────────────────────────

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

  // ─── PATCHED ──────────────────────────────────────────────────────────────
  //
  // REMOVED: hideEmpty: true
  //   WPGraphQL resolves hideEmpty against the denormalised `count` column in
  //   wp_term_taxonomy — NOT against live post_term_relationships. When that
  //   column is out of sync (e.g. after a cPanel DB restore, bulk import, or
  //   any post creation path that bypasses wp_insert_post()), every term reads
  //   count = 0 and WPGraphQL strips them all server-side. The nodes array
  //   arrives empty before our TypeScript filter even runs. The fix is to let
  //   WPGraphQL return all terms and push the >0 guard into TypeScript where we
  //   control coercion and can emit diagnostic logs.
  //
  // REMOVED: orderby: COUNT, order: DESC
  //   This orderby path uses the same stale DB column. With a desynced count it
  //   produces an unstable sort and, when combined with hideEmpty, triggers a
  //   WPGraphQL SQL JOIN that amplifies the count-column bug. Sorting is now
  //   done in getNavCategories() where count has already been coerced to a safe
  //   integer.
  //
  // CHANGED: first: 30 → first: 50
  //   Without hideEmpty pre-filtering we receive system terms (uncategorized,
  //   general) and zero-post terms in the payload. A larger window guarantees
  //   that at least NAV_CATEGORY_LIMIT real categories survive after TypeScript
  //   filtering even on sites with many taxonomy entries.
  //
  // CHANGED: cache tag "navigation" → "nav-categories"
  //   Granular tag prevents a stale .next/cache entry written by an earlier
  //   build (when the DB count column was 0) from being reused. It also allows
  //   surgical on-demand invalidation via revalidateTag("nav-categories") from
  //   a WordPress post-save webhook without flushing unrelated cache entries.
  //
  GET_NAV_CATEGORIES: `
    query GetNavCategories {
      categories(
        first: 50
        where: { orderby: NAME, order: ASC }
      ) {
        nodes {
          name
          slug
          count
        }
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
      posts(first: 50, where: { status: PUBLISH }) {
        nodes {
          slug date
          categories { nodes { slug } }
        }
      }
    }
  `,
};

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Matches the WPGraphQL Category type.
 *
 * `count` is typed `Int` (nullable) in WPGraphQL's schema. At the HTTP layer
 * it arrives as `number | null`. Older WPGraphQL versions (< 1.14) may
 * serialise it as a numeric string; resolveCount() handles all three shapes.
 */
export interface WPGraphQLCategoryNode {
  readonly name:  string;
  readonly slug:  string;
  readonly count: number | null;
}

export interface GetNavCategoriesResponse {
  readonly categories: {
    readonly nodes: ReadonlyArray<WPGraphQLCategoryNode>;
  } | null;
}

export interface NavCategory {
  readonly title: string;
  readonly slug:  string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

/**
 * Taxonomy slugs that are never surfaced in navigation.
 * Extend this set as new admin/internal categories are added.
 */
const SYSTEM_CATEGORY_SLUGS = new Set<string>([
  "uncategorized",
  "general",
]);

const NAV_CATEGORY_LIMIT = 6;

const NAV_CATEGORIES_REVALIDATE = 3600; // seconds

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Coerces a WPGraphQL `count` value to a reliable non-negative integer.
 *
 * Handles:
 *   • number  — the expected runtime type
 *   • null    — returned when wp_term_taxonomy.count is 0 or unset
 *   • string  — serialised by older WPGraphQL plugin versions (< 1.14)
 *
 * This function is the single source of truth for count coercion.
 * Do not inline this logic into the filter predicate — it must remain
 * testable and independently auditable.
 */
function resolveCount(raw: number | null): number {
  if (raw === null)            return 0;
  if (typeof raw === "number") return Number.isFinite(raw) ? Math.max(0, raw) : 0;
  // Defensive branch: coerce string digits from older WPGraphQL serialiser.
  // The branch is unreachable under current WPGraphQL versions but costs
  // nothing at runtime and prevents silent failures during plugin upgrades.
  const coerced = parseInt(String(raw), 10);
  return Number.isNaN(coerced) ? 0 : Math.max(0, coerced);
}

// ─── getNavCategories ─────────────────────────────────────────────────────────

export async function getNavCategories(): Promise<NavCategory[]> {
  try {
    const data = await fetchAPI<GetNavCategoriesResponse>(
      QUERIES.GET_NAV_CATEGORIES,
      {},
      NAV_CATEGORIES_REVALIDATE,
      // Changed from "navigation" → "nav-categories" for granular invalidation.
      // Call revalidateTag("nav-categories") from a WordPress post-save webhook
      // to surgically bust only this cache entry without touching other layouts.
      //
      // During debugging after a DB repair:
      //   1. Temporarily set NAV_CATEGORIES_REVALIDATE to 0 (cache: "no-store")
      //   2. Confirm live data flows through
      //   3. Restore to 3600 and run: rm -rf .next && next build
      ["nav-categories"],
    );

    // WPGraphQL can return null for the categories connection (not just an empty
    // nodes array) when the taxonomy resolver short-circuits. Guard both shapes.
    const nodes: ReadonlyArray<WPGraphQLCategoryNode> =
      data.categories?.nodes ?? [];

    if (nodes.length === 0) {
      // Nodes is empty. This is the primary symptom of the wp_term_taxonomy.count
      // desync bug. The query no longer uses hideEmpty, so an empty result here
      // means WPGraphQL returned genuinely no terms — which should not happen on
      // a populated site. Emit a diagnostic pointing at the exact repair step.
      console.warn(
        "[wp-api] getNavCategories: WPGraphQL returned zero category nodes. " +
        "Most likely cause: wp_term_taxonomy.count column is out of sync. " +
        "Repair: add wp_update_term_count_now() to functions.php (see repo RUNBOOK.md), " +
        "then run: rm -rf .next && next build",
      );
    }

    const items: NavCategory[] = nodes
      .filter((cat): cat is WPGraphQLCategoryNode => {
        // resolveCount normalises null / string / number to a safe integer.
        const postCount        = resolveCount(cat.count);
        const hasPublishedPosts = postCount > 0;
        const isSystemSlug     = SYSTEM_CATEGORY_SLUGS.has(cat.slug);
        return hasPublishedPosts && !isSystemSlug;
      })
      // Re-sort by post count descending (replaces the removed orderby: COUNT).
      // This sort operates on already-coerced integers so it is stable and
      // immune to the DB column desync that broke the WPGraphQL-side sort.
      .sort((a, b) => resolveCount(b.count) - resolveCount(a.count))
      .slice(0, NAV_CATEGORY_LIMIT)
      .map(
        (cat): NavCategory => ({
          title: cat.name,
          slug:  cat.slug,
        }),
      );

    if (items.length > 0) {
      return items;
    }

    // items is empty despite nodes being non-empty: all terms were removed by
    // the post-count or system-slug filter. This is a distinct diagnostic case.
    console.warn(
      `[wp-api] getNavCategories: ${nodes.length} node(s) fetched but all removed ` +
      "by the hasPublishedPosts or system-slug filter. " +
      "Verify that top categories are not in SYSTEM_CATEGORY_SLUGS " +
      "and that their count field is > 0 in the WPGraphQL response.",
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      "[wp-api] getNavCategories: fetchAPI threw — dropping to fallback. " +
      "Error: " + message,
      error,
    );
  }

  // ── Fallback ────────────────────────────────────────────────────────────────
  // Statically typed, non-empty, and intentionally defined inline so that
  // tree-shaking preserves this constant regardless of import-graph refactors.
  const FALLBACK_CATEGORIES: NavCategory[] = [
    { title: "Football",  slug: "football"  },
    { title: "Athletics", slug: "athletics" },
    { title: "Rugby",     slug: "rugby"     },
    { title: "Africa",    slug: "africa"    },
    { title: "Featured",  slug: "featured"  },
  ];
  return FALLBACK_CATEGORIES;
}