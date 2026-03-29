/**
 * SleekSites WP-Headless Data Layer
 * Handles fetching, type-casting, and Fine-Grained ISR for Kurunzi Sports.
 * * Performance Muscle:
 * - Default revalidate: 60s (Sprints)
 * - Navigation revalidate: 3600s (Marathon)
 */

// ─── Types & Interfaces ───────────────────────────────────────────────────────

export interface NewsMetadata {
  isHero: boolean;
  isBreaking: boolean;
  theLede: string;
}

export interface SportsPost {
  title: string;
  slug: string;
  date: string;
  featuredImage: string | null;
  newsData: NewsMetadata;
  category: string;
}

export interface NavCategory {
  title: string;
  slug: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

// Internal WPGraphQL Response Shapes
interface WPImage {
  node: { sourceUrl: string; altText?: string };
}

interface WPCategory {
  name: string;
  slug: string;
}

export interface WPPostNode {
  title: string;
  slug: string;
  date: string;
  content: string; // Changed from optional to required
  excerpt: string; // Changed from optional to required
  categories: { nodes: WPCategory[] };
  featuredImage: WPImage | null;
  newsData: NewsMetadata;
  // Add author node
  author: {
    node: {
      name: string;
      slug: string;
      avatar?: { url: string };
      description?: string;
    };
  };
}

interface SitemapPostNode {
  slug: string;
  date: string;
  categories: {
    nodes: Array<{ slug: string }>;
  };
}

// ─── Core Fetcher ─────────────────────────────────────────────────────────────

/**
 * Generic Fetcher for WPGraphQL
 * @template T The expected shape of the 'data' property in the response
 */
async function fetchAPI<T>(
  query: string,
  variables: Record<string, unknown> = {},
  revalidate: number = 60,
  tags: string[] = ["wordpress-data"],
): Promise<T> {
  const res = await fetch(process.env.WORDPRESS_API_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: {
      revalidate: revalidate,
      tags: tags,
    },
  });

  const json = await res.json();

  if (json.errors) {
    console.error("[WP-API Error]:", json.errors);
    throw new Error("Failed to fetch API from WordPress");
  }

