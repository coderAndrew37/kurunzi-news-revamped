import { getSportsPosts, getNavCategories } from "@/lib/wordpress/wp-api";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://sports.kurunzinews.com";

  // 1. Fetch data from your "Muscle Flexed" API
  const [posts, categories] = await Promise.all([
    getSportsPosts(),
    getNavCategories(),
  ]);

  // 2. Map Posts to Sitemap format
  const postEntries = posts.map((post) => ({
    url: `${baseUrl}/${post.category.toLowerCase()}/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  // 3. Map Categories
  const categoryEntries = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  // 4. Return the full map
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "always" as const,
      priority: 1,
    },
    ...postEntries,
    ...categoryEntries,
  ];
}
