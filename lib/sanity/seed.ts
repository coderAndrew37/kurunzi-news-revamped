"use server";

import { sanityServerClient as sanity } from "@/lib/sanity/client";
import { getSanityCategoryId } from "@/lib/sanity/categories";
import { ActionResponse } from "@/types/errors";
import { createError, parseUnknownError } from "@/lib/utils/error-builder";

const CATEGORIES = ["politics", "news", "kurunzi-exclusive", "entertainment"];

export async function seedDirectToSanity(
  authorId: string,
): Promise<ActionResponse<{ count: number }>> {
  try {
    const transactions = [];

    for (let i = 1; i <= 20; i++) {
      const categorySlug = CATEGORIES[i % CATEGORIES.length];
      const categoryRef = getSanityCategoryId(categorySlug);
      const title = `Direct Seed ${i}: ${categorySlug.toUpperCase()} Analysis`;

      const doc = {
        _type: "post",
        _id: `seed-article-${i}`, // Deterministic ID to prevent double-seeding
        title: title,
        slug: {
          _type: "slug",
          current: title.toLowerCase().replace(/\s+/g, "-"),
        },
        siteContext: "main",
        excerpt: `Automated test lede for article ${i} in the ${categorySlug} section.`,
        publishedAt: new Date().toISOString(),
        isBreaking: i % 5 === 0, // Every 5th article is "Breaking"

        // References
        author: { _type: "reference", _ref: authorId },
        category: { _type: "reference", _ref: categoryRef },

        // Simple Portable Text Body
        body: [
          {
            _type: "block",
            style: "normal",
            children: [
              {
                _type: "span",
                text: `This is automated content for testing the ${categorySlug} category.`,
              },
            ],
          },
        ],

        // Placeholder for main image (using a known Sanity asset ID or skipping)
        // mainImage: { ... }
      };

      transactions.push(sanity.createOrReplace(doc));
    }

    await Promise.all(transactions);

    return { success: true, data: { count: transactions.length } };
  } catch (err: unknown) {
    return { success: false, error: parseUnknownError(err) };
  }
}
