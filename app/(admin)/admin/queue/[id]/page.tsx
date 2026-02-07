import { createClient } from "@/lib/utils/supabase/server";
import { ArticleWorkflowRow } from "@/types/database";

import { notFound } from "next/navigation";
import ArticleReviewClient from "./ArticleReviewClient";

export default async function ArticleReviewPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  // Fetch from Supabase on the server
  const { data: article } = (await supabase
    .from("article_workflow")
    .select(`*, profiles(full_name, sanity_author_id)`)
    .eq("id", params.id)
    .single()) as { data: ArticleWorkflowRow | null };

  if (!article) return notFound();

  return <ArticleReviewClient initialArticle={article} />;
}
