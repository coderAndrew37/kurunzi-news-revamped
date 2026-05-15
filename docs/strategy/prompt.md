You are continuing development of Kurunzi Sports — a headless WordPress + Next.js sports website for a Kenyan audience.

## Stack
- WordPress (local: kurunzi-sports.local) with WPGraphQL, ACF Pro, Rank Math SEO
- Next.js 15 App Router, TypeScript strict mode, Tailwind CSS
- No `any` types. Ever.
- CSS only for things Tailwind cannot do (design tokens, pseudo-elements, WP block overrides)
- Components split by concern (one responsibility per file)

## Design system (CSS variables defined in article-page.css)
--ink: #0d0d0d | --ink-soft: #3d3935 | --ink-muted: #7a736c | --ink-faint: #b5aea7
--paper: #fdfcfb | --paper-warm: #f7f4f0 | --rule: #e8e2da
--accent: #1a5c38 | --accent-dark: #134528 | --accent-pale: #eaf3ed
--font-display: "Playfair Display" | --font-body: "Source Serif 4" | --font-ui: "Barlow Condensed"
Breaking red: #dc2626

## Data layer (lib/wordpress/)
- types.ts — WPPostNode, SportsPost, WPAuthorNode, AuthorProfile, NavCategory, PageInfo, TagInfo, WPSeo (nullable)
- wp-api.ts — fetchAPI<T>(), QUERIES object
- data.ts — getSportsPosts, getArticleBySlug, getCategoryArchive, getPostsByTag, getAuthorProfile, getNavCategories, searchArticles, getAllPostSlugs

## URL structure
- / → homepage
- /[category] → category landing (WPNewsSection with viewAllHref)
- /[category]/archive → paginated archive (WPPostListItem list)
- /[category]/[slug] → article detail
- /tag/[tag] → tag archive
- /author/[slug] → author profile (MISSING)
- /search → search page (MISSING)

## Key components already built
- WPNewsSection (title, slug, posts, viewAllHref?, viewAllLabel?)
- WPPostListItem (post, priority?, variant?: "default"|"compact")
- WPArticleLink (categorySlug?, slug, children, className)
- SportsHero (posts, categoryTitle?, categorySlug?)
- WPBreakingNewsTicker
- ArticlePageClient + sub-components (ArticleHeader, ArticleHero, ArticleBody, ArticleSidebar, ArticleAuthorBio, ArticleShareButton, ArticleBookmarkButton, ReadingProgressBar, BackToTopButton)
- Footer (dynamic categories from getNavCategories)


## What to build next (in this order)

### Task 1: Author page (/author/[slug])
- Uses getAuthorProfile(slug) from data.ts
- Returns: { author: AuthorProfile | null, posts: SportsPost[], pageInfo: PageInfo }
- AuthorProfile: { name, description: string|null, avatar: {url:string}|null }
- Layout: author card (avatar, name, bio) at top, then paginated WPPostListItem list below
- Pagination uses ?page= query param + btoa cursor same pattern as archive page
- Path: app/author/[slug]/page.tsx

### Task 2: Search page (/search?q=term)
- Uses searchArticles(term) from data.ts — returns SportsPost[]
- URL-driven: reads ?q= from searchParams, no client-side state for the query
- Search input at top (form with GET action="/search")
- Results as WPPostListItem list
- Empty state when no results or no query
- Path: app/search/page.tsx

### Task 3: On-demand revalidation webhook
WordPress publishes/updates a post → Next.js cache is cleared for that post.
- app/api/revalidate/route.ts: POST handler, validates REVALIDATE_SECRET header, calls revalidateTag(`post-${slug}`) and revalidateTag('posts')
- functions.php addition: wp_remote_post to hit the revalidate route on save_post hook
- Env var: REVALIDATE_SECRET

### Task 4: Sitemap
- app/sitemap.ts using getAllPostSlugs()
- Includes homepage, category pages, all article URLs
- Env var: NEXT_PUBLIC_SITE_URL

### Task 5: if needed, wordpress endpoint protecton

. Implement Fine-Grained ISR (Revalidation)
Instead of fetching data on every single request (which strains your WordPress CPU), use ISR. This serves a static version of the page from the edge cache and updates it in the background.

Global Revalidation: Set a default revalidation period for your sports news.

Implementation: In your wp-api.ts fetcher, add the next object:

On-Demand Revalidation (The "Breaking News" Trigger)
When you publish a "Breaking News" story in WordPress, you don't want to wait 60 seconds for the homepage to update.

The Power Move: Create a Webhook in WordPress that hits a Next.js API route (/api/revalidate) whenever a post is saved.

Result: The moment you click "Publish" in WordPress, the Next.js cache for that category and the home page is purged and rebuilt instantly.

 6. Streaming with Suspense
Don't make the user wait for the entire author profile to load before showing the header.

Implementation: Wrap your post list in <Suspense fallback={<SkeletonList />}>.

UX: The user sees the Author's name and bio immediately, while the articles "stream in" a few milliseconds later.

Always produce complete files ready to copy into the project. No placeholders, no TODOs in code. Split components by concern. No any.