// app/[category]/page.tsx

import { getSportsPosts } from "@/lib/wordpress/data";
import NewsSection from "@/app/_components/wordpress/WPNewsSection";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import AdPlaceholder from "@/app/_components/wordpress/AdPlaceholder";

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const allPosts = await getSportsPosts();

  const categoryPosts = allPosts.filter(
    (p) => p.category.toLowerCase() === categorySlug.toLowerCase(),
  );

  if (!categoryPosts.length) return { title: categorySlug };

  return {
    title: categoryPosts[0].title,
    description: categoryPosts[0].newsData?.theLede || categoryPosts[0].excerpt || undefined,
  };
}

const FIRST_SECTION_SIZE = 8;


export default async function CategoryPage({ params }: PageProps) {
  const { category: categorySlug } = await params;

  if (!categorySlug || categorySlug === "site" || categorySlug === "index") {
    redirect("/");
  }

  const allPosts = await getSportsPosts();

  const categoryPosts = allPosts.filter(
    (p) => p.category.toLowerCase() === categorySlug.toLowerCase(),
  );

  if (categoryPosts.length === 0) notFound();

  const categoryTitle = categoryPosts[0].category;

  const primaryPosts = categoryPosts.slice(0, FIRST_SECTION_SIZE);
  const morePosts    = categoryPosts.slice(FIRST_SECTION_SIZE);
  const hasMoreSection = morePosts.length >= 2;

  return (
    <main className="min-h-screen pb-20" style={{ background: "var(--paper)" }}>

      {/* ── Category header ─────────────────────────────────────────────── */}
      <div
        className="border-b"
        style={{ borderColor: "var(--rule)", background: "var(--paper-warm)" }}
      >
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-baseline gap-3">
            <span
              className="text-2xl font-black"
              style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}
            >
              »
            </span>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                color: "var(--ink)",
              }}
            >
              {categoryTitle}
            </h1>
          </div>
        </div>
      </div>

      {/* ── Primary section (posts 1–8) ─────────────────────────────────── */}
      <NewsSection
        title={categoryTitle}
        slug={categorySlug}
        posts={primaryPosts}
        viewAllHref={`/${categorySlug}/archive`}
        viewAllLabel="Full archive"
      />

      {/* ── Ad slot 1 — between sections ────────────────────────────────── */}
      <AdPlaceholder label="728 × 90 — Leaderboard Ad" />

      {/* ── "More on …" section (posts 9+) ──────────────────────────────── */}
      {hasMoreSection && (
        <NewsSection
          title={`More on ${categoryTitle}`}
          slug={categorySlug}
          posts={morePosts}
          viewAllHref={`/${categorySlug}/archive`}
          viewAllLabel="Full archive"
        />
      )}

      {/* ── Ad slot 2 — above footer ────────────────────────────────────── */}
      <AdPlaceholder label="728 × 90 — Pre-footer Ad" />

      {/* ── Back home ───────────────────────────────────────────────────── */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 mt-10 flex flex-col items-center">
        <div className="h-px w-full mb-10" style={{ background: "var(--rule)" }} />
        <Link
          href="/"
          className="text-[10px] font-bold uppercase tracking-[0.18em] transition-colors hover:text-[var(--accent)]"
          style={{ color: "var(--ink-faint)", fontFamily: "var(--font-ui)" }}
        >
          ← Back to all sports
        </Link>
      </div>

    </main>
  );
}