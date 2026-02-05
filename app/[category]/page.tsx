import { fetchCategoryLanding } from "@/lib/sanity/api";
import { mapPostToUi } from "@/lib/sanity/mapper";
import Link from "next/link";
import { notFound } from "next/navigation";
import NewsSection from "../_components/NewsSection";

// Next.js 15+ requires params to be treated as a Promise
export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ category: string }> 
}) {
  // 1. Await the params before using them
  const resolvedParams = await params;
  const slug = resolvedParams.category;

  // 2. Fetch data with the resolved slug
  const data = await fetchCategoryLanding(slug);

  // 3. Safety check
  if (!data || !data.category) notFound();

  // 4. Map the posts only if they exist
  const topPosts = data.topStories?.map(mapPostToUi) || [];
  const morePosts = data.moreStories?.map(mapPostToUi) || [];

  return (
    <main className="pb-20">
      {/* 1. Top Section (The 8 Headliners) */}
      <NewsSection title={data.category.title} posts={topPosts} />

      {/* 2. Middle Banner / Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 my-8">
        <div className="bg-slate-100 p-6 rounded-xl flex justify-between items-center border-l-8 border-pd-red">
          <div>
            <h2 className="text-xl font-black uppercase">More from {data.category.title}</h2>
            <p className="text-sm text-slate-500">{data.category.description}</p>
          </div>
        </div>
      </div>

      {/* 3. "More From" Section (Next 8 Stories) */}
      <NewsSection title={`Archived ${data.category.title}`} posts={morePosts} />

      {/* 4. The Deep Archive Link */}
      <div className="max-w-7xl mx-auto px-4 mt-12 flex justify-center">
        <Link 
          href={`/category/${slug}`}
          className="group flex items-center gap-3 bg-black text-white px-10 py-4 rounded-full font-black uppercase text-sm hover:bg-pd-red transition-all"
        >
          View All {data.category.title} Articles
          <span className="group-hover:translate-x-2 transition-transform">→</span>
        </Link>
      </div>
    </main>
  );
}