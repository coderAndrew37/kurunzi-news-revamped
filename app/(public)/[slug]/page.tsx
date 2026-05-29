// app/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/wordpress/data";
// Re-use your exact nested article page file as a layout component
import NestedArticlePage from "../[category]/[slug]/page"; 

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BareSlugArticlePage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Fetch the complete WPPostNode directly from your data engine
  const post = await getArticleBySlug(slug);

  // 2. If the article doesn't exist in WordPress, drop to your 404 handler
  if (!post) {
    notFound();
  }

  // 3. Extract the category slug dynamically from the post node payload
  const categorySlug = post.categories?.nodes?.[0]?.slug ?? "news";

  // 4. Pass the parameters directly into your existing page layout
  return (
    <NestedArticlePage 
      params={Promise.resolve({ 
        category: categorySlug, 
        slug: slug 
      })} 
    />
  );
}