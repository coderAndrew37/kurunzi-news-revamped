"use server";

import { createClient as createSupabase } from "@/lib/utils/supabase/server";
import { sanityServerClient as sanity } from "@/lib/sanity/server";
import { tiptapToPortableText } from "@/lib/editor/transform";
import { getSanityCategoryId } from "@/lib/sanity/categories";
import { createError, parseUnknownError } from "@/lib/utils/error-builder";
import { ActionResponse } from "@/types/errors";
import { EicOverrides, ArticleWorkflowRow } from "@/types/database";
import { revalidatePath } from "next/cache";

/**
 * EXTERNAL PUBLICATION
 * Migrates content to Sanity CMS and marks status as 'published'.
 */
export async function publishToSanityAction(
  articleId: string,
  eicOverrides: EicOverrides = {},
): Promise<ActionResponse<{ sanityId: string }>> {
  const supabase = await createSupabase();

  try {
    // 1. Auth & Admin Permission Check
    const { data: userData } = await supabase.auth.getUser();
    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("permissions, sanity_author_id")
      .eq("id", userData.user?.id)
      .single();

    if (!adminProfile?.permissions?.includes("admin")) {
      return {
        success: false,
        error: createError("AUTH_UNAUTHORIZED", "Admin access required."),
      };
    }

    // 2. Fetch Source Content from Supabase
    const { data: article } = (await supabase
      .from("article_workflow")
      .select(`*, profiles(sanity_author_id)`)
      .eq("id", articleId)
      .single()) as { data: ArticleWorkflowRow | null };

    if (!article)
      return {
        success: false,
        error: createError("NOT_FOUND", "Article not found."),
      };

    // 3. Transform Content (Tiptap JSON -> Sanity Portable Text)
    const rawPortableText = tiptapToPortableText(article.content.content);
    const categoryRef = getSanityCategoryId(article.category);

    // 4. Media Migration: Featured Image
    let mainImageAssetId: string | null = null;
    if (article.featured_image_url) {
      const imgRes = await fetch(article.featured_image_url);
      const blob = await imgRes.blob();
      const asset = await sanity.assets.upload("image", blob);
      mainImageAssetId = asset._id;
    }

    // 5. Media Migration: Inline Tiptap Images
    const finalBody = await Promise.all(
      rawPortableText.map(async (block) => {
        if (block._type === "inlineImage" && "_tempUrl" in block) {
          try {
            const inlineRes = await fetch(block._tempUrl as string);
            const inlineAsset = await sanity.assets.upload(
              "image",
              await inlineRes.blob(),
            );
            const { _tempUrl, ...cleanBlock } = block;
            return {
              ...cleanBlock,
              asset: { _type: "reference", _ref: inlineAsset._id },
            };
          } catch (e) {
            return block;
          } // Fallback to block without asset if upload fails
        }
        return block;
      }),
    );

    // 6. Create Sanity Document
    const sanityDoc = await sanity.create({
      _type: "post",
      title: article.title,
      slug: {
        _type: "slug",
        current: article.title.toLowerCase().trim().replace(/\s+/g, "-"),
      },
      siteContext: eicOverrides.siteContext || article.site_context || "main",
      excerpt: article.excerpt,
      body: finalBody,
      publishedAt: new Date().toISOString(),
      isBreaking: eicOverrides.isBreaking ?? article.is_breaking,
      supabaseId: article.id,
      seo: {
        _type: "object",
        metaTitle: eicOverrides.metaTitle || article.title,
        metaDesc: article.excerpt,
      },
      author: { _type: "reference", _ref: article.profiles.sanity_author_id },
      editor: { _type: "reference", _ref: adminProfile.sanity_author_id },
      category: { _type: "reference", _ref: categoryRef },
      mainImage: mainImageAssetId
        ? {
            _type: "image",
            asset: { _type: "reference", _ref: mainImageAssetId },
            alt: article.title,
          }
        : undefined,
    });

    // 7. Final Step: Mark as Published in Supabase
    const { error: updateError } = await supabase
      .from("article_workflow")
      .update({
        status: "published",
        sanity_id: sanityDoc._id,
        published_at: new Date().toISOString(),
      })
      .eq("id", articleId);

    if (updateError) {
      return {
        success: false,
        error: createError(
          "DB_FETCH_FAILED",
          "Article live on Sanity, but Supabase sync failed.",
        ),
      };
    }

    revalidatePath("/admin/queue");
    return { success: true, data: { sanityId: sanityDoc._id } };
  } catch (err: any) {
    console.error("Critical Publication Failure:", err);
    return { success: false, error: parseUnknownError(err) };
  }
}
