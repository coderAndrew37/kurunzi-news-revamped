// app/(public)/wordpress/[category]/[slug]/_components/ArticleBody.tsx
// Article body: WordPress HTML content split for inline related insertion,
// followed by categories + tag chips.

import Link from "next/link";
import ArticleRelatedInline from "./ArticleRelatedInline";
import { WPPostNode } from "@/lib/wordpress/types";

interface Props {
  article: WPPostNode;
}

export default function ArticleBody({ article }: Props) {
  const categories = article.categories?.nodes ?? [];
  const tags = article.tags?.nodes ?? [];

  const rawRelated = article.articleFields?.relatedArticles?.nodes ?? [];
  const relatedPosts = rawRelated.map((related) => ({
    title: related.title,
    slug: related.slug,
    featuredImage: related.featuredImage?.node?.sourceUrl ?? null,
    category: related.categories?.nodes?.[0]?.name ?? "",
  }));

  const contentHtml = article.content || "";
  const paragraphs = contentHtml
    .split("</p>")
    .filter((p) => p.trim().length > 10);

  // Common typography layout classes to keep both split content blocks identical
  const proseWrapperClasses = `
    kn-wp-content 
    mx-auto 
    max-w-[720px] 
    
    /* Tailwind v4 Typography Engine activation */
    prose 
    prose-gray 
    max-w-none 
    
    /* Fixes in-body images/figures overflowing past the text margins */
    [&_img]:max-w-full 
    [&_img]:h-auto 
    [&_img]:rounded-xl 
    [&_img]:mx-auto
    [&_figure]:max-w-full 
    [&_figure]:mx-auto 
    [&_figure]:my-6
    
    /* Theme styling updates for typography links and headers */
    prose-headings:font-black
    prose-headings:tracking-tight
    prose-a:text-red-600 
    hover:prose-a:text-red-700
  `;

  return (
    <main className="min-w-0 px-4 sm:px-6">
      {/* Top Section: First 3 Paragraphs */}
      <div
        className={proseWrapperClasses}
        dangerouslySetInnerHTML={{
          __html: paragraphs.slice(0, 3).join("</p>") + "</p>",
        }}
      />

      {/* Inline Section Breakdown Element */}
      {relatedPosts.length > 0 && (
        <div className="max-w-[720px] mx-auto my-8">
          <ArticleRelatedInline relatedPosts={relatedPosts} />
        </div>
      )}

      {/* Bottom Section: Remaining Paragraphs */}
      <div
        className={proseWrapperClasses}
        dangerouslySetInnerHTML={{
          __html: paragraphs.slice(3).join("</p>") + "</p>",
        }}
      />

      {/* Topics / Tags Box */}
      {(categories.length > 0 || tags.length > 0) && (
        <div className="max-w-[720px] mx-auto mt-14 pt-6 border-t border-gray-200">
          <p
            className="mb-3 text-[10px] font-bold tracking-[0.18em] uppercase text-gray-400"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            Topics
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="inline-block px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wide text-gray-600 bg-gray-50 border border-gray-200 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors no-underline"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                {cat.name}
              </Link>
            ))}
            {tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tag/${tag.slug}`}
                className="inline-block px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wide text-gray-600 bg-gray-50 border border-gray-200 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors no-underline"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}