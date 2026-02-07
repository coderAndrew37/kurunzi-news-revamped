import { fetchNavCategories } from "@/lib/sanity/api";
import NewArticleClient from "./NewArticleClient";

export default async function NewArticlePage() {
  // Fetch categories on the server safely
  const categories = await fetchNavCategories();

  return <NewArticleClient initialCategories={categories} />;
}
