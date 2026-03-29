. Implement Fine-Grained ISR (Revalidation)
Instead of fetching data on every single request (which strains your WordPress CPU), use ISR. This serves a static version of the page from the edge cache and updates it in the background.

Global Revalidation: Set a default revalidation period for your sports news.

Implementation: In your wp-api.ts fetcher, add the next object:

TypeScript
async function fetchAPI(query: string, variables: Record<string, any> = {}) {
const res = await fetch(process.env.WORDPRESS_API_URL!, {
method: "POST",
headers: { "Content-Type": "application/json" },
next: {
revalidate: 60, // Revalidate every 60 seconds
tags: ['wordpress-posts'] // Tag for manual purge
},
body: JSON.stringify({ query, variables }),
});
// ... rest of code
} 2. On-Demand Revalidation (The "Breaking News" Trigger)
When you publish a "Breaking News" story in WordPress, you don't want to wait 60 seconds for the homepage to update.

The Power Move: Create a Webhook in WordPress that hits a Next.js API route (/api/revalidate) whenever a post is saved.

Result: The moment you click "Publish" in WordPress, the Next.js cache for that category and the home page is purged and rebuilt instantly.

3. Dynamic Route Segment Config
   For pages that rarely change (like your "About Us" or "Terms of Service"), tell Next.js to treat them as purely static. For the "Live Scores" or "Trending" sidebar, keep them dynamic.

In about/page.tsx: export const dynamic = 'force-static'

In search/page.tsx: export const dynamic = 'force-dynamic'

4. Leverage stale-while-revalidate for Images
   Since you are using the next/image component, ensure your images are being served through a loader that supports modern formats (WebP/AVIF).

Kenya Context: This is critical. A 2MB JPEG from WordPress will kill your bounce rate. Next.js will automatically compress these down to ~100KB WebP files, saving your users' data bundles.

5. Metadata & OpenGraph Optimization
   Use the generateMetadata function in your [slug] page to create dynamic share cards.

Muscle Flex: When someone shares a Kurunzi Sports link on WhatsApp, it should show the Featured Image, the Lede as the description, and the Category as the kicker.

TypeScript
export async function generateMetadata({ params }: PageProps) {
const { slug } = await params;
const post = await getArticleBySlug(slug);

return {
title: `${post.title} | Kurunzi Sports`,
description: post.newsData.theLede,
openGraph: {
images: [post.featuredImage],
},
};
} 6. Streaming with Suspense
Don't make the user wait for the entire author profile to load before showing the header.

Implementation: Wrap your post list in <Suspense fallback={<SkeletonList />}>.

UX: The user sees the Author's name and bio immediately, while the articles "stream in" a few milliseconds later.
