import Link from "next/link";
import { ArticleDetail } from "@/lib/wordpress/types";

interface Props {
  article: ArticleDetail;
}

export default function ArticleBody({ article }: Props) {
  return (
    <main className="min-w-0">
      {/* WordPress block content */}
      <div
        className="kn-wp-content"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Topic tags */}
      {article.categories?.nodes.length > 0 && (
        <div
          className="mt-12 pt-6"
          style={{ borderTop: "1px solid var(--color-rule)" }}
        >
          <p
            className="mb-3 font-[family-name:var(--font-ui)] text-[10px] font-bold tracking-[.18em] uppercase"
            style={{ color: "var(--color-ink-faint)" }}
          >
            Topics
          </p>
          <div className="flex flex-wrap gap-2">
            {article.categories.nodes.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="kn-tag-chip"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}