"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../utils/supabase/server";
import { WriterDraft, ActionResponse } from "@/types/editor";
import { ArticleSchema } from "../validation/article";
import { slugify } from "../utils/slugify";
import { parseUnknownError } from "../utils/error-builder";

/**
 * Saves or Submits the article.
 * Handles validation, Supabase upsert, and tag synchronization.
 */
export async function saveDraftAction(
  rawData: WriterDraft,
): Promise<ActionResponse> {
  const supabase = await createClient();

  // 1. Initial Trace
  console.log(
    `[ACTION_START] Status: ${rawData.status} | Title: ${rawData.title.substring(0, 20)}...`,
  );

  // 2. Validation
  const validated = ArticleSchema.safeParse(rawData);
  if (!validated.success) {
    const fieldErrors = validated.error.flatten().fieldErrors;
    console.error("[VALIDATION_FAILED]:", JSON.stringify(fieldErrors, null, 2));
    return {
      success: false,
      error: fieldErrors,
    };
  }

  // 3. Auth Check
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("[AUTH_FAILED]:", authError?.message);
    return { success: false, error: "Authentication required." };
  }

  const finalSlug = rawData.slug || slugify(validated.data.title);

  try {
    // 4. Database Upsert
    console.log("[DB_UPSERT_ATTEMPT]: Sending payload to Supabase...");

    const { data: article, error: articleError } = await supabase
      .from("article_workflow")
      .upsert({
        ...(rawData.id ? { id: rawData.id } : {}),
        writer_id: user.id,
        title: validated.data.title,
        slug: finalSlug,
        excerpt: validated.data.excerpt,
        category: validated.data.category,
        content: validated.data.content,
        featured_image_url:
          typeof validated.data.featuredImage === "string"
            ? validated.data.featuredImage
            : null,
        image_alt: validated.data.imageAlt || "",
        image_caption: validated.data.imageCaption,
        image_source: validated.data.imageSource,
        is_breaking: validated.data.isBreaking,
        site_context: validated.data.siteContext,
        status: validated.data.status,
        // Reset editor notes when a writer resubmits a rejected article
        ...(validated.data.status === "pending_review"
          ? { editor_notes: null }
          : {}),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (articleError) {
      console.error("[SUPABASE_DATABASE_ERROR]:", articleError);
      throw articleError;
    }

    console.log(`[DB_UPSERT_SUCCESS]: Article ID ${article.id}`);

    // 5. Tag Syncing Logic (Wrapped to be more resilient)
    if (validated.data.tags && validated.data.tags.length > 0) {
      console.log("[TAG_SYNC_START]: Processing tags...");

      const tagInsertions = validated.data.tags.map((name: string) => ({
        name: name.trim(),
        slug: slugify(name),
      }));

      const { data: syncedTags, error: tagUpsertError } = await supabase
        .from("tags")
        .upsert(tagInsertions, { onConflict: "name" })
        .select("id");

      if (tagUpsertError) {
        console.error("[TAG_UPSERT_ERROR]:", tagUpsertError);
        // We throw here because you fixed the RLS, but in production,
        // you might want to log this and continue if tags aren't critical.
        throw tagUpsertError;
      }

      // Sync junction table
      await supabase.from("article_tags").delete().eq("article_id", article.id);

      if (syncedTags && syncedTags.length > 0) {
        const junctionRows = syncedTags.map((tag) => ({
          article_id: article.id,
          tag_id: tag.id,
        }));
        const { error: junctionError } = await supabase
          .from("article_tags")
          .insert(junctionRows);

        if (junctionError) console.error("[JUNCTION_ERROR]:", junctionError);
      }
      console.log("[TAG_SYNC_COMPLETE]");
    }

    // 6. Revalidation
    console.log("[REVALIDATE_START]: Updating cache paths...");
    revalidatePath("/writer/dashboard");
    revalidatePath("/admin/queue");
    console.log("[REVALIDATE_SUCCESS]");

    return { success: true, articleId: article.id };
  } catch (err: any) {
    // 7. Extract the most useful message possible for the client
    const errorMessage =
      err?.message || err?.details || "An unexpected database error occurred";

    console.error("[CRITICAL_SERVER_ACTION_ERROR]:", {
      message: errorMessage,
      code: err?.code,
    });

    return {
      success: false,
      error: `Server Error (${err?.code || "500"}): ${errorMessage}`,
    };
  }
}

/**
 * NEW: Rejects an article and sends it back to the writer
 */
export async function rejectArticleAction(
  articleId: string,
  notes: string,
): Promise<ActionResponse> {
  const supabase = await createClient();

  // Basic check: Ensure editor is authorized (implement your role check here if needed)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const { error } = await supabase
      .from("article_workflow")
      .update({
        status: "rejected",
        editor_notes: notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", articleId);

    if (error) throw error;

    revalidatePath("/writer/dashboard");
    revalidatePath("/admin/queue");
    revalidatePath(`/admin/review/${articleId}`);

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: parseUnknownError(err).message };
  }
}
