// app/news-sitemap.xml/route.ts
// Google News sitemap — posts from the last 48 hours only.
// Uses getAllPostSlugs() which already fetches title+date+category+slug.
// If you need the post title in the news sitemap you'll need to add
// `title` to the SitemapPostNode type and GET_ALL_SLUGS query; for now
// we fall back to the slug formatted as a title.

import { getSportsPosts } from '@/lib/wordpress/data'

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ??
  'https://sports.kurunzinews.com'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET(): Promise<Response> {
  // getSportsPosts() returns the latest posts with full SportsPost shape
  // (title, date, category, slug) — perfect for the news sitemap.
  const posts = await getSportsPosts()

  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  const recentPosts = posts.filter((post) => new Date(post.date) > twoDaysAgo)

  const items = recentPosts
    .map((post) => {
      const loc = `${BASE_URL}/${post.category.toLowerCase()}/${post.slug}`
      const pubDate = new Date(post.date).toISOString()
      const title = escapeXml(post.title)

      return `
  <url>
    <loc>${loc}</loc>
    <news:news>
      <news:publication>
        <news:name>Kurunzi Sports</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
  </url>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
>${items}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      // 30-minute edge cache; always revalidate in background
      'Cache-Control': 's-maxage=1800, stale-while-revalidate=900',
    },
  })
}