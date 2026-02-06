"use server";

import { ArticleSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { createClient } from "../utils/supabase/client";
import { WriterDraft } from "@/types/editor";

export async function saveDraftAction(rawData: WriterDraft) {
  const supabase = await createClient();

  // 1. Validate with Zod
  const validated = ArticleSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Insert/Update the Article
  const { data: article, error: articleError } = await supabase
    .from("article_workflow")
    .upsert({
      id: rawData.id || undefined, // Upsert if ID exists, else insert
      writer_id: user?.id,
      title: validated.data.title,
      content: validated.data.content,
      category: validated.data.category,
      status: "draft",
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (articleError) return { error: articleError.message };

  // 3. Sync Tags using our PostgreSQL Function
  // This handles creating new tags and linking them in one go
  const { error: tagError } = await supabase.rpc("sync_article_tags", {
    target_article_id: article.id,
    tag_names: validated.data.tags,
  });

  if (tagError) return { error: tagError.message };

  revalidatePath("/dashboard");
  return { success: true, articleId: article.id };
}
