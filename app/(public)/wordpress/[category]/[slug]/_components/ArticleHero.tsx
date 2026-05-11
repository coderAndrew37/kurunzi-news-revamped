import SkeletonImage from "@/app/_components/ui/SkeletonImage";
import { ArticleDetail } from "@/lib/wordpress/types";

interface Props {
  article: ArticleDetail;
}

export default function ArticleHero({ article }: Props) {
  const img = article.featuredImage?.node;
  
  /**
   * We extract the credit from mediaDetails to keep the JSX clean.
   * This matches the structured type extension in your WPImageNode.
   */
  const photoCredit = img?.mediaDetails?.photoSource;

  // If there is no image source, we don't render the hero block to avoid layout shifts
  if (!img?.sourceUrl) return null;

  return (
    <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pb-8">
      <figure>
        {/* Aspect-ratio wrapper — ultrawide on desktop, 16/9 on mobile */}
        <div className="kn-hero-ratio">
          <SkeletonImage
            src={img.sourceUrl}
            alt={img.altText || article.title}
            className="kn-hero-ratio"
          />
        </div>

        {/* Caption + credit beneath the image */}
        {(img.caption || photoCredit) && (
          <figcaption className="kn-figcaption mt-3 px-1 flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2">
            {img.caption && (
              <div
                className="text-sm leading-snug"
                style={{ color: "var(--color-ink-soft)" }}
                dangerouslySetInnerHTML={{ __html: img.caption }}
              />
            )}
            
            {photoCredit && (
              <span className="kn-photo-credit whitespace-nowrap">
                {photoCredit}
              </span>
            )}
          </figcaption>
        )}
      </figure>
    </div>
  );
}