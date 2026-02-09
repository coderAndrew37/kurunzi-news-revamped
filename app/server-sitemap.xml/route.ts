import { getServerSideSitemap } from "next-sitemap";
import { NewsCardProps } from "@/types";
import { sanityServerClient as client } from "@/lib/sanity/client";

export async function GET() {
  const posts = await client.fetch(
    `*[_type == "post"]{ "slug": slug.current, _updatedAt }`,
  );

  const fields = posts.map((post: NewsCardProps) => ({
    loc: `https://kurunzinews.co.ke/${post.category}/${post.slug}`,
    lastmod: post.date,
    changefreq: "daily",
    priority: 0.7,
  }));

  return getServerSideSitemap(fields);
}
