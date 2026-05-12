// app/(public)/wordpress/[category]/[slug]/_components/ArticleHero.tsx
import SkeletonImage from "@/app/_components/ui/SkeletonImage";
import { WPPostNode } from "@/lib/wordpress/types";

interface Props {
  article: WPPostNode;
}

export default function ArticleHero({ article }: Props) {
  const img = article.featuredImage?.node;

  return (
    <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pb-10">
      <figure>
        {/* 16:9 mobile → cinematic 21:9 desktop */}
        <div className="relative w-full overflow-hidden rounded-sm bg-[var(--paper-warm)] aspect-video lg:aspect-[21/9]">
          <SkeletonImage
            src={img?.sourceUrl ?? null}
            alt={img?.altText ?? article.title}
            priority
            className="object-cover"
          />
        </div>

        {/* Caption = WP media library Caption field (plain text after stripTags in data.ts) */}
        {img?.caption && (
          <figcaption className="mt-2.5 pl-3 border-l-2 border-[var(--accent)] font-['Barlow_Condensed'] text-[11px] tracking-[0.03em] text-[var(--ink-muted)] leading-snug">
            {img.caption}
          </figcaption>
        )}
      </figure>
    </div>
  );
}