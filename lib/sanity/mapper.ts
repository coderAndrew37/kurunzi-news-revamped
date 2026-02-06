// lib/sanity/mapper.ts
import { NewsCardProps } from "@/types";
import { urlFor } from "./image";

export function mapPostToUi(post: any): NewsCardProps {
  // Generate the URL here on the Server
  let resolvedImage = "/fallback-news.jpg";

  try {
    if (post.mainImage) {
      // urlFor works here because this function is called inside your async Page components (Server)
      resolvedImage = urlFor(post.mainImage).width(800).height(450).url();
    }
  } catch (e) {
    console.error("Mapper Image Error:", e);
  }

  return {
    title: post.title,
    slug: typeof post.slug === "string" ? post.slug : post.slug?.current,
    category: post.category || post.categorySlug || "news",
    date: new Date(post.publishedAt).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    excerpt: post.excerpt || "",
    image: resolvedImage, // This is now a full, authenticated URL string
  };
}
