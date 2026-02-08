import { createClient } from "@/lib/utils/supabase/server";
import { notFound } from "next/navigation";
import { WriterDraft } from "@/types/editor";
import NewArticleClient from "../../new/NewArticleClient";

/**
 * EDIT ARTICLE PAGE
 * Logic: Fetches the article, joins its tags, maps database fields to
 * the WriterDraft interface, and initializes the Client Editor.
 */
export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();

  // 1. Resolve URL Params
  const { id } = await params;

  // 2. Fetch Article & Meta Data in parallel for speed
  const [articleQuery, categoriesQuery, tagsQuery] = await Promise.all([
    supabase.from("article_workflow").select("*").eq("id", id).single(),

    supabase
      .from("categories")
      .select("title, slug")
      .order("title", { ascending: true }),

    supabase
      .from("article_tags")
      .select(
        `
        tags (
          name
        )
      `,
      )
      .eq("article_id", id),
  ]);

  const { data: rawArticle, error: articleError } = articleQuery;
  const { data: categories } = categoriesQuery;
  const { data: rawTags } = tagsQuery;

  // 3. Guard: If article doesn't exist, 404
  if (articleError || !rawArticle) {
    notFound();
  }

  // 4. Flatten Tags (converts Supabase join structure to string[])
  const tags = rawTags?.map((t: any) => t.tags?.name).filter(Boolean) || [];

  // 5. Map Database Schema (snake_case) to UI Interface (camelCase)
  const article: WriterDraft = {
    id: rawArticle.id,
    title: rawArticle.title || "",
    slug: rawArticle.slug || "",
    excerpt: rawArticle.excerpt || "",
    category: rawArticle.category || "",
    content: rawArticle.content || { type: "doc", content: [] },
    status: rawArticle.status,

    // Media Mapping
    featuredImage: rawArticle.featured_image_url || null,
    imageAlt: rawArticle.image_alt || "",
    imageCaption: rawArticle.image_caption || "",
    imageSource: rawArticle.image_source || "",

    // Editorial Context
    isBreaking: rawArticle.is_breaking || false,
    siteContext: rawArticle.site_context || "main",
    editorNotes: rawArticle.editor_notes || "",

    // Meta
    tags: tags,
    createdAt: rawArticle.created_at,
    updatedAt: rawArticle.updated_at,
  };

  // 6. Return the Client Component
  return (
    <div className="min-h-screen bg-white">
      <NewArticleClient
        initialData={article}
        initialCategories={categories || []}
      />
    </div>
  );
}
