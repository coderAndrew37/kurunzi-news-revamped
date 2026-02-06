import { z } from "zod";
import { JSONContent } from "@tiptap/react";

export const ArticleSchema = z.object({
  title: z
    .string()
    .min(10, "Headline is too short for SEO")
    .max(100, "Headline exceeds standard news length"),
  excerpt: z
    .string()
    .min(50, "Lead paragraph (excerpt) is too short")
    .max(250, "Lead paragraph should be concise"),
  category: z.string().min(1, "Please select a category"),
  // Strict Tiptap JSON Validation
  content: z.custom<JSONContent>((val) => {
    return (
      val && typeof val === "object" && "type" in val && val.type === "doc"
    );
  }, "Invalid article body structure"),
  // Handle either a URL string (existing) or a File object (new upload)
  featuredImage: z
    .union([z.string().url(), z.instanceof(File)])
    .nullable()
    .refine((val) => val !== null, "Featured image is required"),
  tags: z.array(z.string()).max(5, "Maximum 5 tags allowed"),
  status: z
    .enum(["draft", "pending_review", "rejected", "approved"])
    .default("draft"),
});

export type ArticleInput = z.infer<typeof ArticleSchema>;
