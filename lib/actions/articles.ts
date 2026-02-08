"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../utils/supabase/server";
import { WriterDraft, ActionResponse } from "@/types/editor";
import { ArticleSchema } from "../validation/article";
import { slugify } from "../utils/slugify";
import { parseUnknownError } from "../utils/error-builder";

/**
 * UPDATED: Saves or Submits the article
 */
export async function saveDraftAction(
  rawData: WriterDraft,
): Promise<ActionResponse> {
  const supabase = await createClient();

  const validated = ArticleSchema.safeParse(rawData);
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "Authentication required." };
  }

  const finalSlug = rawData.slug || slugify(validated.data.title);

  try {
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
        image_alt: rawData.imageAlt || "",
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

    if (articleError) throw articleError;

    // Tag Syncing Logic
    if (validated.data.tags && validated.data.tags.length > 0) {
      const tagInsertions = validated.data.tags.map((name: string) => ({
        name: name.trim(),
        slug: slugify(name),
      }));

      const { data: syncedTags } = await supabase
        .from("tags")
        .upsert(tagInsertions, { onConflict: "name" })
        .select("id");

      await supabase.from("article_tags").delete().eq("article_id", article.id);

      if (syncedTags) {
        const junctionRows = syncedTags.map((tag) => ({
          article_id: article.id,
          tag_id: tag.id,
        }));
        await supabase.from("article_tags").insert(junctionRows);
      }
    }

    revalidatePath("/writer/dashboard");
    revalidatePath("/admin/queue");
    return { success: true, articleId: article.id };
  } catch (err: unknown) {
    return { success: false, error: parseUnknownError(err).message };
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
