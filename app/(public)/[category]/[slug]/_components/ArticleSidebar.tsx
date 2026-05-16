// app/(public)/wordpress/[category]/[slug]/_components/ArticleSidebar.tsx
import Link from "next/link";
import SkeletonImage from "@/app/_components/ui/SkeletonImage";
import { SportsPost } from "@/lib/wordpress/types";

interface Props {
  latestPosts: SportsPost[];
}

export default function ArticleSidebar({ latestPosts }: Props) {
  return (
    <aside>
      <div className="sticky top-16 flex flex-col gap-8">
        {/* ── Latest News ──────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-[#e8e2da]" />
            <h3 className="text-lg font-bold text-[#0d0d0d] tracking-tight">
              Latest News
            </h3>
            <div className="h-px flex-1 bg-[#e8e2da]" />
          </div>

          <div className="space-y-6">
            {latestPosts.slice(0, 5).map((post, index) => (
              <Link
                key={post.slug}
                href={`/${post.category?.toLowerCase().replace(/\s+/g, "-") || "news"}/${post.slug}`}
                className="group flex gap-4"
              >
                <div className="flex-1">
                  <span className="text-[#1a5c38] text-xs font-bold uppercase tracking-widest">
                    {post.category}
                  </span>
                  <h4 className="mt-1.5 font-bold leading-tight text-[15px] group-hover:text-red-600 transition-colors line-clamp-3">
                    {post.title}
                  </h4>
                </div>

                <div className="w-24 h-20 shrink-0 relative rounded-md overflow-hidden bg-gray-100 border border-gray-100">
                  <SkeletonImage
                    src={post.featuredImage}
                    alt={post.title}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Newsletter CTA ──────────────────────────────────────────────── */}
        <div
          className="p-6 rounded-[4px] mt-4"
          style={{ background: "var(--color-ink)" }}
        >
          <p className="kn-newsletter-tag">Stay ahead</p>
          <h3 className="kn-newsletter-heading">Daily briefing, no noise.</h3>
          <p className="kn-newsletter-body">
            Curated stories from Kenya and the world, every morning.
          </p>
          <Link href="/subscribe" className="kn-newsletter-btn">
            Subscribe free →
          </Link>
        </div>
      </div>
    </aside>
  );
}
