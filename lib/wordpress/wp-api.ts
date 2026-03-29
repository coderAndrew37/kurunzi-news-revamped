/**
 * SleekSites WP-Headless Data Layer
 * Handles fetching and type-casting for Kurunzi Sports Subdomain.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WordPressFeaturedImage {
  node: {
    sourceUrl: string;
    altText?: string;
  };
}

export interface NewsMetadata {
  isHero: boolean;
  isBreaking: boolean;
  theLede: string;
}

export interface SportsPost {
  title: string;
  slug: string;
  date: string;
  featuredImage: WordPressFeaturedImage | null;
  newsData: NewsMetadata;
  category: string;
}

// ─── Core Fetcher ─────────────────────────────────────────────────────────────

async function fetchAPI(query: string, variables: Record<string, any> = {}) {
  const res = await fetch(process.env.WORDPRESS_API_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Pass variables at the top level of the request body — NOT nested
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
  // No variables — omit the argument entirely (defaults to {})

  const nodes = data?.posts?.nodes || [];

  return nodes.map(
    (post: any): SportsPost => ({
      title: post.title,
      slug: post.slug,
      category: post.categories?.nodes[0]?.name || "General",
      date: post.date,
      featuredImage: post.featuredImage,
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
    { slug }, // ✅ variables: { slug: "some-post-slug" }
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
    posts: data?.posts?.nodes || [],
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
    posts: data?.user?.posts?.nodes || [],
    pageInfo: data?.user?.posts?.pageInfo || {
      hasNextPage: false,
      endCursor: null,
    },
  };
}

export async function getPostsByTag(
  tagSlug: string,
  first: number = 10,
  after: string | null = null,
) {
  const data = await fetchAPI(
    `
    query GetPostsByTag($tag: String!, $first: Int!, $after: String) {
      posts(where: { tag: $tag }, first: $first, after: $after) {
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
      tag(id: $tag, idType: SLUG) {
        name
        count
      }
    }
  `,
    { tag: tagSlug, first, after },
  );

  return {
    posts: data?.posts?.nodes || [],
    tagInfo: data?.tag || null,
    pageInfo: data?.posts?.pageInfo || { hasNextPage: false, endCursor: null },
  };
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

  return data?.posts?.nodes || [];
}

export async function getNavCategories() {
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

  // Transform the WordPress 'name' into the 'title' your Navbar expects
  return (data?.categories?.nodes || []).map((cat: any) => ({
    title: cat.name,
    slug: cat.slug,
  }));
}
