// @/lib/schemas/article.ts
import { z } from "zod";

export const ArticleSchema = z.object({
  title: z
    .string()
    .min(10, "Headline is too short for SEO")
    .max(100, "Headline exceeds standard news length"),
  excerpt: z
    .string()
    .min(30, "Lead paragraph (excerpt) is too short")
    .max(300, "Lead paragraph should be concise"),
  category: z.string().min(1, "Please select a category"),

  // Editorial Metadata
  imageCaption: z.string().max(200, "Caption is too long").optional(),
  imageSource: z.string().max(100, "Source credit is too long").optional(),
  isBreaking: z.boolean().default(false),
  siteContext: z.enum(["main", "worldcup", "elections"]).default("main"),

  content: z.any().refine((val) => {
    return val && typeof val === "object" && val.type === "doc";
  }, "Invalid article body structure"),

  featuredImage: z
    .any()
    .refine((val) => val !== null, "Featured image is required"),

  tags: z.array(z.string()).max(8, "Maximum 8 tags allowed"),
  status: z
    .enum(["draft", "pending_review", "rejected", "approved"])
    .default("draft"),
});

export type ArticleInput = z.infer<typeof ArticleSchema>;
