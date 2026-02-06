import { sanityServerClient as client } from "./client";
import { HomepageSection, Post } from "@/types";

export const POSTS_PER_PAGE = 12;

export const QUERIES = {
  postFields: `
    _id,
    title,
    "slug": slug.current,
    mainImage,
    publishedAt,
    excerpt,
    "categoryTitle": category->title,
    "categorySlug": category->slug.current,
    "authorName": author->name,
    "authorImage": author->image
  `,

  getArticleBySlug: `
  *[_type == "post" && slug.current == $slug][0] {
    ...,
    "slug": slug.current, // This overwrites the object with a string
    "categoryTitle": category->title,
    "categorySlug": category->slug.current,
    "authorName": author->name,
    "authorImage": author->image,
    "authorSlug": author->slug.current
  }
`,

  getRelatedArticles: `
  *[_type == "post" && category->slug.current == $categorySlug && _id != $currentId] | order(publishedAt desc) [0...4] {
    title, 
    "slug": slug.current, 
    "image": mainImage, // Matches NewsCardProps image expectation
    publishedAt, 
    "category": category->slug.current // Changed 'categorySlug' to 'category' to match your loop
  }
`,

  getLatestArticles: `
  *[_type == "post"] | order(publishedAt desc) [0...$limit] {
    title, 
    "slug": slug.current, 
    "category": category->slug.current, // Changed from categorySlug to category
    publishedAt
  }
`,

  getPostsByCategory: `
    *[_type == "post" && category->slug.current == $category] | order(publishedAt desc) [0...$limit] {
      _id, title, "slug": slug.current, mainImage, publishedAt, excerpt, "categoryTitle": category->title
    }
  `,

  getFeaturedPosts: `
    *[_type == "post" && featured == true] | order(publishedAt desc) [0...5] {
      _id, title, "slug": slug.current, mainImage, publishedAt, excerpt
    }
  `,

  getNavCategories: `*[_type == "category"] | order(title asc) {
    title,
    "slug": slug.current
  }`,

  getHomepageSections: `
    *[_type == "category" && count(*[_type == "post" && references(^._id)]) > 0] | order(order asc) {
      title,
      "slug": slug.current,
      "posts": *[_type == "post" && references(^._id)] | order(publishedAt desc) [0...8] {
         _id, 
         title, 
         "slug": slug.current, 
          mainImage,
         publishedAt, 
         excerpt, 
         "category": category->slug.current // CRITICAL: This was missing
      }
    }
  `,

  getCategoryLanding: `
    {
      "topStories": *[_type == "post" && category->slug.current == $slug] | order(publishedAt desc) [0...8] {
        _id, 
        title, 
        "slug": slug.current, 
        mainImage, 
        publishedAt, 
        excerpt,
        "category": category->slug.current // CRITICAL: This was missing
      },
      "moreStories": *[_type == "post" && category->slug.current == $slug] | order(publishedAt desc) [8...16] {
        _id, 
        title, 
        "slug": slug.current, 
        mainImage, 
        publishedAt, 
        excerpt,
        "category": category->slug.current // CRITICAL: This was missing
      },
      "category": *[_type == "category" && slug.current == $slug][0] {
        title,
        description
      }
    }
  `,

  getCategoryArchive: `
  {
    "posts": *[_type == "post" && category->slug.current == $slug] | order(publishedAt desc) [$start...$end] {
      _id, 
      title, 
      "slug": slug.current, 
      mainImage, 
      publishedAt, 
      excerpt, 
      "category": category->slug.current, // Match the mapper expectation
      "categoryTitle": category->title
    },
    "total": count(*[_type == "post" && category->slug.current == $slug]),
    "category": *[_type == "category" && slug.current == $slug][0] { title }
  }
`,

  getPostsByTag: `
    {
      "posts": *[_type == "post" && $tag in tags] | order(publishedAt desc) [$start...$end] {
        _id, title, "slug": slug.current, mainImage, publishedAt, excerpt, "categorySlug": category->slug.current, "categoryTitle": category->title
      },
      "total": count(*[_type == "post" && $tag in tags])
    }
  `,

  searchPosts: `*[_type == "post" && (title match $term || excerpt match $term || pt::text(body) match $term)] | order(publishedAt desc) {
    _id, title, "slug": slug.current, mainImage, publishedAt, excerpt, "categorySlug": category->slug.current
  }`,

  getAuthorProfile: `*[_type == "author" && slug.current == $slug][0] {
    name,
    bio,
    image,
    "posts": *[_type == "post" && author._ref == ^._id] | order(publishedAt desc) {
      _id, title, "slug": slug.current, mainImage, publishedAt, excerpt, "categorySlug": category->slug.current
    }
  }`,
};

// --- Execution Functions ---

export async function fetchArticleBySlug(slug: string) {
  return await client.fetch(
    QUERIES.getArticleBySlug,
    { slug },
    { next: { revalidate: 60 } },
  );
}

export async function fetchRelatedArticles(
  categorySlug: string,
  currentId: string,
) {
  return await client.fetch(
    QUERIES.getRelatedArticles,
    { categorySlug, currentId },
    { next: { revalidate: 3600 } },
  );
}

export async function fetchLatestArticles(limit: number = 5) {
  return await client.fetch(
    QUERIES.getLatestArticles,
    { limit },
    { next: { revalidate: 60 } },
  );
}

export async function fetchPostsByCategory(
  category: string,
  limit: number = 8,
): Promise<Post[]> {
  return await client.fetch<Post[]>(
    QUERIES.getPostsByCategory,
    { category, limit },
    { next: { revalidate: 60 } },
  );
}

export async function fetchNavCategories() {
  return await client.fetch<{ title: string; slug: string }[]>(
    QUERIES.getNavCategories,
  );
}

export async function fetchHomepageSections(): Promise<HomepageSection[]> {
  return await client.fetch<HomepageSection[]>(
    QUERIES.getHomepageSections,
    {},
    { next: { revalidate: 60 } },
  );
}

export async function fetchCategoryLanding(slug: string) {
  // FIXED: Explicitly passing { slug } as params
  return await client.fetch(
    QUERIES.getCategoryLanding,
    { slug },
    { next: { revalidate: 60 } },
  );
}

export async function fetchCategoryArchive(slug: string, page: number = 1) {
  const start = (page - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;
  // FIXED: Explicitly passing { slug, start, end } as params
  return await client.fetch(
    QUERIES.getCategoryArchive,
    { slug, start, end },
    { next: { revalidate: 60 } },
  );
}

export async function searchArticles(term: string): Promise<Post[]> {
  return await client.fetch(QUERIES.searchPosts, { term: `*${term}*` });
}

export async function fetchPostsByTag(
  tag: string,
  page: number = 1,
): Promise<{ posts: Post[]; total: number }> {
  const decodedTag = decodeURIComponent(tag);
  const start = (page - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;

  return client.fetch<{ posts: Post[]; total: number }>(
    QUERIES.getPostsByTag,
    { tag: decodedTag, start, end },
    {
      fetchOptions: {
        next: { revalidate: 60 },
      },
    },
  );
}

export async function fetchAuthorProfile(slug: string) {
  return await client.fetch(QUERIES.getAuthorProfile, { slug });
}
