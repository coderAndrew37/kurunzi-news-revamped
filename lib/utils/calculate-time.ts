export function calculateReadingTime(htmlContent: string): number {
  // Strip HTML tags to extract raw text content matching `strip_tags`
  const text = htmlContent.replace(/<\/?[^>]+(>|$)/g, "");
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  
  // Return ceiling value (matches ceil($wordCount / 200))
  return Math.ceil(wordCount / 200);
}

// Usage inside your Next.js page component:
// const minutesToRead = calculateReadingTime(post.content);