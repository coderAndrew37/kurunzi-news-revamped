import { createClient } from "@/lib/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, FileText, LayoutDashboard } from "lucide-react";

import { Button } from "@/components/ui/button";
import DashboardStats from "@/app/_components/editor/DashboardStats";
import WorkflowTable from "@/app/_components/editor/WorkFlowTable";
import { WorkflowItem } from "@/types/editor";

export const metadata = {
  title: "My Articles | Kurunzi News",
  description: "Manage your editorial workflow and submissions.",
};

export default async function ArticlesPage() {
  const supabase = await createClient();

  // 1. Session Check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Data Fetching
  const { data: articles, error } = (await supabase
    .from("article_workflow")
    .select(
      `
      id,
      title,
      status,
      category,
      updated_at,
      site_context,
      is_breaking
    `,
    )
    .eq("writer_id", user.id)
    .order("updated_at", { ascending: false })) as {
    data: WorkflowItem[] | null;
    error: Error | null;
  };
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 text-center">
        <p className="text-red-500 font-bold">Failed to load articles.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-10 px-6 space-y-10">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <LayoutDashboard size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Writer Portal
            </span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900">
            My <span className="text-pd-red">Articles</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-md">
            Manage your drafts, track editorial reviews, and monitor published
            content.
          </p>
        </div>

        <Button
          asChild
          size="lg"
          className="rounded-full px-8 bg-pd-red hover:bg-red-700 shadow-xl shadow-red-100 transition-all hover:-translate-y-1"
        >
          <Link
            href="/writer/dashboard/new"
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            <span className="font-bold uppercase text-[11px] tracking-widest">
              Create New Story
            </span>
          </Link>
        </Button>
      </header>

      {/* Statistics Overview */}
      <DashboardStats articles={articles || []} />

      {/* Main Content Area */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest">
            <FileText size={14} />
            Recent Submissions
          </div>
        </div>

        {articles && articles.length > 0 ? (
          <WorkflowTable articles={articles} />
        ) : (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] py-20 flex flex-col items-center justify-center text-center">
            <div className="bg-white p-6 rounded-full shadow-sm mb-4">
              <FileText size={40} className="text-slate-200" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              No stories found
            </h3>
            <p className="text-slate-500 text-sm max-w-xs mt-2">
              You haven't created any articles yet. Start your first draft to
              see it in your workflow.
            </p>
            <Button asChild variant="outline" className="mt-6 rounded-full">
              <Link href="/writer/new">Create Draft</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
