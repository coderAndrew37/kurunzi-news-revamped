"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

interface CategoryNode {
  name: string;
  slug: string;
}

interface Props {
  primaryCategory?: CategoryNode;
}

export default function ArticleBreadcrumb({ primaryCategory }: Props) {
  const router = useRouter();

  return (
    <nav
      className="sticky top-0 z-40 border-b"
      style={{
        background: "var(--color-paper)",
        borderColor: "var(--color-rule)",
      }}
    >
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 h-12 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 cursor-pointer bg-transparent border-none p-0 font-[family-name:var(--font-ui)] text-[11px] font-semibold tracking-[.06em] uppercase text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
        >
          <ChevronLeft size={15} />
          Back
        </button>

        {primaryCategory && (
          <>
            <div
              className="w-px h-3.5"
              style={{ background: "var(--color-rule)" }}
            />
            <Link
              href={`/${primaryCategory.slug}`}
              className="kn-kicker mb-0 pb-0 border-b-0"
            >
              {primaryCategory.name}
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}