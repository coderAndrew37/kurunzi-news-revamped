import { Badge } from "@/components/ui/badge"; // Shadcn Badge
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/utils/supabase/server";
import { ArticleWorkflowRow } from "@/types/database";
import { formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  CheckCircle2,
  FileEdit,
  Inbox,
  XCircle,
} from "lucide-react";
import Link from "next/link";

export default async function EditorialQueuePage() {
  const supabase = await createClient();

  // Fetch all workflow articles that aren't drafts
  const { data: allArticles, error } = await supabase
    .from("article_workflow")
    .select(
      `
      *,
      profiles (
        full_name,
        sanity_author_id
      )
    `,
    )
    .neq("status", "draft") // We don't want to see "Work in Progress"
    .order("created_at", { ascending: false });

  if (error)
    return (
      <div className="p-10 flex items-center gap-3 text-red-600 bg-red-50 rounded-2xl border border-red-100">
        <AlertCircle size={20} />
        <span className="font-bold">Queue System Error: {error.message}</span>
      </div>
    );

  // Strictly typed filtering using ArticleWorkflowRow
  const queue = (allArticles as unknown as ArticleWorkflowRow[]) || [];

  const pending = queue.filter((a) => a.status === "pending_review");
  const approved = queue.filter((a) => a.status === "approved");
  const rejected = queue.filter((a) => a.status === "rejected");

  return (
    <div className="max-w-7xl mx-auto space-y-12 p-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">
          Newsroom <span className="text-red-600">Queue</span>
        </h1>
        <p className="text-slate-500 font-serif italic text-xl">
          Managing the flow from draft to global publication.
        </p>
      </header>

      {/* PRIMARY SECTION: PENDING REVIEW */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
            <Inbox size={24} />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight">
            Awaiting Approval
          </h2>
          <Badge
            variant="outline"
            className="ml-auto bg-amber-50 text-amber-700 border-amber-200"
          >
            {pending.length} Stories
          </Badge>
        </div>
        <ArticleTable articles={pending} showActions={true} />
      </section>

      {/* SECONDARY SECTION: REJECTED (Only if exists) */}
      {rejected.length > 0 && (
        <section className="space-y-6 opacity-80">
          <Separator className="my-10" />
          <div className="flex items-center gap-4">
            <div className="bg-red-100 p-2 rounded-lg text-red-600">
              <XCircle size={24} />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-500">
              Recently Rejected
            </h2>
          </div>
          <ArticleTable articles={rejected} showActions={true} />
        </section>
      )}

      {/* TERTIARY SECTION: APPROVED (Only if exists) */}
      {approved.length > 0 && (
        <section className="space-y-6">
          <Separator className="my-10" />
          <div className="flex items-center gap-4">
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
              <CheckCircle2 size={24} />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-500">
              Live & Synchronized
            </h2>
          </div>
          <ArticleTable articles={approved} showActions={false} />
        </section>
      )}
    </div>
  );
}

// Sub-component for the table to keep logic clean
function ArticleTable({
  articles,
  showActions,
}: {
  articles: ArticleWorkflowRow[];
  showActions: boolean;
}) {
  return (
    <div className="bg-white rounded-4xl border border-slate-200 overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Story
            </th>
            <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Writer
            </th>
            <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Timeline
            </th>
            {showActions && (
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">
                Review
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {articles.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="p-20 text-center text-slate-400 font-medium italic"
              >
                No articles in this status.
              </td>
            </tr>
          ) : (
            articles.map((article) => (
              <tr
                key={article.id}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                <td className="p-6">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">
                        {article.category}
                      </span>
                      {article.is_breaking && (
                        <Badge className="bg-red-600 hover:bg-red-600 h-4 px-1.5 text-[8px] uppercase">
                          Breaking
                        </Badge>
                      )}
                    </div>
                    <span className="font-bold text-slate-900 text-lg leading-tight group-hover:text-red-600 transition-colors">
                      {article.title}
                    </span>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600">
                      {article.profiles.full_name.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-slate-700">
                      {article.profiles.full_name}
                    </span>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-medium">
                      {formatDistanceToNow(new Date(article.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                    <span className="text-[9px] text-slate-300 uppercase font-black">
                      Submitted
                    </span>
                  </div>
                </td>
                {showActions && (
                  <td className="p-6 text-right">
                    <Link
                      href={`/admin/queue/${article.id}`}
                      className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] hover:bg-red-600 transition-all active:scale-95 shadow-md"
                    >
                      <FileEdit size={12} />
                      Analyze
                    </Link>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
