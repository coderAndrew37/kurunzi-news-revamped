// app/_components/wordpress/ArticleRelatedInline.tsx
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
    <div className="my-12 py-8 border-y border-[#e8e2da]">
      <h3 className="text-xl font-bold mb-6 text-red-600 tracking-tight underline underline-offset-4 decoration-2 decoration-red-600">
        {title}
      </h3>

      <div className="space-y-8">
        {relatedPosts.slice(0, 3).map((post) => {
          const categorySlug =
            post.category?.toLowerCase().replace(/\s+/g, "-") || "news";

          return (
            <Link
              key={post.slug}
              href={`/${categorySlug}/${post.slug}`}
              className="group flex gap-5 hover:bg-[#f8f5f0] -mx-3 px-3 py-2 rounded-md transition-colors"
            >
              {/* Content */}
              <div className="flex-1">
                {post.category && (
                  <span className="text-[#1a5c38] text-xs font-bold uppercase tracking-widest">
                    {post.category}
                  </span>
                )}
                <h4 className="mt-1.5 font-bold leading-tight text-[15.5px] group-hover:text-red-600 transition-colors line-clamp-3">
                  {post.title}
                </h4>
              </div>

              {/* Image */}
              <div className="w-28 h-20 shrink-0 relative rounded-md overflow-hidden bg-gray-100 border border-gray-100">
                <SkeletonImage
                  src={post.featuredImage}
                  alt={post.title}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
