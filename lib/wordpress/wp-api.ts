/**
 * SleekSites WP-Headless Data Layer
 * Handles fetching and type-casting for Kurunzi Sports Subdomain.
 */

// 1. Define the Shape of our Data
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

// 2. The Core Fetcher
async function fetchAPI(query: string, variables: any = {}) {
  const res = await fetch(process.env.WORDPRESS_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();

  if (json.errors) {
    console.error("[WP-API Error]:", json.errors);
    throw new Error("Failed to fetch API from WordPress");
  }

  return json.data;
}

// 3. Fetching List of Posts (This one was already correct)
export async function getSportsPosts(): Promise<SportsPost[]> {
  const data = await fetchAPI(`
    query GetSportsData {
      posts(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          title
          slug
          categories {
            nodes {
              name
            }
          }
          date
          featuredImage {
            node {
              sourceUrl
            }
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

// 4. Fetching Single Article (FIXED naming here)
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
          isHero
          isBreaking
          theLede
        }
      }
    }
  `,
    { slug }, // Variables passed directly here
  );

  return data?.post;
}
