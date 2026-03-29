/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://sports.kurunzinews.com",
  generateRobotsTxt: true,
  exclude: ["/server-sitemap.xml", "/news-sitemap.xml"], // Don't index the indexers
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_BASE_URL || "https://sports.kurunzinews.com"}/server-sitemap.xml`, // Our dynamic Sanity archive
      `${process.env.NEXT_PUBLIC_BASE_URL || "https://sports.kurunzinews.com"}/news-sitemap.xml`, // Our Google News specific feed
    ],
  },
};
