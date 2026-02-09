import { sanityServerClient as client } from "@/lib/sanity/client";
import { NewsCardProps } from "@/types";

export async function GET() {
  const twoDaysAgo = new Date(
    Date.now() - 2 * 24 * 60 * 60 * 1000,
  ).toISOString();
  const newsPosts = await client.fetch(
    `*[_type == "post" && publishedAt > $twoDaysAgo]`,
    { twoDaysAgo },
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
      ${newsPosts
        .map(
          (post: NewsCardProps) => `
        <url>
          <loc>https://kurunzinews.co.ke/${post.category}/${post.slug}</loc>
          <news:news>
            <news:publication>
              <news:name>Kurunzi News</news:name>
              <news:language>en</news:language>
            </news:publication>
            <news:publication_date>${post.date}</news:publication_date>
            <news:title>${post.title}</news:title>
          </news:news>
        </url>
      `,
        )
        .join("")}
    </urlset>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
