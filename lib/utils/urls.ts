/**
 * Consistent URL generator for Kurunzi News articles
 */
export const getArticleUrl = (categorySlug: string, articleSlug: string): string => {
  // Ensure we don't have double slashes if a slug is missing
  const cat = categorySlug || 'uncategorized';
  return `/${cat}/${articleSlug}`;
};

export const getCategoryUrl = (slug: string): string => `/${slug}`;
export const getTagUrl = (slug: string): string => `/topic/${slug}`;
export const getAuthorUrl = (slug: string): string => `/auth/${slug}`;