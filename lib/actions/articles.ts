"use server";

import { ArticleSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { createClient } from "../utils/supabase/server"; // Use server client for actions
import { WriterDraft } from "@/types/editor";

export async function saveDraftAction(rawData: WriterDraft) {
  const supabase = await createClient();

  // 1. Get the Authenticated User
  // Crucial for RLS: The policy (auth.uid() = writer_id) depends on this
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Authentication required. Please log in again." };
  }

  // 2. Validate Payload with Zod
  const validated = ArticleSchema.safeParse(rawData);
  if (!validated.success) {
    // Return flattened errors for the UI to display
    return { error: validated.error.flatten().fieldErrors };
  }

  // 3. Prepare the database payload
  // We map the UI 'featuredImage' to DB 'featured_image_url'
  const dbPayload: any = {
    writer_id: user.id, // Strictly use the server-side User ID
    title: validated.data.title,
    content: validated.data.content,
    category: validated.data.category,
    excerpt: rawData.excerpt || "",
    featured_image_url: rawData.featuredImage,
    status: "draft",
    updated_at: new Date().toISOString(),
  };

  // If we have an ID, this is an update. If not, it's a new insert.
  if (rawData.id) {
    dbPayload.id = rawData.id;
  }

  // 4. Upsert the Article
  const { data: article, error: articleError } = await supabase
    .from("article_workflow")
    .upsert(dbPayload)
    .select()
    .single();

  if (articleError) {
    console.error("Supabase RLS/Database Error:", articleError);
    // If you get RLS errors here, check if user.id matches the existing row's writer_id
    return { error: articleError.message };
  }

  // 5. Sync Tags using PostgreSQL Function
  // We only run this if the article was saved successfully
  if (validated.data.tags && validated.data.tags.length > 0) {
    const { error: tagError } = await supabase.rpc("sync_article_tags", {
      target_article_id: article.id,
      tag_names: validated.data.tags,
    });

    if (tagError) {
      console.error("Tag Sync Error:", tagError);
      // We don't fail the whole save if tags fail, but we notify the user
      return {
        success: true,
        articleId: article.id,
        warning: "Article saved, but tags failed to sync.",
      };
    }
  }

  // 6. Refresh the dashboard so the new draft appears
  revalidatePath("/writer/dashboard");

  return {
    success: true,
    articleId: article.id,
  };
}
