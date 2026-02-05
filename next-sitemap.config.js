/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://kurunzinews.co.ke',
  generateRobotsTxt: true,
  exclude: ['/server-sitemap.xml', '/news-sitemap.xml'], // Don't index the indexers
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      'https://kurunzinews.co.ke/server-sitemap.xml', // Our dynamic Sanity archive
      'https://kurunzinews.co.ke/news-sitemap.xml',   // Our Google News specific feed
    ],
  },
}