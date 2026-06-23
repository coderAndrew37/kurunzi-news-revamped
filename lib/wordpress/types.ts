// lib/wordpress/types.ts
// Single source of truth for all WordPress/GraphQL types.
// Rules:
//  - No `any`. Ever.
//  - No duplicate type definitions (ArticleDetail is gone — use WPPostNode everywhere).
//  - Optional fields use `field: T | null`, never `field?: T` for GraphQL nullable fields.
//    (GraphQL null ≠ undefined — being explicit avoids subtle runtime bugs.)
//  - `seo` is null when WPGraphQL for RankMath plugin is not installed.
//
// CHANGED for the BBC-style homepage redesign:
//  - SportsPost now carries `featuredVideo`, mirroring ArticleFields.featuredVideo.
//    This powers the new dark "Media Feature" band — previously that field only
//    existed on the full WPPostNode, so the lean homepage type had no way to
//    know which posts were video posts without re-fetching full detail.

// ─── ACF Field Groups ─────────────────────────────────────────────────────────

export interface NewsMetadata {
  isHero: boolean;
  isBreaking: boolean;
  theLede: string;
}

export interface MatchData {
  homeTeam: string;
  awayTeam: string;
  finalScore: string;
  competition: string;
  matchDatetime: string;
  venue: string;
  matchStatus: string;
}

// lib/wordpress/types.ts

export interface ArticleFields {
  newsData: NewsMetadata;
  matchData: MatchData | null;
  articleCategoryType: string;
  readingTime: number | null;
  featuredVideo: string | null;
  isHeroSlider: boolean;
  relatedArticles: {
    nodes: Array<{
      title: string;
      slug: string;
      featuredImage?: WPImage | null;
      categories?: { nodes: WPCategory[] } | null;
    }>;
  } | null;
}

// ─── Media ────────────────────────────────────────────────────────────────────
// mediaDetails is the WPGraphQL built-in type — only width/height live here.
// photoSource is an ACF field on MediaItem (Attachments), queried separately
// via the "Media Details" field group → exposed as mediaDetails { photoSource }
// only if you have a custom ACF field group on MediaItem with that field name
// AND it is exposed to GraphQL. Check your ACF Field Groups → Media Details.
// If photoSource is not yet in GraphQL, leave it as null and add it later.

export interface WPMediaDetails {
  width: number;
  height: number;
  // TODO: photoSource — ACF field on MediaItem via "Media Details" field group.
  // Re-add `photoSource` here AND to the IMAGE_FIELDS fragment in wp-api.ts
  // once the ACF field is confirmed visible in GraphQL (ACF → field → Show in GraphQL).
}

export interface WPImageNode {
  sourceUrl: string;
  altText: string;
  // caption = WordPress media library Caption field.
  // Arrives as HTML e.g. "<p>Photo: Reuters</p>".
  // stripTags() in data.ts normalises it to plain text.
  caption: string | null;
  mediaDetails: WPMediaDetails | null;
}

export interface WPImage {
  node: WPImageNode;
}

// ─── Taxonomy ─────────────────────────────────────────────────────────────────

export interface WPCategory {
  name: string;
  slug: string;
}

export interface WPTag {
  name: string;
  slug: string;
  count: number;
}

// ─── Author ───────────────────────────────────────────────────────────────────

export interface WPAuthorNode {
  name: string;
  slug: string;
  description: string | null;
  avatar: { url: string } | null;
}

export interface WPAuthor {
  node: WPAuthorNode;
}

// ─── SEO (Rank Math via WPGraphQL for RankMath plugin) ───────────────────────
// All fields nullable — degrades gracefully if plugin is not installed.
// Install: https://wordpress.org/plugins/wp-graphql-rank-math/

export interface WPSeoOpenGraph {
  title: string | null;
  description: string | null;
  image: { url: string } | null;
}

export interface WPSeo {
  title: string | null;
  description: string | null;
  canonicalUrl: string | null;
  openGraph: WPSeoOpenGraph | null;
}

// ─── Full Post Node (raw WPGraphQL response shape) ────────────────────────────
// This is the canonical article type. Use it everywhere — no ArticleDetail alias.

export interface WPPostNode {
  title: string;
  slug: string;
  date: string;
  content: string;
  excerpt: string;
  categories: { nodes: WPCategory[] };
  tags: { nodes: WPTag[] } | null;
  featuredImage: WPImage | null;
  articleFields: ArticleFields;
  author: WPAuthor;
  // null when WPGraphQL for RankMath is not installed
  seo: WPSeo | null;
}

// ─── Sitemap slim shape ───────────────────────────────────────────────────────

export interface SitemapPostNode {
  slug: string;
  date: string;
  categories: { nodes: Array<{ slug: string }> };
}

// ─── Author profile (getAuthorProfile return) ─────────────────────────────────

export interface AuthorProfile {
  name: string;
  description: string | null;
  avatar: { url: string } | null;
}

// ─── UI-facing / transformed shapes ──────────────────────────────────────────

// Lean card used in lists, feeds, hero grids — avoids passing full WPPostNode
// to every card component.
export interface SportsPost {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  featuredImage: string | null;
  category: string;
  newsData: NewsMetadata;
  // Populated from articleFields.featuredVideo. Drives the homepage Media
  // Feature band — posts with a video get pulled into that section instead
  // of the standard category grid.
  featuredVideo: string | null;
}

export interface NavCategory {
  title: string;
  slug: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface TagInfo {
  name: string;
  count: number;
  slug: string;
}