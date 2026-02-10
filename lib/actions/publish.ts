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
 * HELPER: Extracts the storage path from a Supabase public URL.
 * Example: https://.../public/media/folder/image.webp -> folder/image.webp
 */
const getStoragePath = (url: string) => {
  const parts = url.split("/storage/v1/object/public/media/");
  return parts.length > 1 ? parts[1] : null;
};

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

    // 2. Fetch Source Content
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

    const rawPortableText = tiptapToPortableText(article.content.content);
    const categoryRef = getSanityCategoryId(article.category);

    // 3. Featured Image Migration (Using SDK instead of fetch)
    let mainImageAssetId: string | null = null;
    if (article.featured_image_url) {
      const path = getStoragePath(article.featured_image_url);
      if (path) {
        const { data: blob, error: downloadError } = await supabase.storage
          .from("media")
          .download(path);

        if (blob && !downloadError) {
          const asset = await sanity.assets.upload("image", blob);
          mainImageAssetId = asset._id;
        } else {
          console.error("Featured image download error:", downloadError);
        }
      }
    }

    // 4. Inline Images Migration (Using SDK to bypass Private IP restriction)
    const finalBodyResults = await Promise.all(
      rawPortableText.map(async (block) => {
        if (block._type === "inlineImage" && "_tempUrl" in block) {
          try {
            const path = getStoragePath(block._tempUrl as string);
            if (!path) throw new Error("Invalid storage path");

            // Bypassing fetch to avoid SSRF / Private IP blocks
            const { data: blob, error: downloadError } = await supabase.storage
              .from("media")
              .download(path);

            if (downloadError || !blob) {
              throw new Error(
                `Supabase download failed: ${downloadError?.message}`,
              );
            }

            const inlineAsset = await sanity.assets.upload("image", blob);
            const { _tempUrl, ...cleanBlock } = block;

            return {
              ...cleanBlock,
              asset: {
                _type: "reference",
                _ref: inlineAsset._id,
              },
            };
          } catch (e) {
            console.error("Skipping broken inline image:", e);
            return null; // Block removed entirely to keep Sanity clean
          }
        }
        return block;
      }),
    );

    const cleanedBody = finalBodyResults.filter(Boolean);

    // 5. Create Sanity Document
    const sanityDoc = await sanity.create({
      _type: "post",
      title: article.title,
      slug: {
        _type: "slug",
        current:
          article.slug ||
          article.title.toLowerCase().trim().replace(/\s+/g, "-"),
      },
      siteContext: eicOverrides.siteContext || article.site_context || "main",
      excerpt: article.excerpt,
      body: cleanedBody,
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
            alt: article.image_alt || article.title,
            caption: article.image_caption,
            attribution: article.image_source,
          }
        : undefined,
    });

    // 6. Final Sync to Supabase
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
          "Live on Sanity, Supabase sync failed.",
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
