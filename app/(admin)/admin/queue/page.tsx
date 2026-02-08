import { createClient } from "@/lib/utils/supabase/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Assuming shadcn/ui or similar
import { FileEdit, Eye, Clock } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default async function EditorialQueuePage() {
  const supabase = await createClient();

  // Fetch articles waiting for review
  const { data: articles, error } = await supabase
    .from("article_workflow")
    .select(
      `
      id,
      title,
      category,
      status,
      created_at,
      profiles (
        full_name
      )
    `,
    )
    .eq("status", "draft")
    .order("created_at", { ascending: false });

  if (error)
    return (
      <div className="p-10 text-red-500">
        Error loading queue: {error.message}
      </div>
    );

  return (
    <div className="space-y-8 p-8">
      <header>
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
          Editorial Queue
        </h1>
        <p className="text-slate-500 font-medium">
          Stories awaiting your final approval before going live.
        </p>
      </header>

      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Article Details
              </th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Author
              </th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Submitted
              </th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {articles?.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-20 text-center text-slate-400 font-medium"
                >
                  <Clock className="mx-auto mb-2 opacity-20" size={40} />
                  The queue is empty. Grab a coffee!
                </td>
              </tr>
            ) : (
              articles?.map((article) => (
                <tr
                  key={article.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-pd-red uppercase tracking-wider mb-1">
                        {article.category}
                      </span>
                      <span className="font-bold text-slate-900 group-hover:text-pd-red transition-colors">
                        {article.title}
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                        {article.profiles?.full_name?.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-slate-600">
                        {article.profiles?.full_name}
                      </span>
                    </div>
                  </td>
                  <td className="p-6 text-sm text-slate-400">
                    {formatDistanceToNow(new Date(article.created_at), {
                      addSuffix: true,
                    })}
                  </td>
                  <td className="p-6 text-right">
                    <Link
                      href={`/admin/queue/${article.id}`}
                      className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-pd-red transition-all active:scale-95"
                    >
                      <FileEdit size={14} />
                      Review
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
