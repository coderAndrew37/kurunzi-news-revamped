import { TiptapNode } from "./editor"; // Adjust path to your TiptapNode definition

/**
 * The strict shape of the 'article_workflow' table in Supabase.
 * This eliminates 'any' when fetching drafts for publication.
 */
export interface ArticleWorkflowRow {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  featured_image_url: string | null;
  status: "draft" | "pending_review" | "approved" | "rejected";
  site_context: "main" | "worldcup" | "elections" | null;
  created_at: string;
  published_at: string | null;
  sanity_id: string | null;
  author_id: string;
  is_breaking?: boolean;

  // The raw JSON tree from the Tiptap Editor
  content: {
    type: "doc";
    content: TiptapNode[];
  };

  // Joined from the 'profiles' table via Supabase .select()
  profiles: {
    sanity_author_id: string;
    full_name: string;
  };
}

/**
 * Overrides provided by the Editor-in-Chief during the final review.
 * These take precedence over what the writer originally submitted.
 */
export interface EicOverrides {
  metaTitle?: string;
  metaDesc?: string;
  isBreaking?: boolean;
  siteContext?: "main" | "worldcup" | "elections";
}
