import { createClient } from "@/lib/utils/supabase/server";
import ArticleListTable from "@/app/_components/dashboard/ArticleListTable";
import StatCard from "@/app/_components/dashboard/StatCard";
import { WriterDraft } from "@/types/editor";

export default async function WriterDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // 1. Fetch all articles for this writer to calculate stats and show the table
  const { data: articles } = await supabase
    .from("article_workflow")
    .select("*")
    .eq("writer_id", user.id)
    .order("updated_at", { ascending: false });

  // Map Supabase snake_case to our CamelCase WriterDraft interface
  const formattedArticles: WriterDraft[] = (articles || []).map((a) => ({
    id: a.id,
    title: a.title,
    excerpt: a.excerpt,
    category: a.category,
    featuredImage: a.featured_image_url,
    content: a.content,
    status: a.status,
    tags: a.tags || [],
    updatedAt: a.updated_at,
    createdAt: a.created_at,
  }));

  const getCount = (status: string) =>
    formattedArticles.filter((a) => a.status === status).length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Drafts" value={getCount("draft")} color="blue" />
        <StatCard
          title="In Review"
          value={getCount("pending_review")}
          color="orange"
        />
        <StatCard
          title="Published"
          value={getCount("approved")}
          color="green"
        />
        <StatCard title="Rejected" value={getCount("rejected")} color="red" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="font-black uppercase tracking-tight text-slate-400 text-xs">
            Recent Articles
          </h2>
          <a
            href="/dashboard/articles"
            className="text-xs font-bold text-pd-red hover:underline"
          >
            View All
          </a>
        </div>
        {/* Pass the sliced array to limit it to 5 items */}
        <ArticleListTable articles={formattedArticles.slice(0, 5)} />
      </div>
    </div>
  );
}
