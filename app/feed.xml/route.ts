import RSS from "rss";
import { getSportsPosts } from "@/lib/wordpress/wp-api";
import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://sports.kurunzinews.com";

  const feed = new RSS({
    title: "Kurunzi Sports | Latest Updates",
    description: "The heartbeat of Kenyan sports news.",
    site_url: baseUrl,
    feed_url: `${baseUrl}/feed.xml`,
    language: "en-KE",
    pubDate: new Date(),
    copyright: `All rights reserved ${new Date().getFullYear()}, Kurunzi Sports`,
  });

  const posts = await getSportsPosts();

  posts.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.newsData.theLede,
      url: `${baseUrl}/${post.category.toLowerCase()}/${post.slug}`,
      categories: [post.category],
      date: post.date,
    });
  });

  return new NextResponse(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
