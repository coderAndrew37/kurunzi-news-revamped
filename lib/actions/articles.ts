"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../utils/supabase/server";
import { WriterDraft, ActionResponse } from "@/types/editor";
import { ArticleSchema } from "../validation/article";
import { slugify } from "../utils/slugify";
import { parseUnknownError } from "../utils/error-builder";

export async function saveDraftAction(
  rawData: WriterDraft,
): Promise<ActionResponse> {
  const supabase = await createClient();

  // 1. Zod Validation
  const validated = ArticleSchema.safeParse(rawData);
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.flatten().fieldErrors, // Returns Record<string, string[]>
    };
  }

  // 2. Auth Check
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return {
      success: false,
      error: "Authentication required. Please log in again.",
    };
  }

  try {
    // 3. Main Article Upsert
    const { data: article, error: articleError } = await supabase
      .from("article_workflow")
      .upsert({
        ...(rawData.id ? { id: rawData.id } : {}),
        writer_id: user.id,
        title: validated.data.title,
        excerpt: validated.data.excerpt,
        category: validated.data.category,
        content: validated.data.content,
        featured_image_url:
          typeof validated.data.featuredImage === "string"
            ? validated.data.featuredImage
            : null,
        image_caption: validated.data.imageCaption,
        image_source: validated.data.imageSource,
        is_breaking: validated.data.isBreaking,
        site_context: validated.data.siteContext,
        status: validated.data.status,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (articleError) throw articleError;

    // 4. Tag Syncing
    if (validated.data.tags && validated.data.tags.length > 0) {
      // Step A: Upsert tags into the master tags table
      const tagInsertions = validated.data.tags.map((name: string) => ({
        name: name.trim(),
        slug: slugify(name),
      }));

      const { data: syncedTags, error: tagsUpsertError } = await supabase
        .from("tags")
        .upsert(tagInsertions, { onConflict: "name" })
        .select("id");

      if (tagsUpsertError) throw tagsUpsertError;

      // Step B: Update Junction Table
      // First, remove old associations
      await supabase.from("article_tags").delete().eq("article_id", article.id);

      // Link new tag IDs to this article ID
      if (syncedTags) {
        const junctionRows = syncedTags.map((tag) => ({
          article_id: article.id,
          tag_id: tag.id,
        }));
        const { error: junctionError } = await supabase
          .from("article_tags")
          .insert(junctionRows);
        if (junctionError)
          console.error("Junction linking failed:", junctionError);
      }
    }

    revalidatePath("/writer/dashboard");
    return { success: true, articleId: article.id };
  } catch (err: unknown) {
    const appError = parseUnknownError(err);
    return { success: false, error: appError.message };
  }
}
