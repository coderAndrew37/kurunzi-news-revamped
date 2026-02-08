"use server";

import { createClient as createSupabase } from "@/lib/utils/supabase/server";
import { createError, parseUnknownError } from "@/lib/utils/error-builder";
import { ActionResponse } from "@/types/errors";
import { EicOverrides } from "@/types/database";
import { revalidatePath } from "next/cache";

/**
 * INTERNAL APPROVAL
 * Marks an article as 'approved' in Supabase.
 * This signals editorial clearance without pushing to Sanity.
 */
export async function approveArticleAction(
  articleId: string,
  eicOverrides: EicOverrides = {},
): Promise<ActionResponse<{ status: string }>> {
  const supabase = await createSupabase();

  try {
    // 1. Auth Check
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return {
        success: false,
        error: createError(
          "AUTH_UNAUTHORIZED",
          "Session expired. Please log in.",
        ),
      };
    }

    // 2. Permission Check
    const { data: profile } = await supabase
      .from("profiles")
      .select("permissions")
      .eq("id", userData.user.id)
      .single();

    if (!profile?.permissions?.includes("admin")) {
      return {
        success: false,
        error: createError("AUTH_UNAUTHORIZED", "Admin permissions required."),
      };
    }

    // 3. Update Database with Overrides
    const { error: updateError } = await supabase
      .from("article_workflow")
      .update({
        status: "approved",
        title: eicOverrides.metaTitle || undefined, // Optional: Update title if EIC changed it
        is_breaking: eicOverrides.isBreaking,
        site_context: eicOverrides.siteContext,
        updated_at: new Date().toISOString(),
      })
      .eq("id", articleId);

    if (updateError) {
      return {
        success: false,
        error: createError(
          "DB_FETCH_FAILED",
          "Could not update approval status.",
        ),
      };
    }

    revalidatePath("/admin/queue");
    revalidatePath(`/admin/queue/${articleId}`);

    return { success: true, data: { status: "approved" } };
  } catch (err) {
    console.error("Approval Error:", err);
    return { success: false, error: parseUnknownError(err) };
  }
}
