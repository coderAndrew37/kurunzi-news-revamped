// app/(public)/wordpress/[category]/[slug]/_components/ArticleAuthorBio.tsx
import Link from "next/link";
import SkeletonImage from "@/app/_components/ui/SkeletonImage";
import { WPPostNode } from "@/lib/wordpress/types";

interface Props {
  article: WPPostNode;
}

export default function ArticleAuthorBio({ article }: Props) {
  const authorNode = article.author?.node;
  if (!authorNode) return null;

  return (
    <footer className="px-4 sm:px-6 py-14 border-t-2 border-[var(--ink)] bg-[var(--paper-warm)]">
      <div className="max-w-[720px] mx-auto flex gap-6 items-start">
        <div
          className="relative shrink-0 w-[72px] h-[72px] rounded-full overflow-hidden border-[3px] border-white shadow-md"
        >
          <SkeletonImage
            src={authorNode.avatar?.url ?? null}
            alt={authorNode.name}
            className="rounded-full"
          />
        </div>

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