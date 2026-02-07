"use server";

import { sanityServerClient as sanity } from "@/lib/sanity/server";
import { Post } from "@/types";

export async function searchArticlesAction(term: string): Promise<Post[]> {
  if (!term || term.length < 3) return [];

  try {
    // GROQ query to find articles by title
    const query = `*[_type == "post" && title match $term + "*"] | order(publishedAt desc) [0...5] {
      _id,
      title,
      "slug": slug.current,
      "categoryTitle": category->slug.current,
      publishedAt
    }`;

    const results = await sanity.fetch(query, { term });
    return results;
  } catch (error) {
    console.error("Search Error:", error);
    return [];
  }
}
