// @/lib/schemas/article.ts
import { z } from "zod";

export const ArticleSchema = z.object({
  title: z
    .string()
    .min(10, "Headline is too short for SEO")
    .max(100, "Headline exceeds standard news length"),

  // NEW: Slug validation
  slug: z
    .string()
    .min(5, "Slug is required for publishing")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be URL-friendly (lowercase, numbers, and hyphens only)",
    ),

  excerpt: z
    .string()
    .min(30, "Lead paragraph (excerpt) is too short")
    .max(500, "Lead paragraph should be concise"),

  category: z.string().min(1, "Please select a category"),

  // Editorial Metadata
  // NEW: Alt text is now strictly validated for accessibility
  imageAlt: z
    .string()
    .min(5, "Alt text is required for accessibility")
    .max(120, "Alt text should be descriptive but concise"),

  imageCaption: z.string().max(200, "Caption is too long").optional(),
  imageSource: z.string().max(100, "Source credit is too long").optional(),

  isBreaking: z.boolean().default(false),
  siteContext: z.enum(["main", "worldcup", "elections"]).default("main"),

  content: z.any().refine((val) => {
    return val && typeof val === "object" && val.type === "doc";
  }, "Invalid article body structure"),

  // Updated to specifically expect the URL string from our upload process
  featuredImage: z
    .string()
    .min(1, "Featured image is required")
    .url("Invalid image URL"),

  tags: z.array(z.string()).max(8, "Maximum 8 tags allowed"),

  status: z
    .enum(["draft", "pending_review", "rejected", "approved"])
    .default("draft"),
});

export type ArticleInput = z.infer<typeof ArticleSchema>;
