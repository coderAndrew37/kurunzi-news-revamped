import { getServerSideSitemap } from "next-sitemap";
import { getAllPostSlugs } from "@/lib/wordpress/wp-api";

export async function GET() {
  const posts = await getAllPostSlugs();
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://sports.kurunzinews.com";

  const fields = posts.map((post) => ({
    loc: `${baseUrl}/${post.category.toLowerCase()}/${post.slug}`,
    lastmod: new Date(post.date).toISOString(),
    changefreq: "daily" as const,
    priority: 0.7,
  }));

  return getServerSideSitemap(fields);
}
