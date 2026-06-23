// app/_components/wordpress/WPMediaFeature.tsx
// BBC-style dark video/media panel — a horizontally scrollable row of video
// thumbnails with a play-icon overlay, sitting inside a full-width dark band
// so it reads as a distinct "media" zone against the white article grid.
//
// Fed by posts where articleFields.featuredVideo is set (see SportsPost.featuredVideo
// in lib/wordpress/types.ts and the matching GET_SPORTS_POSTS query change).

import ArticleLink from "@/app/_components/wordpress/WPArticleLink";
import SkeletonImage from "@/app/_components/ui/SkeletonImage";
import { SportsPost } from "@/lib/wordpress/types";

interface Props {
  title?: string;
  posts: SportsPost[]; // posts where featuredVideo is set
}

function PlayBadge() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center group-hover:bg-red-600 transition-colors">
        <svg className="w-4 h-4 text-gray-900 group-hover:text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
  );
}

function VideoCard({ post }: { post: SportsPost }) {
  const catSlug = post.category?.toLowerCase().replace(/\s+/g, "-") ?? "video";

  return (
    <ArticleLink categorySlug={catSlug} slug={post.slug} className="group flex-shrink-0 w-[260px] sm:w-[300px]">
      <div className="relative overflow-hidden rounded-lg aspect-video bg-gray-800">
        <SkeletonImage
          src={post.featuredImage}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        />
        <div className="absolute inset-0 bg-black/20" />
        <PlayBadge />
      </div>
      <h3 className="mt-3 text-[14px] font-bold text-white leading-snug line-clamp-2 group-hover:text-red-400 transition-colors">
        {post.title}
      </h3>
      <span className="block mt-1 text-[11px] font-medium text-gray-400 uppercase tracking-wide">
        {post.category}
      </span>
    </ArticleLink>
  );
}

export default function MediaFeature({ title = "Video", posts }: Props) {
  if (!posts.length) return null;

  return (
    <section className="w-full bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1.5 h-7 bg-red-600 rounded-sm" />
          <h2 className="text-xl lg:text-2xl font-bold text-white tracking-tight">{title}</h2>
        </div>

        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-1 px-1 pb-2">
          {posts.map((post) => (
            <VideoCard key={post.slug} post={post} />
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-none { scrollbar-width: none; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}