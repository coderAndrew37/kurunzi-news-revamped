/**
 * Interface for WordPress Post objects returned by search,
 * category, and tag queries.
 */
export interface WordPressFeaturedImage {
  node: {
    sourceUrl: string;
    altText?: string;
  };
}

export interface WordPressCategoryNode {
  name: string;
  slug: string;
}

export interface NewsMetadata {
  theLede?: string;
  isHero?: boolean;
  isBreaking?: boolean;
}

export interface WPPostNode {
  title: string;
  slug: string;
  date: string;
  excerpt?: string;
  categories: {
    nodes: WordPressCategoryNode[];
  };
  featuredImage: WordPressFeaturedImage | null;
  newsData?: NewsMetadata;
}

/**
 * Specifically for the Search Results list
 */
export interface SearchPost extends WPPostNode {}

interface Category {
  slug: string;
  name: string; // WordPress categories use 'name'
}
