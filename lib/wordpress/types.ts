// lib/types.ts

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

export interface ArticleFields {
  newsData: NewsMetadata;
  matchData: MatchData | null;
  articleCategoryType: string;
  readingTime: number | null;
  featuredVideo: string | null;
  isHeroSlider: boolean;
  relatedArticles: {
    nodes: Array<{ title: string; slug: string }>;
  } | null;
}

// ─── Media ────────────────────────────────────────────────────────────────────

export interface WPImageNode {
  sourceUrl: string;
  altText: string;
  // caption comes from WordPress media library's built-in caption field.
  // In GraphQL this is a string containing HTML (e.g. <p>Photo: John Doe</p>).
  // Strip tags on the frontend if you want plain text.
  caption: string | null;
  // mediaDetails gives you width/height for next/image sizing
  mediaDetails: {
    width: number;
    height: number;
    photoSource?: string; // Custom ACF field for photo source/credit, if you choose to use it
  } | null;
 
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

// ─── SEO (Rank Math) ──────────────────────────────────────────────────────────

export interface WPSeo {
  title: string;
  description: string;
  canonicalUrl: string | null;
  openGraph: {
    title: string;
    description: string;
    image: { url: string } | null;
  } | null;
}

// ─── Full Post Node (from WPGraphQL) ──────────────────────────────────────────

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
  seo: WPSeo | null;
  isBreaking: boolean;
  id: string;
  }

// ─── Sitemap-only slim shape ──────────────────────────────────────────────────

export interface SitemapPostNode {
  slug: string;
  date: string;
  categories: { nodes: Array<{ slug: string }> };
}

// ─── Transformed / UI-facing shapes ──────────────────────────────────────────

// Lean card shape used in lists, feeds, and hero grids
export interface SportsPost {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  featuredImage: string | null;
  category: string;
  newsData: NewsMetadata;
}

export interface NavCategory {
  title: string;
  slug: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface ArticleDetail {
  id: string;
  title: string;
  slug: string;
  date: string;
  content: string;
  excerpt: string;

  // Taxonomy
  categories: { nodes: WPCategory[] };
  tags?: { nodes: WPTag[] } | null;

  // Featured Image
  featuredImage: WPImage | null;

  // ACF Fields
  articleFields: ArticleFields;

  // Author
  author: WPAuthor;

  // SEO
  seo?: {
    title?: string;
    description?: string;
    canonicalUrl?: string;
    openGraph?: {
      title?: string;
      description?: string;
      image?: { url: string } | null;
    };
  } | null;
  isBreaking: boolean;
}