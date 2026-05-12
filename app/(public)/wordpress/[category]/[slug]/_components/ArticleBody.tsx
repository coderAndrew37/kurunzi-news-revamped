// app/(public)/wordpress/[category]/[slug]/_components/ArticleBody.tsx
import Link from "next/link";
import { WPPostNode } from "@/lib/wordpress/types";

interface Props {
  article: WPPostNode;
}

export default function ArticleBody({ article }: Props) {
  const categories = article.categories?.nodes ?? [];
  const tags = article.tags?.nodes ?? [];

  return (
    <main className="min-w-0">
      {/* Post HTML from WordPress Gutenberg */}
      <div
        className="kn-wp-content"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Category tags */}
      {(categories.length > 0 || tags.length > 0) && (
        <div className="mt-14 pt-6 border-t border-[var(--rule)]">
          <p className="mb-3 font-['Barlow_Condensed'] text-[10px] font-bold tracking-[0.18em] uppercase text-[var(--ink-faint)]">
            Topics
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/${cat.slug}`} className="kn-tag-chip">
                {cat.name}
              </Link>
            ))}
            {tags.map((tag) => (
              <Link key={tag.slug} href={`/tag/${tag.slug}`} className="kn-tag-chip">
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}