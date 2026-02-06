import { fetchCategoryLanding } from "@/lib/sanity/api";
import { mapPostToUi } from "@/lib/sanity/mapper";
import Link from "next/link";
import { notFound } from "next/navigation";
import NewsSection from "../_components/NewsSection";
import ArticleLink from "../_components/ArticleLink";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.category;

  const data = await fetchCategoryLanding(slug);

  if (!data || !data.category) notFound();

  // Mapped on the server where process.env.SANITY_PROJECT_ID is accessible
  const topPosts = data.topStories?.map(mapPostToUi) || [];
  const morePosts = data.moreStories?.map(mapPostToUi) || [];

  return (
    <main className="pb-20">
      {/* 1. Top Section (Uses updated NewsSection which uses SanityImage) */}
      <NewsSection title={data.category.title} posts={topPosts} />

      {/* 2. Middle Banner */}
      <div className="max-w-7xl mx-auto px-4 my-8">
        <div className="bg-slate-100 p-8 rounded-2xl flex flex-col md:flex-row justify-between items-center border-l-[12px] border-pd-red gap-4">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-black uppercase text-slate-900 leading-none mb-2">
              Deep Dive: {data.category.title}
            </h2>
            {data.category.description && (
              <p className="text-slate-600 font-medium line-clamp-2">
                {data.category.description}
              </p>
            )}
          </div>

          <Link
            href={`/category/${slug}`}
            className="whitespace-nowrap bg-pd-red text-white px-6 py-3 rounded-lg font-bold uppercase text-xs tracking-widest hover:bg-black transition-colors"
          >
            Browse Archive
          </Link>
        </div>
      </div>

      {/* 3. "More From" Section */}
      {/* This component internally handles the SanityImage logic for each post */}
      <NewsSection
        title={`Trending in ${data.category.title}`}
        posts={morePosts}
      />

      {/* 4. The Deep Archive CTA */}
      <div className="max-w-7xl mx-auto px-4 mt-16 flex flex-col items-center">
        <div className="h-px w-full bg-slate-100 mb-12" />
        <Link
          href={`/category/${slug}/`}
          className="group flex items-center gap-4 bg-black text-white px-12 py-5 rounded-full font-black uppercase text-sm hover:bg-pd-red transition-all hover:scale-105 active:scale-95 shadow-xl"
        >
          Explore Full {data.category.title} Archive
          <span className="group-hover:translate-x-2 transition-transform text-xl">
            →
          </span>
        </Link>
      </div>
    </main>
  );
}
