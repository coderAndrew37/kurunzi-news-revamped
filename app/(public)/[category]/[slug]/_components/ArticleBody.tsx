// app/(public)/wordpress/[category]/[slug]/_components/ArticleBody.tsx
import Link from "next/link";
import ArticleRelatedInline from "./ArticleRelatedInline";
import { WPPostNode } from "@/lib/wordpress/types";

interface Props {
  article: WPPostNode;
}

export default function ArticleBody({ article }: Props) {
  const categories = article.categories?.nodes ?? [];
  const tags = article.tags?.nodes ?? [];

  // Transform related articles safely
  const rawRelated = article.articleFields?.relatedArticles?.nodes ?? [];

  const relatedPosts = rawRelated.map((related) => ({
    title: related.title,
    slug: related.slug,
    featuredImage: related.featuredImage?.node?.sourceUrl ?? null,
    category: related.categories?.nodes?.[0]?.name ?? "",
  }));

  const contentHtml = article.content || "";

  // Split content for inline insertion
  const paragraphs = contentHtml
    .split("</p>")
    .filter((p) => p.trim().length > 10);

  return (
    <main className="min-w-0">
      {/* First part of content */}
      <div
        className="kn-wp-content"
        dangerouslySetInnerHTML={{
          __html: paragraphs.slice(0, 3).join("</p>") + "</p>",
        }}
      />

      {/* Inline Related Articles (PD Style) */}
      {relatedPosts.length > 0 && (
        <ArticleRelatedInline relatedPosts={relatedPosts} />
      )}

      {/* Remaining content */}
      <div
        className="kn-wp-content"
        dangerouslySetInnerHTML={{
          __html: paragraphs.slice(3).join("</p>") + "</p>",
        }}
      />

      {/* Topics / Tags */}
      {(categories.length > 0 || tags.length > 0) && (
        <div className="mt-14 pt-6 border-t border-[var(--rule)]">
          <p className="mb-3 font-['Barlow_Condensed'] text-[10px] font-bold tracking-[0.18em] uppercase text-[var(--ink-faint)]">
            Topics
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="kn-tag-chip"
              >
                {cat.name}
              </Link>
            ))}
            {tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tag/${tag.slug}`}
                className="kn-tag-chip"
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
