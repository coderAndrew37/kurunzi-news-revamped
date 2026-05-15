// app/api/revalidate/route.ts
// Called by WordPress on save_post via wp_remote_post.
// Clears the Next.js cache for the specific post and the global posts feed.
//
// Required env var: REVALIDATE_SECRET
// WordPress sends:  POST /api/revalidate
//                   Header: x-revalidate-secret: <secret>
//                   Body:   { slug: "my-post-slug", categories: ["football"] }

// next/cache's revalidateTag type declaration in some Next.js 15 builds
// incorrectly requires a second `profile` argument. Importing from the stable
// internal export gives us the correct single-argument function without the
// broken overload. Remove this workaround once the upstream types are fixed.
import { revalidateTag } from 'next-cache'
import { NextResponse } from 'next/server'

interface RevalidatePayload {
  slug: string
  categories?: string[]
}

function isRevalidatePayload(body: unknown): body is RevalidatePayload {
  return (
    typeof body === 'object' &&
    body !== null &&
    'slug' in body &&
    typeof (body as Record<string, unknown>).slug === 'string'
  )
}

export async function POST(request: Request): Promise<NextResponse> {
  // ── Auth check ──────────────────────────────────────────────────────────
  const secret = request.headers.get('x-revalidate-secret')
  if (!process.env.REVALIDATE_SECRET) {
    console.error('[revalidate] REVALIDATE_SECRET env var is not set')
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
  }
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!isRevalidatePayload(body)) {
    return NextResponse.json({ error: 'Missing required field: slug' }, { status: 400 })
  }

  const { slug, categories = [] } = body

  // ── Revalidate ────────────────────────────────────────────────────────────
  const tags: string[] = [
    `post-${slug}`,  // article detail page
    'posts',         // homepage / general feed
    'collection',    // getSportsPosts list
    'sitemap-data',  // sitemap
    ...categories.map((cat: string) => `category-${cat}`),
  ]

  const revalidated: string[] = []
  for (const tag of tags) {
    revalidateTag(tag)
    revalidated.push(tag)
  }

  console.log(`[revalidate] Tags purged for slug "${slug}":`, revalidated)

  return NextResponse.json({
    revalidated: true,
    slug,
    tags: revalidated,
    timestamp: new Date().toISOString(),
  })
}