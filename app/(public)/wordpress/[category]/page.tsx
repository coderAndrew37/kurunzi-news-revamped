import NewsSection from "@/app/_components/wordpress/WPNewsSection";
import { getSportsPosts } from "@/lib/wordpress/wp-api";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;

  // Middleware safety check
  if (!categorySlug || categorySlug === "site" || categorySlug === "index") {
    redirect("/");
  }

  // 1. Fetch all posts
  const allPosts = await getSportsPosts();

  // 2. Filter posts by category slug
  // Note: We check against the slug version of the category
  const categoryPosts = allPosts.filter(
    (post) => post.category.toLowerCase() === categorySlug.toLowerCase(),
  );

  if (categoryPosts.length === 0) notFound();

  // 3. Partition data for the UI
  const categoryTitle = categoryPosts[0].category; // Get the pretty name from the first post
  const topPosts = categoryPosts.slice(0, 4);
  const morePosts = categoryPosts.slice(4, 10);

  return (
    <main className="pb-20 bg-[#fdfcfb]">
      {/* 1. Top Section - Hero Grid for the Category */}
      <div className="max-w-7xl mx-auto px-4 pt-12">
        <h1 className="kn-headline text-5xl mb-8 border-b-2 border-black pb-4 uppercase tracking-tighter">
          {categoryTitle}
        </h1>
      </div>

      <NewsSection
        title="Leading Stories"
        posts={topPosts}
        slug={categorySlug}
      />

      {/* 2. Middle Banner / "Deep Dive" */}
      <div className="max-w-7xl mx-auto px-4 my-12">
        <div className="bg-[#f7f4f0] p-10 rounded-sm flex flex-col md:flex-row justify-between items-center border-l-8 border-[#1a5c38] gap-6">
          <div className="max-w-2xl">
            <h2 className="font-['Playfair_Display'] text-3xl font-black text-[#0d0d0d] leading-none mb-3">
              The {categoryTitle} Archive
            </h2>
            <p className="font-['Source_Serif_4'] text-[#3d3935] italic">
              Comprehensive coverage and late-breaking updates from the world of{" "}
              {categoryTitle}.
            </p>
          </div>

          <Link
            href={`/archive?category=${categorySlug}`}
            className="kn-action-btn bg-[#0d0d0d] text-white px-8 py-4 border-none hover:bg-[#1a5c38] transition-all"
          >
            Browse Full Archive
          </Link>
        </div>
      </div>

      {/* 3. "More From" Section */}
      <NewsSection
        title={`Trending in ${categoryTitle}`}
        posts={morePosts}
        slug={categorySlug}
      />

      {/* 4. Footer CTA */}
      <div className="max-w-7xl mx-auto px-4 mt-20 flex flex-col items-center">
        <div className="h-px w-full bg-[#e8e2da] mb-12" />
        <Link
          href="/"
          className="kn-kicker no-underline border-b-2 border-black text-black hover:text-[#1a5c38] hover:border-[#1a5c38] text-sm"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
