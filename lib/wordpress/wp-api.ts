/**
 * SleekSites WP-Headless Data Layer
 * Handles fetching and type-casting for Kurunzi Sports.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NewsMetadata {
  isHero: boolean;
  isBreaking: boolean;
  theLede: string;
}

export interface SportsPost {
  title: string;
  slug: string;
  date: string;
  featuredImage: string | null; // Changed to string for direct use in <Image />
  newsData: NewsMetadata;
  category: string;
}

export interface NavCategory {
  title: string;
  slug: string;
}

// ─── Core Fetcher ─────────────────────────────────────────────────────────────

async function fetchAPI(query: string, variables: Record<string, any> = {}) {
  const res = await fetch(process.env.WORDPRESS_API_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();

  if (json.errors) {
    console.error("[WP-API Error]:", json.errors);
    throw new Error("Failed to fetch API from WordPress");
  }

  return json.data;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getSportsPosts(): Promise<SportsPost[]> {
  const data = await fetchAPI(`
    query GetSportsData {
      posts(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          title
          slug
          categories {
            nodes { name }
          }
          date
          featuredImage {
            node { sourceUrl }
          }
          newsData {
            isHero
            isBreaking
            theLede
          }
        }
      }
    }
  `);

  const nodes = data?.posts?.nodes || [];

  return nodes.map(
    (post: any): SportsPost => ({
      title: post.title,
      slug: post.slug,
      category: post.categories?.nodes[0]?.name || "General",
      date: post.date,
      // Drill down to sourceUrl so frontend gets a clean string
      featuredImage: post.featuredImage?.node?.sourceUrl || null,
      newsData: {
        isHero: post.newsData?.isHero ?? false,
        isBreaking: post.newsData?.isBreaking ?? false,
        theLede:
          post.newsData?.theLede ?? "No summary available for this story.",
      },
    }),
  );
}

export async function getArticleBySlug(slug: string) {
  const data = await fetchAPI(
    `
    query GetArticleBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        title
        content
        date
        excerpt
        slug
        categories {
          nodes { name slug }
        }
        featuredImage {
          node { sourceUrl altText }
        }
        newsData {
          isHero
          isBreaking
          theLede
        }
      }
    }
  `,
    { slug },
  );

  return data?.post;
}

export async function getCategoryArchive(
  categorySlug: string,
  first: number = 10,
  after: string | null = null,
) {
  const data = await fetchAPI(
    `
    query GetCategoryArchive($category: String!, $first: Int!, $after: String) {
      posts(where: { categoryName: $category }, first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          title
          slug
          date
          excerpt
          categories { 
            nodes { 
              name 
            } 
          }
          featuredImage { 
            node { 
              sourceUrl 
            } 
          }
          newsData { 
            theLede 
          }
        }
      }
    }
  `,
    {
      category: categorySlug,
      first: first,
      after: after,
    },
  );

  return {
    posts: (data?.posts?.nodes || []).map((post: any) => ({
      ...post,
      featuredImage: post.featuredImage?.node?.sourceUrl || null,
      category: post.categories?.nodes[0]?.name || "General",
    })),
    pageInfo: data?.posts?.pageInfo || { hasNextPage: false, endCursor: null },
  };
}

export async function getAuthorProfile(
  slug: string,
  first: number = 10,
  after: string | null = null,
) {
  const data = await fetchAPI(
    `
    query GetAuthorProfile($slug: ID!, $first: Int!, $after: String) {
      user(id: $slug, idType: SLUG) {
        name
        description
        avatar {
          url
        }
        posts(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            title
            slug
            date
            excerpt
            categories {
              nodes {
                name
                slug
              }
            }
            featuredImage {
              node {
                sourceUrl
              }
            }
            newsData {
              theLede
            }
          }
        }
      }
    }
  `,
    { slug, first, after },
  );

  return {
    author: data?.user || null,
    posts: (data?.user?.posts?.nodes || []).map((post: any) => ({
      ...post,
      featuredImage: post.featuredImage?.node?.sourceUrl || null,
    })),
    pageInfo: data?.user?.posts?.pageInfo || {
      hasNextPage: false,
      endCursor: null,
    },
  };
}

export async function getNavCategories(): Promise<NavCategory[]> {
  const data = await fetchAPI(`
    query GetNavCategories {
      categories(first: 10, where: { hideEmpty: true, exclude: "1" }) {
        nodes {
          name
          slug
        }
      }
    }
  `);

  return (data?.categories?.nodes || []).map((cat: any) => ({
    title: cat.name,
    slug: cat.slug,
  }));
}

export async function searchArticles(searchTerm: string) {
  const data = await fetchAPI(
    `
    query SearchPosts($query: String!) {
      posts(where: { search: $query }, first: 20) {
        nodes {
          title
          slug
          date
          excerpt
          categories {
            nodes {
              name
              slug
            }
          }
          featuredImage {
            node {
              sourceUrl
            }
          }
          newsData {
            theLede
          }
        }
      }
    }
  `,
    { query: searchTerm },
  );

  return (data?.posts?.nodes || []).map((post: any) => ({
    ...post,
    featuredImage: post.featuredImage?.node?.sourceUrl || null,
  }));
}

export async function getPostsByTag(
  tagSlug: string,
  first: number = 10,
  after: string | null = null,
) {
  const data = await fetchAPI(
    `
    query GetPostsByTag($tag: [String], $first: Int!, $after: String) {
      tag(id: $tag, idType: SLUG) {
        name
        count
        slug
      }
      posts(where: { tagIn: $tag }, first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          title
          slug
          date
          excerpt
          categories {
            nodes {
              name
              slug
            }
          }
          featuredImage {
            node {
              sourceUrl
            }
          }
          newsData {
            theLede
          }
        }
      }
    }
  `,
    {
      tag: [tagSlug], // WordPress expects an array for tagIn
      first,
      after,
    },
  );

  return {
    tagInfo: data?.tag || null,
    posts: (data?.posts?.nodes || []).map((post: any) => ({
      ...post,
      featuredImage: post.featuredImage?.node?.sourceUrl || null,
    })),
    pageInfo: data?.posts?.pageInfo || {
      hasNextPage: false,
      endCursor: null,
    },
  };
}
