export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  caption?: string;
  source?: string;
  alt?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

// RESTORED: The raw Post interface for section queries
export interface Post {
  _id: string;
  title: string;
  slug: string; // usually resolved to string in mapper/query
  mainImage: SanityImage;
  publishedAt: string;
  excerpt?: string;
  category?: string; // category slug
  authorName?: string;
  authorSlug?: string;
  authorImage?: {
    asset: { _ref: string };
  };
  tags?: { title: string; slug: string }[];
  date: string;
}

// For the full article page
export interface ArticleDetail {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  body: any[];
  mainImage: SanityImage;
  mainImageCaption?: string;
  mainImageSource?: string;
  categoryTitle: string;
  categorySlug: string;
  authorName: string;
  authorBio?: string;
  authorSlug: string;
  authorImage: {
    asset: { _ref: string };
  };
  tags?: { title: string; slug: string }[];
}

export interface NewsCardProps {
  title: string;
  slug: string;
  image: string | SanityImage;
  category: string;
  date: string;
  excerpt?: string;
  imageCaption?: string;
  imageSource?: string;
  imageAlt?: string;
  isBreaking?: boolean;
  author?: string;
}

export interface HomepageSection {
  title: string;
  slug: string;
  posts: Post[]; // Now this works again!
}

export interface SidebarLink {
  name: string;
  href: string;
  icon: string;
}
