// app/sitemap.ts
// Static sitemap generated at build time (revalidated daily via sitemap-data tag).
// Env var: NEXT_PUBLIC_SITE_URL  (e.g. https://kurunzisports.com)

import type { MetadataRoute } from 'next'
import { getNavCategories, getAllPostSlugs } from '@/lib/wordpress/data'

export const revalidate = 86400 // 24 h — matches getAllPostSlugs cache time

function siteUrl(path: string): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kurunzisports.com').replace(
    /\/$/,
    '',
  )
  return `${base}${path}`
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugData, categories] = await Promise.all([
    getAllPostSlugs(),
    getNavCategories(),
  ])

  // ── Static routes ────────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl('/'),
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: siteUrl('/search'),
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // ── Category landing + archive ────────────────────────────────────────────
  const categoryRoutes: MetadataRoute.Sitemap = categories.flatMap((cat) => [
    {
      url: siteUrl(`/${cat.slug}`),
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    },
    {
      url: siteUrl(`/${cat.slug}/archive`),
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    },
  ])

  // ── Article pages ─────────────────────────────────────────────────────────
  const articleRoutes: MetadataRoute.Sitemap = slugData.map(({ slug, date, category }) => ({
    url: siteUrl(`/${category}/${slug}`),
    lastModified: new Date(date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes]
}