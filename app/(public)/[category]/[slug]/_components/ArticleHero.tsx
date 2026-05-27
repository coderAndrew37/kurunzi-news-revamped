// app/(public)/wordpress/[category]/[slug]/_components/ArticleHero.tsx
// Full-width hero image. 16:9 mobile → 21:9 desktop.
// Caption uses WP media library Caption field (plain text, stripped in data.ts).

import SkeletonImage from "@/app/_components/ui/SkeletonImage";
import { WPPostNode } from "@/lib/wordpress/types";

interface Props {
  article: WPPostNode;
}

export default function ArticleHero({ article }: Props) {
  const img = article.featuredImage?.node;
  if (!img?.sourceUrl) return null;

  return (
    <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pb-10">
      <figure>
        <div className="relative w-full overflow-hidden rounded-sm bg-gray-100 aspect-video lg:aspect-[21/9]">
          <SkeletonImage
            src={img.sourceUrl}
            alt={img.altText ?? article.title}
            priority
            className="object-cover"
          />
        </div>

        {img.caption && (
          <figcaption
            className="mt-3 pl-3 border-l-2 border-red-600 text-[11px] tracking-wide leading-snug text-gray-500"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            {img.caption}
          </figcaption>
        )}
      </figure>
    </div>
  );
}