  return json.data as T;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getSportsPosts(): Promise<SportsPost[]> {
  const data = await fetchAPI<{ posts: { nodes: WPPostNode[] } }>(
    `
    query GetSportsData {
      posts(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          title
          slug
          categories { nodes { name } }
          date
          featuredImage { node { sourceUrl } }
          newsData { isHero isBreaking theLede }
        }
      }
    }
  `,
    {},
    60,
    ["posts", "collection"],
  );

  return (data.posts?.nodes || []).map((post) => ({
    title: post.title,
    slug: post.slug,
    category: post.categories.nodes[0]?.name || "General",
    date: post.date,
    featuredImage: post.featuredImage?.node.sourceUrl || null,
    newsData: {
      isHero: post.newsData?.isHero ?? false,
      isBreaking: post.newsData?.isBreaking ?? false,
      theLede: post.newsData?.theLede ?? "No summary available for this story.",
    },
  }));
}

export async function getArticleBySlug(
  slug: string,
): Promise<WPPostNode | null> {
  const data = await fetchAPI<{ post: WPPostNode | null }>(
    `
    query GetArticleBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        title
        content
        date
        excerpt
        slug
        categories { nodes { name slug } }
        featuredImage { node { sourceUrl altText } }
        newsData { isHero isBreaking theLede }
        author {
          node {
            name
            slug
            description
            avatar { url }
          }
        }
      }
    }
  `,
    { slug },
    60,
    [`post-${slug}`],
  );

  return data.post;
}
export async function getCategoryArchive(
  categorySlug: string,
  first: number = 10,
  after: string | null = null,
): Promise<{ posts: SportsPost[]; pageInfo: PageInfo }> {
  const data = await fetchAPI<{
    posts: { nodes: WPPostNode[]; pageInfo: PageInfo };
  }>(
    `
    query GetCategoryArchive($category: String!, $first: Int!, $after: String) {
      posts(where: { categoryName: $category }, first: $first, after: $after) {
        pageInfo { hasNextPage endCursor }
        nodes {
          title
          slug
          date
          excerpt
          categories { nodes { name } }
          featuredImage { node { sourceUrl } }
          newsData { theLede }
        }
      }
    }
  `,
    { category: categorySlug, first, after },
    60,
    [`category-${categorySlug}`],
  );

  return {
    posts: (data.posts?.nodes || []).map((post) => ({
      title: post.title,
      slug: post.slug,
      date: post.date,
      featuredImage: post.featuredImage?.node.sourceUrl || null,
      category: post.categories.nodes[0]?.name || "General",
      newsData: {
        isHero: post.newsData?.isHero ?? false,
        isBreaking: post.newsData?.isBreaking ?? false,
        theLede: post.newsData?.theLede ?? "No summary available.",
      },
    })),
    pageInfo: data.posts?.pageInfo || { hasNextPage: false, endCursor: null },
  };
}

export async function getAuthorProfile(
  slug: string,
  first: number = 10,
  after: string | null = null,
): Promise<{ author: any; posts: SportsPost[]; pageInfo: PageInfo }> {
  const data = await fetchAPI<{
    user: {
      name: string;
      description: string;
      avatar: { url: string };
      posts: { nodes: WPPostNode[]; pageInfo: PageInfo };
    };
  }>(
    `
    query GetAuthorProfile($slug: ID!, $first: Int!, $after: String) {
      user(id: $slug, idType: SLUG) {
        name
        description
        avatar { url }
        posts(first: $first, after: $after) {
          pageInfo { hasNextPage endCursor }
          nodes {
            title
            slug
            date
            excerpt
            categories { nodes { name slug } }
            featuredImage { node { sourceUrl } }
            newsData { theLede }
          }
        }
      }
    }
  `,
    { slug, first, after },
    300,
    [`author-${slug}`],
  );

  return {
    author: data.user || null,
    posts: (data.user?.posts?.nodes || []).map((post) => ({
      title: post.title,
      slug: post.slug,
      date: post.date,
      featuredImage: post.featuredImage?.node.sourceUrl || null,
      category: post.categories.nodes[0]?.name || "General",
      newsData: {
        isHero: post.newsData?.isHero ?? false,
        isBreaking: post.newsData?.isBreaking ?? false,
        theLede: post.newsData?.theLede ?? "No summary available.",
      },
    })),
    pageInfo: data.user?.posts?.pageInfo || {
      hasNextPage: false,
      endCursor: null,
    },
  };
}

export async function getNavCategories(): Promise<NavCategory[]> {
  const data = await fetchAPI<{ categories: { nodes: WPCategory[] } }>(
    `
    query GetNavCategories {
      categories(first: 10, where: { hideEmpty: true, exclude: "1" }) {
        nodes { name slug }
      }
    }
  `,
    {},
    3600,
    ["navigation"],
  );

  return (data.categories?.nodes || []).map((cat) => ({
    title: cat.name,
    slug: cat.slug,
  }));
}

export async function searchArticles(
  searchTerm: string,
): Promise<SportsPost[]> {
  const data = await fetchAPI<{ posts: { nodes: WPPostNode[] } }>(
    `
    query SearchPosts($query: String!) {
      posts(where: { search: $query }, first: 20) {
        nodes {
          title
          slug
          date
          excerpt
          categories { nodes { name slug } }
          featuredImage { node { sourceUrl } }
          newsData { theLede }
        }
      }
    }
  `,
    { query: searchTerm },
    10,
    ["search"],
  );

  return (data.posts?.nodes || []).map((post) => ({
    title: post.title,
    slug: post.slug,
    date: post.date,
    category: post.categories.nodes[0]?.name || "General",
    featuredImage: post.featuredImage?.node.sourceUrl || null,
    newsData: {
      isHero: post.newsData?.isHero ?? false,
      isBreaking: post.newsData?.isBreaking ?? false,
      theLede: post.newsData?.theLede ?? "No summary available.",
    },
  }));
}

export async function getPostsByTag(
  tagSlug: string,
  first: number = 10,
  after: string | null = null,
): Promise<{ tagInfo: any; posts: SportsPost[]; pageInfo: PageInfo }> {
  const data = await fetchAPI<{
    tag: any;
    posts: { nodes: WPPostNode[]; pageInfo: PageInfo };
  }>(
    `
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
          featuredImage { node { sourceUrl } }
          newsData { theLede }
        }
      }
    }
  `,
    { tag: [tagSlug], first, after },
    60,
    [`tag-${tagSlug}`],
  );

  return {
    tagInfo: data.tag || null,
    posts: (data.posts?.nodes || []).map((post) => ({
      title: post.title,
      slug: post.slug,
      date: post.date,
      category: post.categories.nodes[0]?.name || "General",
      featuredImage: post.featuredImage?.node.sourceUrl || null,
      newsData: {
        isHero: post.newsData?.isHero ?? false,
        isBreaking: post.newsData?.isBreaking ?? false,
        theLede: post.newsData?.theLede ?? "No summary available.",
      },
    })),
    pageInfo: data.posts?.pageInfo || { hasNextPage: false, endCursor: null },
  };
}

export async function getAllPostSlugs(): Promise<
  { slug: string; date: string; category: string }[]
> {
  const data = await fetchAPI<{ posts: { nodes: SitemapPostNode[] } }>(
    `
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
    {},
    86400,
    ["sitemap-data"],
  );

  return (data.posts?.nodes || []).map((post) => ({
    slug: post.slug,
    date: post.date,
    category: post.categories?.nodes[0]?.slug || "news",
  }));
}
