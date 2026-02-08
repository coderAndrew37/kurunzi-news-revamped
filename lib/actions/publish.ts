"use server";

import { createClient as createSupabase } from "@/lib/utils/supabase/server";
import { sanityServerClient as sanity } from "@/lib/sanity/server";
import { tiptapToPortableText } from "@/lib/editor/transform";
import { getSanityCategoryId } from "@/lib/sanity/categories";
import { createError, parseUnknownError } from "@/lib/utils/error-builder";
import { ActionResponse } from "@/types/errors";
import { EicOverrides, ArticleWorkflowRow } from "@/types/database";

/**
 * High-integrity action to move an article from Supabase Workflow to Sanity CMS.
 * Handles content transformation, media migration, and cross-platform referencing.
 */
export async function approveAndPublishAction(
  articleId: string,
  eicOverrides: EicOverrides = {},
): Promise<ActionResponse<{ sanityId: string }>> {
  const supabase = await createSupabase();

  try {
    // 1. Authentication & Permission Check
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

    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("permissions, sanity_author_id")
      .eq("id", userData.user.id)
      .single();

    if (!adminProfile?.permissions?.includes("admin")) {
      return {
        success: false,
        error: createError(
          "AUTH_UNAUTHORIZED",
          "Unauthorized: Admin access required.",
        ),
      };
    }

    // 2. Fetch Source Content from Supabase
    const { data: article, error: dbError } = (await supabase
      .from("article_workflow")
      .select(`*, profiles(sanity_author_id)`)
      .eq("id", articleId)
      .single()) as { data: ArticleWorkflowRow | null; error: unknown };

    if (dbError || !article) {
      return {
        success: false,
        error: createError(
          "NOT_FOUND",
          "The requested draft could not be found.",
        ),
      };
    }

    // 3. Transformation Phase (Strictly Typed)
    const rawPortableText = tiptapToPortableText(article.content.content);
    const categoryRef = getSanityCategoryId(article.category);

    // 4. Media Migration (Main & Inline)
    let mainImageAssetId: string | null = null;
    if (article.featured_image_url) {
      const imgRes = await fetch(article.featured_image_url);
      const blob = await imgRes.blob();
      const asset = await sanity.assets.upload("image", blob);
      mainImageAssetId = asset._id;
    }

    const finalBody = await Promise.all(
      rawPortableText.map(async (block) => {
        // We only process blocks that the transformer flagged as having temp URLs
        if (
          block._type === "inlineImage" &&
          "_tempUrl" in block &&
          typeof block._tempUrl === "string"
        ) {
          try {
            const inlineRes = await fetch(block._tempUrl);
            const inlineAsset = await sanity.assets.upload(
              "image",
              await inlineRes.blob(),
            );

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { _tempUrl, ...cleanBlock } = block;
            return {
              ...cleanBlock,
              asset: { _type: "reference", _ref: inlineAsset._id },
            };
          } catch (e) {
            console.error(
              "Inline image migration failed, skipping block asset.",
              e,
            );
            return block;
          }
        }
        return block;
      }),
    );

    // 5. Sanity Document Creation
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
      isBreaking: eicOverrides.isBreaking ?? false,
      supabaseId: article.id,

      // SEO & Social Configuration
      seo: {
        _type: "object",
        metaTitle: eicOverrides.metaTitle || article.title,
        metaDesc: eicOverrides.metaDesc || article.excerpt,
      },

      // Editorial Accountability References
      author: {
        _type: "reference",
        _ref: article.profiles.sanity_author_id,
      },
      editor: {
        _type: "reference",
        _ref: adminProfile.sanity_author_id,
      },
      category: {
        _type: "reference",
        _ref: categoryRef,
      },

      mainImage: mainImageAssetId
        ? {
            _type: "image",
            asset: { _type: "reference", _ref: mainImageAssetId },
            alt: article.title,
          }
        : undefined,
    });

    // 6. Update Workflow Status in Supabase
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
          "Sanity created, but failed to update Supabase status.",
        ),
      };
    }

    return { success: true, data: { sanityId: sanityDoc._id } };
  } catch (err: unknown) {
    console.error("Critical Publishing Failure:", err);
    return { success: false, error: parseUnknownError(err) };
  }
}
