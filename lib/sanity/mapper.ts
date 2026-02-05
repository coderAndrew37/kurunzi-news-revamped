import { Post, NewsCardProps } from '@/types';
import { urlFor } from './image';

export function mapPostToUi(post: Post): NewsCardProps {
  return {
    title: post.title,
    slug: post.slug.current,
    category: post.categoryTitle,
    date: new Date(post.publishedAt).toLocaleDateString('en-KE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    excerpt: post.excerpt || '',
    // Use the image transformer we built earlier
    image: post.mainImage 
      ? urlFor(post.mainImage).width(800).height(450).url() 
      : '/fallback-news.jpg',
  };
}