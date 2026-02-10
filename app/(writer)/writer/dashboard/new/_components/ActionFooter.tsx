"use client";

import { Loader2, Save, Send, Lock } from "lucide-react";
import { WriterDraft } from "@/types/editor";

interface Props {
  article: WriterDraft;
  onAction: (status: WriterDraft["status"]) => void;
  loadingStates: {
    isSaving: boolean;
    isSubmitting: boolean;
    isUploading: boolean;
  };
  canEdit: boolean;
}

export default function ActionFooter({
  article,
  onAction,
  loadingStates,
  canEdit,
}: Props) {
  const { isSaving, isSubmitting, isUploading } = loadingStates;
  const isAnyLoading = isSaving || isSubmitting || isUploading;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-8 bg-white/80 backdrop-blur-2xl border-t border-slate-100 flex justify-between items-center z-50">
      <div className="hidden md:flex items-center gap-3">
        <div
          className={`w-2.5 h-2.5 rounded-full ${
            !canEdit
              ? "bg-slate-300"
              : isAnyLoading
                ? "bg-amber-500 animate-pulse"
                : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
          }`}
        />
        <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
          {!canEdit
            ? `LOCKED: ${article.status.toUpperCase()}`
            : isAnyLoading
              ? "Cloud Sync in Progress"
              : "Editorial Workspace Safe"}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {!canEdit ? (
          <div className="flex items-center gap-3 px-8 py-5 rounded-full bg-slate-100 text-slate-400 border border-slate-200 font-black text-xs uppercase tracking-[0.2em]">
            <Lock size={16} /> Read Only Mode
          </div>
        ) : (
          <>
            <button
              onClick={() => onAction("draft")}
              disabled={isAnyLoading}
              className="group bg-white border border-slate-200 text-slate-900 px-8 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-3"
            >
              {isSaving ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              <span>Save Draft</span>
            </button>

            <button
              onClick={() => onAction("pending_review")}
              disabled={isAnyLoading}
              className="group relative bg-red-600 disabled:bg-slate-300 text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-red-500/40 hover:bg-red-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3 overflow-hidden"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Send size={18} />
              )}
              <span>Submit for Review</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
