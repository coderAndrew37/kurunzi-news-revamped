import Link from "next/link";
import { SearchPost } from "@/types/wordpress";

interface ArticleListItemProps {
  post: SearchPost;
  priority?: boolean;
}

export default function ArticleListItem({
  post,
  priority = false,
}: ArticleListItemProps) {
  // Extracting data from the WordPress GraphQL structure
  const category = post.categories?.nodes[0];
  const imageUrl = post.featuredImage?.node?.sourceUrl || "/placeholder.jpg";

  // Logic: Prefer 'theLede' from ACF, fallback to WP excerpt, then empty string
  const excerpt =
    post.newsData?.theLede || post.excerpt?.replace(/<[^>]+>/g, "") || "";

  return (
    <Link
      href={`/${category?.slug || "news"}/${post.slug}`}
      className="group flex flex-col md:flex-row gap-6 border-b border-[#e8e2da] pb-8 transition-all hover:bg-[#f7f4f0]/50 p-4 -mx-4 rounded-sm"
    >
      {/* Image container */}
      <div className="relative w-full md:w-48 h-32 shrink-0 overflow-hidden rounded-sm bg-[#f7f4f0] border border-[#e8e2da]">
        <img
          src={imageUrl}
          alt={post.title}
          className="object-cover w-full h-full transition duration-500 group-hover:scale-110"
          loading={priority ? "eager" : "lazy"}
        />
        {category && (
          <span className="absolute top-2 left-2 bg-[#1a5c38] text-white text-[9px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest">
            {category.name}
          </span>
        )}
      </div>

      {/* Text container */}
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
