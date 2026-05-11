// components/ArticleListItem.tsx
// Uses SportsPost from types.ts (the lean card shape from wordpress.ts mapper).
// Note: SportsPost.featuredImage is already a flat string | null — no .node.sourceUrl needed.

import Link from "next/link";
import SkeletonImage from "../ui/SkeletonImage";
import { SportsPost } from "@/lib/wordpress/types";

interface ArticleListItemProps {
  post: SportsPost;
  priority?: boolean;
}

export default function ArticleListItem({
  post,
  priority = false,
}: ArticleListItemProps) {
  // SportsPost already has category as a flat string from the toSportsPost() mapper
  const categorySlug = post.category?.toLowerCase().replace(/\s+/g, "-") ?? "news";

  // SportsPost.featuredImage is already a flat string | null
  const imageUrl = post.featuredImage ?? null;

  // theLede from ACF → fallback to WP excerpt (strip HTML tags)
  const excerpt =
    post.newsData?.theLede ||
    post.excerpt?.replace(/<[^>]+>/g, "") ||
    "";

  return (
    <Link
      href={`/${categorySlug}/${post.slug}`}
      className="group flex flex-col md:flex-row gap-6 border-b border-[#e8e2da] pb-8 transition-all hover:bg-[#f7f4f0]/50 p-4 -mx-4 rounded-sm"
    >
      {/* Image */}
      <div className="relative w-full md:w-48 h-32 shrink-0 overflow-hidden rounded-sm bg-[#f7f4f0] border border-[#e8e2da]">
        <SkeletonImage
          src={imageUrl}
          alt={post.title}
          priority={priority}
          className="transition duration-500 group-hover:scale-110"
        />

        {post.category && (
          <span className="absolute top-2 left-2 z-10 bg-[#1a5c38] text-white text-[9px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest shadow-sm">
            {post.category}
          </span>
        )}
      </div>

      {/* Text */}
      <div className="flex-1">
        <h2 className="kn-headline text-xl text-[#0d0d0d] group-hover:text-[#1a5c38] transition-colors leading-tight mb-2">
          {post.title}
        </h2>

        {excerpt && (
          <p className="font-['Source_Serif_4'] text-[#3d3935] text-sm leading-relaxed line-clamp-2">
            {excerpt}
          </p>
        )}

        <div className="flex items-center gap-3 mt-4">
          <span className="font-['Barlow_Condensed'] text-[11px] font-bold uppercase text-[#b5aea7] tracking-widest">
            {new Date(post.date).toLocaleDateString("en-KE", {
              dateStyle: "long",
            })}
          </span>
          <span className="text-[#1a5c38] text-xs font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
            Read Story →
          </span>
        </div>
      </div>
    </Link>
  );
}