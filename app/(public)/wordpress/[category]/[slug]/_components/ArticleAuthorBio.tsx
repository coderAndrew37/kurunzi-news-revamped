import Link from "next/link";
import SkeletonImage from "@/app/_components/ui/SkeletonImage";
import { ArticleDetail } from "@/lib/wordpress/types";

interface Props {
  article: ArticleDetail;
}

export default function ArticleAuthorBio({ article }: Props) {
  const authorNode = article.author?.node;
  if (!authorNode) return null;

  return (
    <footer
      className="px-4 sm:px-6 py-14"
      style={{
        borderTop: "2px solid var(--color-ink)",
        background: "var(--color-paper-warm)",
      }}
    >
      <div className="max-w-[720px] mx-auto flex gap-6 items-start">
        {/* Avatar */}
        <div
          className="relative shrink-0 w-[72px] h-[72px] rounded-full overflow-hidden"
          style={{
            border: "3px solid white",
            boxShadow: "0 2px 8px rgba(0,0,0,.1)",
          }}
        >
          <SkeletonImage
            src={authorNode.avatar?.url}
            alt={authorNode.name}
            className="rounded-full"
          />
        </div>

        {/* Bio text */}
        <div>
          <Link href={`/author/${authorNode.slug}`} className="kn-bio-name">
            {authorNode.name}
          </Link>
          {authorNode.description && (
            <p className="kn-bio-text">{authorNode.description}</p>
          )}
          <Link href={`/author/${authorNode.slug}`} className="kn-bio-link">
            More by {authorNode.name} →
          </Link>
        </div>
      </div>
    </footer>
  );
}