import { NewsCardProps } from "@/types";
import { urlFor } from "./image";

export function mapPostToUi(post: any): NewsCardProps {
  return {
    title: post.title,
    // Handle both cases: if slug is a string (from updated GROQ) or an object
    slug: typeof post.slug === "string" ? post.slug : post.slug?.current,

    // CRITICAL CHANGE: Use categorySlug for the URL, fallback to categoryTitle for display
    // If your GROQ uses "category": category->slug.current, post.category will be the slug
    category: post.category || post.categorySlug || "news",

    date: new Date(post.publishedAt).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    excerpt: post.excerpt || "",
    image: post.mainImage
      ? urlFor(post.mainImage).width(800).height(450).url()
      : "/fallback-news.jpg",
  };
}
