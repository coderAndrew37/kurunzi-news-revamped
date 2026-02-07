// app/writer/dashboard/_components/WorkflowTable.tsx
"use client";

import { WorkflowItem } from "@/types/editor";
import { formatDistanceToNow } from "date-fns";
import { Edit3, Eye, MoreHorizontal, Trash2, Undo2, Zap } from "lucide-react";
import Link from "next/link";

// shadcn components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusConfig: Record<
  string,
  {
    label: string;
    variant: "outline" | "secondary" | "destructive" | "default";
    className: string;
  }
> = {
  draft: {
    label: "Draft",
    variant: "secondary",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
  pending_review: {
    label: "Pending",
    variant: "outline",
    className: "bg-amber-50 text-amber-700 border-amber-200 animate-pulse",
  },
  approved: {
    label: "Approved",
    variant: "default",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  rejected: {
    label: "Rejected",
    variant: "destructive",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

export default function WorkflowTable({
  articles,
}: {
  articles: WorkflowItem[];
}) {
  return (
    <div className="bg-white rounded-4xl border border-slate-100 overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Headline
            </TableHead>
            <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Status
            </TableHead>
            <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Context
            </TableHead>
            <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Last Sync
            </TableHead>
            <TableHead className="px-6 py-4 text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article) => {
            const status = statusConfig[article.status] || statusConfig.draft;

            return (
              <TableRow
                key={article.id}
                className="group hover:bg-slate-50/50 transition-colors border-slate-50"
              >
                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    {article.is_breaking && (
                      <Zap
                        size={14}
                        className="text-red-500 fill-red-500 shrink-0"
                      />
                    )}
                    <span className="font-bold text-slate-900 line-clamp-1">
                      {article.title || "Untitled Draft"}
                    </span>
                  </div>
                  <div className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter mt-0.5">
                    {article.category}
                  </div>
                </TableCell>

                <TableCell className="px-6 py-5">
                  <Badge
                    variant={status.variant}
                    className={`font-black uppercase text-[9px] px-2.5 py-0.5 rounded-full ${status.className}`}
                  >
                    {status.label}
                  </Badge>
                </TableCell>

                <TableCell className="px-6 py-5 font-bold text-slate-500 text-xs">
                  {article.site_context}
                </TableCell>

                <TableCell className="px-6 py-5 text-xs text-slate-400 font-medium">
                  {formatDistanceToNow(new Date(article.updated_at), {
                    addSuffix: true,
                  })}
                </TableCell>

                <TableCell className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="h-8 w-8 text-slate-400 hover:text-red-600"
                    >
                      <Link href={`/writer/edit/${article.id}`}>
                        <Edit3 size={15} />
                      </Link>
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400"
                        >
                          <MoreHorizontal size={15} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 rounded-xl shadow-xl border-slate-100"
                      >
                        <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-400">
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/article/${article.id}`}
                            className="cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" /> Preview
                          </Link>
                        </DropdownMenuItem>
                        {article.status === "pending_review" && (
                          <DropdownMenuItem className="text-amber-600 focus:text-amber-700">
                            <Undo2 className="mr-2 h-4 w-4" /> Withdraw
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Draft
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
