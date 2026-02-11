// app/_components/ArticleListItem.tsx
import Link from "next/link";
import Image from "next/image";
import { NewsCardProps } from "@/types";
import { urlFor } from "@/lib/sanity/image";

interface ArticleListItemProps {
  post: NewsCardProps;
  priority?: boolean;
}

export default function ArticleListItem({
  post,
  priority = false,
}: ArticleListItemProps) {
  const imageUrl =
    typeof post.image === "string"
      ? post.image
      : post.image
        ? urlFor(post.image).width(400).height(300).url()
        : "/fallback-news.jpg";

  return (
    <Link
      href={`/${post.category}/${post.slug}`}
      className="group flex gap-6 border-b border-gray-100 pb-6 transition-all hover:bg-gray-50/50 p-3 -mx-3 rounded-2xl"
    >
      {/* Text container */}
      <div className="flex-1">
        <h2 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors tracking-tight">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-gray-600 text-sm leading-relaxed mt-2 line-clamp-2 font-serif">
            {post.excerpt}
          </p>
        )}
        <span className="text-[11px] font-bold uppercase mt-4 block text-gray-400 tracking-wider">
          {post.date}
        </span>
      </div>

      {/* Image */}
      <div className="relative w-32 h-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 shadow-sm border border-gray-200/50 group-hover:shadow-md transition-shadow">
        <Image
          src={imageUrl}
          alt={post.title}
          fill
          sizes="128px"
          className="object-cover transition duration-500 group-hover:scale-110"
          priority={priority}
        />
      </div>
    </Link>
  );
}
