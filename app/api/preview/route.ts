import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  if (secret !== process.env.PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 })
  }

  // Add 'await' here
  const draft = await draftMode()
  draft.enable()

  // Or as a one-liner:
  // (await draftMode()).enable()

  redirect(`/posts/${slug}`)
}