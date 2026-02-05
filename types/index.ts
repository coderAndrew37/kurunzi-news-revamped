
export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage: SanityImage;
  publishedAt: string;
  excerpt?: string;
  categoryTitle: string;
  authorName?: string;
}

// This is what our UI components will actually consume
export interface NewsCardProps {
  title: string;
  slug: string;
  image: string;
  category: string;
  date: string;
  excerpt?: string;
  authorName?: string;
  authorImage?: string;
  updatedAt?: string;
  publishedAt?: string;
}


export interface HomepageSection {
  title: string;
  slug: string;
  posts: Post[]; // Raw Sanity Posts
}