import { createClient } from "@/lib/utils/supabase/server";
import NewArticlePage from "../../new/page";
import { notFound } from "next/navigation";
import { WriterDraft } from "@/types/editor";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();

  const resolvedParams = await params;
  const id = resolvedParams.id;

  const { data: rawArticle } = await supabase
    .from("article_workflow")
    .select("*")
    .eq("id", id)
    .single();

  if (!rawArticle) notFound();

  // Map database fields to our TypeScript Interface
  const article: WriterDraft = {
    id: rawArticle.id,
    title: rawArticle.title,
    excerpt: rawArticle.excerpt,
    category: rawArticle.category,
    featuredImage: rawArticle.featured_image_url, // Map snake_case to camelCase
    content: rawArticle.content,
    status: rawArticle.status,
    tags: rawArticle.tags || [],
    createdAt: rawArticle.created_at,
    updatedAt: rawArticle.updated_at,
  };

  return <NewArticlePage initialData={article} />;
}
