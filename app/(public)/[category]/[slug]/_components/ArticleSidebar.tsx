// app/(public)/wordpress/[category]/[slug]/_components/ArticleSidebar.tsx
// Sticky sidebar: Latest News list + Newsletter CTA.
// Red accent only — no green.

import Link from "next/link";
import SkeletonImage from "@/app/_components/ui/SkeletonImage";
import { SportsPost } from "@/lib/wordpress/types";

interface Props {
  latestPosts: SportsPost[];
}

export default function ArticleSidebar({ latestPosts }: Props) {
  return (
    <aside>
      <div className="sticky top-20 flex flex-col gap-8">

        {/* ── Latest News ─────────────────────────────────────────────── */}
        <div className="border border-gray-100 rounded-sm overflow-hidden">

          {/* Header */}
          <div className="px-5 py-3.5 border-b-2 border-red-600 bg-white">
            <h3
              className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.1em]"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              Latest News
            </h3>
          </div>

          {/* Items */}
          <ul className="divide-y divide-gray-100 bg-white">
            {latestPosts.slice(0, 5).map((post, index) => {
              const catSlug =
                post.category?.toLowerCase().replace(/\s+/g, "-") || "news";
              return (
                <li key={post.slug}>
                  <Link
                    href={`/${catSlug}/${post.slug}`}
                    className="group flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors no-underline"
                  >
                    {/* Index number */}
                    <span
                      className="shrink-0 mt-0.5 text-[1.15rem] font-bold leading-none text-gray-200 group-hover:text-red-600 transition-colors min-w-[22px]"
                      style={{ fontFamily: "var(--font-ui)" }}
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>

                    <div className="flex-1 min-w-0">
                      <span
                        className="block mb-1 text-[9px] font-bold uppercase tracking-[0.16em] text-red-600"
                        style={{ fontFamily: "var(--font-ui)" }}
                      >
                        {post.category}
                      </span>
                      <h4
                        className="font-bold leading-snug text-[13px] text-gray-900 group-hover:text-red-600 transition-colors line-clamp-3"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {post.title}
                      </h4>
                    </div>

                    {/* Thumbnail */}
                    <div className="shrink-0 w-[72px] h-14 relative rounded overflow-hidden bg-gray-100">
                      <SkeletonImage
                        src={post.featuredImage}
                        alt={post.title}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── Newsletter CTA ───────────────────────────────────────────── */}
        <div className="rounded-sm p-6 bg-gray-900">
          <p
            className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-red-500"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            Stay ahead
          </p>
          <h3
            className="mb-2 text-[1.15rem] font-bold leading-snug text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Daily briefing, no noise.
          </h3>
          <p
            className="mb-4 text-[13px] leading-relaxed text-white/60"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Curated stories from Kenya and the world, every morning.
          </p>
          <Link
            href="/subscribe"
            className="block text-center px-5 py-2.5 rounded-sm bg-red-600 text-white text-[12px] font-bold uppercase tracking-[0.1em] hover:bg-red-700 transition-colors no-underline"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            Subscribe free →
          </Link>
        </div>

      </div>
    </aside>
  );
}