// app/[category]/page.tsx
// Category landing page — uses updated NewsSection with viewAllHref prop.
// "View All" on the first section → /[slug]/archive (full paginated list)
// "More stories" button inside NewsSection → also /[slug]/archive

import { getSportsPosts } from "@/lib/wordpress/data";
import NewsSection from "@/app/_components/wordpress/WPNewsSection";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{ category: string }>;
}

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

  return (
    <main className="min-h-screen pb-20" style={{ background: "var(--paper)" }}>

      {/* Category title header */}
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

      {/* NewsSection with archive links */}
      <NewsSection
        title={categoryTitle}
        slug={categorySlug}
        posts={categoryPosts}
        // On the category page, both buttons point to the paginated archive
        viewAllHref={`/${categorySlug}/archive`}
        viewAllLabel="Full archive"
      />

      {/* Back home */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 mt-16 flex flex-col items-center">
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