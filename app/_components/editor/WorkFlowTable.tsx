"use client";

import { WorkflowItem } from "@/types/editor";
import { formatDistanceToNow } from "date-fns";
import {
  Edit3,
  Eye,
  MoreHorizontal,
  Trash2,
  Undo2,
  Zap,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
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
    icon: any;
  }
> = {
  draft: {
    label: "Draft",
    variant: "secondary",
    className: "bg-slate-100 text-slate-600 border-slate-200",
    icon: Edit3,
  },
  pending_review: {
    label: "Pending",
    variant: "outline",
    className: "bg-amber-50 text-amber-700 border-amber-200 animate-pulse",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    variant: "default",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    variant: "destructive",
    className: "bg-red-50 text-red-700 border-red-200",
    icon: AlertCircle,
  },
};

export default function WorkflowTable({
  articles,
}: {
  articles: any[]; // Supports both WorkflowItem and WriterDraft
}) {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="hover:bg-transparent border-slate-100">
            <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Article Details
            </TableHead>
            <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Status
            </TableHead>
            <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Last Updated
            </TableHead>
            <TableHead className="px-6 py-4 text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-32 text-center text-slate-400 text-xs font-medium"
              >
                No articles found.
              </TableCell>
            </TableRow>
          ) : (
            articles.map((article) => {
              const status = statusConfig[article.status] || statusConfig.draft;
              const StatusIcon = status.icon;

              return (
                <React.Fragment key={article.id}>
                  <TableRow className="group hover:bg-slate-50/50 transition-colors border-slate-50">
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
                      <div className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter mt-0.5 flex gap-2">
                        <span>{article.category || "Uncategorized"}</span>
                        <span className="text-slate-200">•</span>
                        <span>
                          {article.site_context ||
                            article.siteContext ||
                            "Main"}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-5">
                      <Badge
                        variant={status.variant}
                        className={`font-black uppercase text-[9px] px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit shadow-none border ${status.className}`}
                      >
                        <StatusIcon size={10} />
                        {status.label}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-6 py-5 text-xs text-slate-400 font-medium">
                      {formatDistanceToNow(
                        new Date(
                          article.updated_at || article.updatedAt || new Date(),
                        ),
                        {
                          addSuffix: true,
                        },
                      )}
                    </TableCell>

                    <TableCell className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="h-8 w-8 text-slate-400 hover:text-pd-red hover:bg-red-50"
                        >
                          <Link href={`/writer/dashboard/edit/${article.id}`}>
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
                            className="w-48 rounded-xl shadow-xl border-slate-100 p-2"
                          >
                            <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-400 px-2 py-1.5">
                              Options
                            </DropdownMenuLabel>
                            <DropdownMenuItem asChild className="rounded-lg">
                              <Link
                                href={`/article/${article.id}`}
                                className="cursor-pointer flex items-center"
                              >
                                <Eye className="mr-2 h-4 w-4" /> Preview
                              </Link>
                            </DropdownMenuItem>

                            {article.status === "pending_review" && (
                              <DropdownMenuItem className="text-amber-600 focus:text-amber-700 rounded-lg">
                                <Undo2 className="mr-2 h-4 w-4" /> Withdraw
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator className="my-1" />

                            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 rounded-lg cursor-pointer">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete Draft
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* FEEDBACK SECTION: Only shows for Rejected articles with notes */}
                  {article.status === "rejected" &&
                    (article.editor_notes || article.editorNotes) && (
                      <TableRow className="bg-red-50/30 border-none hover:bg-red-50/30">
                        <TableCell colSpan={4} className="px-6 py-0 pb-5">
                          <div className="flex gap-3 bg-white border border-red-100 p-4 rounded-2xl shadow-sm">
                            <div className="mt-1">
                              <MessageSquare
                                size={16}
                                className="text-red-500"
                              />
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-black uppercase tracking-widest text-red-600">
                                Revision Required
                              </p>
                              <p className="text-sm text-slate-700 leading-relaxed italic font-medium">
                                "{article.editor_notes || article.editorNotes}"
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                </React.Fragment>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// Ensure you import React to use React.Fragment
import React from "react";
