import RSS from "rss";
import { fetchLatestArticles } from "@/lib/sanity/api";
import { NextResponse } from "next/server";
import { NewsCardProps } from "@/types";

export async function GET() {
  const feed = new RSS({
    title: "Kurunzi News | Latest Updates",
    description:
      "The heartbeat of Kenya. Delivering breaking news, politics, and sports.",
    site_url: "https://kurunzinews.co.ke",
    feed_url: "https://kurunzinews.co.ke/feed.xml",
    language: "en-KE",
    pubDate: new Date(),
    copyright: `All rights reserved ${new Date().getFullYear()}, Kurunzi News`,
  });

  // Fetch the 20 most recent articles
  const posts = await fetchLatestArticles(20);

  posts.forEach((post: NewsCardProps) => {
    feed.item({
      title: post.title,
      description: post.excerpt || "",
      url: `https://kurunzinews.co.ke/${post.category}/${post.slug}`,
      categories: [post.category],
      date: post.date || new Date(),
    });
  });

  return new NextResponse(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
