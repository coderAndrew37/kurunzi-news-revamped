"use client";

import { Globe, Zap, MessageSquare, X } from "lucide-react";
import { WriterDraft } from "@/types/editor";
import { toast } from "sonner";

interface Props {
  article: WriterDraft;
  updateField: (fields: Partial<WriterDraft>) => void;
  canEdit: boolean;
  onReset: () => void; // Added for the Start Fresh logic
  isNewArticle: boolean; // Only show reset on new drafts
}

export default function EditorHeader({
  article,
  updateField,
  canEdit,
  onReset,
  isNewArticle,
}: Props) {
  const handleStartFresh = () => {
    if (
      window.confirm(
        "Are you sure? This will wipe your local draft and start a blank story.",
      )
    ) {
      onReset();
      toast.success("Draft cleared");
    }
  };

  return (
    <div className="space-y-6 mb-10">
      {/* 1. START FRESH TRIGGER (Only for new drafts) */}
      {isNewArticle && canEdit && (
        <div className="flex justify-end">
          <button
            onClick={handleStartFresh}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors group"
          >
            <X
              size={14}
              className="group-hover:rotate-90 transition-transform"
            />
            Start Fresh Story
          </button>
        </div>
      )}

      {/* 2. EDITORIAL FEEDBACK PANEL */}
      {article.editorNotes && (
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-3xl flex gap-5 animate-in fade-in slide-in-from-top-4">
          <div className="bg-amber-500 p-3 h-fit rounded-2xl text-white shadow-lg shadow-amber-200">
            <MessageSquare size={20} />
          </div>
          <div>
            <h4 className="font-black uppercase text-[10px] tracking-widest text-amber-700 mb-1">
              Editor Feedback ({article.status})
            </h4>
            <p className="text-sm text-amber-900 leading-relaxed font-medium">
              {article.editorNotes}
            </p>
          </div>
        </div>
      )}

      {/* 3. MAIN TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-5 rounded-4xl border border-slate-100">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-slate-400" />
            <select
              aria-label="site context"
              disabled={!canEdit}
              value={article.siteContext}
              onChange={(e) => updateField({ siteContext: e.target.value })}
              className="bg-transparent font-black uppercase text-[10px] tracking-widest outline-none cursor-pointer disabled:opacity-50"
            >
              <option value="main">Main News</option>
              <option value="worldcup">World Cup 2027</option>
              <option value="elections">Elections 2027</option>
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          <button
            disabled={!canEdit}
            onClick={() => updateField({ isBreaking: !article.isBreaking })}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all border ${
              article.isBreaking
                ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-200"
                : "bg-white border-slate-200 text-slate-400 hover:border-red-300"
            } disabled:opacity-50`}
          >
            <Zap
              size={14}
              fill={article.isBreaking ? "currentColor" : "none"}
            />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Breaking News
            </span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* SLUG DISPLAY: Moved into the header for a cleaner UI */}
          <div className="hidden lg:flex items-center gap-2 text-slate-400 font-mono text-[10px] bg-white px-3 py-1.5 rounded-full border border-slate-100 max-w-[300px]">
            <span className="font-bold text-slate-300">URL:</span>
            <span className="truncate">/news/{article.slug || "..."}</span>
          </div>

          <div
            className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
              article.status === "rejected"
                ? "bg-red-100 text-red-600"
                : "bg-slate-200 text-slate-500"
            }`}
          >
            {article.status.replace("_", " ")} Mode
          </div>
        </div>
      </div>
    </div>
  );
}
