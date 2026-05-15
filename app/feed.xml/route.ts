import RSS from "rss";
import { getSportsPosts } from "@/lib/wordpress/data";
import { NextResponse } from "next/server";
import type { SportsPost } from "@/lib/wordpress/types";

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

  const posts: SportsPost[] = await getSportsPosts();

  posts.forEach((post: SportsPost) => {
    feed.item({
      title: post.title,
      description: post.newsData.theLede || post.excerpt,
      url: `${baseUrl}/${post.category.toLowerCase().replace(/\s+/g, "-")}/${post.slug}`,
      categories: [post.category],
      date: post.date,
      // Optional but recommended
      guid: `${baseUrl}/${post.slug}`,
    });
  });

  return new NextResponse(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
