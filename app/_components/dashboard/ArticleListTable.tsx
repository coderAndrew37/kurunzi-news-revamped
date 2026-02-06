"use client";

import { WriterDraft } from "@/types/editor";
import { formatDistanceToNow } from "date-fns";
import { Edit3 } from "lucide-react";
import Link from "next/link";

export default function ArticleListTable({
  articles,
}: {
  articles: WriterDraft[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-[10px] uppercase text-slate-400 font-bold border-b bg-slate-50/50">
            <th className="px-6 py-4">Article</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Last Updated</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {articles.map((article) => (
            <tr
              key={article.id}
              className="hover:bg-slate-50 transition-colors group"
            >
              <td className="px-6 py-4">
                <p className="font-bold text-sm line-clamp-1">
                  {article.title || "Untitled"}
                </p>
              </td>
              <td className="px-6 py-4">
                <span className="text-xs font-medium text-slate-500 uppercase">
                  {article.category}
                </span>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={article.status} />
              </td>
              <td className="px-6 py-4 text-xs text-slate-400">
                {formatDistanceToNow(
                  new Date(
                    article.updatedAt || article.createdAt || new Date(),
                  ),
                  {
                    addSuffix: true,
                  },
                )}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/dashboard/edit/${article.id}`}
                    className="p-2 hover:bg-white rounded-md border border-transparent hover:border-slate-200 text-slate-400 hover:text-pd-red transition-all"
                  >
                    <Edit3 size={16} />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: "bg-blue-50 text-blue-600 border-blue-100",
    pending_review: "bg-orange-50 text-orange-600 border-orange-100",
    approved: "bg-green-50 text-green-600 border-green-100",
    rejected: "bg-red-50 text-red-600 border-red-100",
  };
  return (
    <span
      className={`text-[10px] font-black uppercase px-2 py-1 rounded-md border ${styles[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
