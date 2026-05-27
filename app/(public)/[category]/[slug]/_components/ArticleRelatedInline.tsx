// app/_components/wordpress/ArticleRelatedInline.tsx
// "You Might Also Like" block inserted mid-article after paragraph 3.
// Red accent throughout — no green.

import Link from "next/link";
import SkeletonImage from "@/app/_components/ui/SkeletonImage";

interface RelatedPost {
  title: string;
  slug: string;
  featuredImage: string | null;
  category?: string;
}

interface Props {
  relatedPosts: RelatedPost[];
  title?: string;
}

export default function ArticleRelatedInline({
  relatedPosts,
  title = "You Might Also Like",
}: Props) {
  if (!relatedPosts || relatedPosts.length === 0) return null;

  return (
    <div className="my-12 py-8 border-y border-gray-200">
      <h3
        className="mb-6 text-[11px] font-bold uppercase tracking-[0.18em] text-red-600"
        style={{ fontFamily: "var(--font-ui)" }}
      >
        {title}
      </h3>

      <div className="space-y-1 divide-y divide-gray-100">
        {relatedPosts.slice(0, 3).map((post) => {
          const categorySlug =
            post.category?.toLowerCase().replace(/\s+/g, "-") || "news";

          return (
            <Link
              key={post.slug}
              href={`/${categorySlug}/${post.slug}`}
              className="group flex items-center gap-4 py-4 hover:bg-gray-50 -mx-3 px-3 rounded transition-colors no-underline"
            >
              {/* Thumbnail */}
              <div className="w-24 h-[68px] shrink-0 relative rounded overflow-hidden bg-gray-100">
                <SkeletonImage
                  src={post.featuredImage}
                  alt={post.title}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                {post.category && (
                  <span
                    className="block mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-red-600"
                    style={{ fontFamily: "var(--font-ui)" }}
                  >
                    {post.category}
                  </span>
                )}
                <h4
                  className="font-bold leading-snug text-[14px] text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {post.title}
                </h4>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}