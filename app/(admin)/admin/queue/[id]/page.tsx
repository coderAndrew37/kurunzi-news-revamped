import { createClient } from "@/lib/utils/supabase/server";
import { ArticleWorkflowRow } from "@/types/database";
import { notFound } from "next/navigation";
import ArticleReviewClient from "./ArticleReviewClient";
import { fetchEditorMetadata } from "@/lib/sanity/api"; // This is safe here!

export default async function ArticleReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch both in parallel for better performance
  const [articleResponse, meta] = await Promise.all([
    supabase
      .from("article_workflow")
      .select(`*, profiles(full_name, sanity_author_id)`)
      .eq("id", id)
      .single(),
    fetchEditorMetadata(),
  ]);

  const article = articleResponse.data as ArticleWorkflowRow | null;

  if (!article) return notFound();

  // Pass meta down to the client component
  return <ArticleReviewClient initialArticle={article} initialMeta={meta} />;
}
