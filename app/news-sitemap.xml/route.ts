import { getSportsPosts } from "@/lib/wordpress/wp-api";

export async function GET() {
  const posts = await getSportsPosts();
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://sports.kurunzinews.com";

  // Filter for posts from the last 48 hours
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  const recentPosts = posts.filter((post) => new Date(post.date) > twoDaysAgo);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
      ${recentPosts
        .map(
          (post) => `
        <url>
          <loc>${baseUrl}/${post.category.toLowerCase()}/${post.slug}</loc>
          <news:news>
            <news:publication>
              <news:name>Kurunzi News</news:name>
              <news:language>en</news:language>
            </news:publication>
            <news:publication_date>${new Date(post.date).toISOString()}</news:publication_date>
            <news:title>${post.title.replace(/&/g, "&amp;")}</news:title>
          </news:news>
        </url>
      `,
        )
        .join("")}
    </urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=1800, stale-while-revalidate", // Cache for 30 mins
    },
  });
}
