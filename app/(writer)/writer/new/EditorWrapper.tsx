"use client";

import { useState } from "react";
import { WriterDraft } from "@/types/editor";
import { Save, Send, Image as ImageIcon, Clock, FileText } from "lucide-react";
import NewsEditor from "@/app/_components/editor/ArticleEditor";
import { JSONContent } from "@tiptap/react";

export default function EditorWrapper() {
  const [draft, setDraft] = useState<WriterDraft>({
    title: "",
    excerpt: "",
    category: "",
    featuredImage: null,
    // Fix: Valid initial Tiptap JSON structure
    content: { type: "doc", content: [] },
    status: "draft",
    tags: [],
  });

  // Derived state for analytics
  const wordCount = (draft.content.content || []).reduce(
    (acc, node) => acc + (node.content?.[0]?.text?.split(/\s+/).length || 0),
    0,
  );
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Action Bar */}
      <div className="flex justify-between items-center mb-8 sticky top-20 z-40 bg-white/80 backdrop-blur-md py-4 border-b">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Draft Mode
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-slate-500">
            <div className="flex items-center gap-1">
              <FileText size={14} />
              <span className="text-xs font-bold">{wordCount} Words</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span className="text-xs font-bold">{readingTime} Min Read</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 border-2 border-black font-bold uppercase text-xs hover:bg-slate-50 transition-all">
            <Save size={16} /> Save Draft
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-pd-red text-white font-bold uppercase text-xs hover:bg-black transition-all">
            <Send size={16} /> Submit to Editor
          </button>
        </div>
      </div>

      {/* Meta Fields */}
      <div className="space-y-6 mb-10">
        <input
          type="text"
          placeholder="Enter a gripping headline..."
          className="w-full text-4xl md:text-5xl font-black italic outline-none border-none placeholder:text-slate-200"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />

        <div className="flex flex-wrap gap-4 items-center py-4 border-y border-slate-100">
          <select
            aria-label="category selector"
            className="bg-slate-50 px-4 py-2 rounded-lg font-bold text-xs uppercase outline-none"
            value={draft.category}
            onChange={(e) => setDraft({ ...draft, category: e.target.value })}
          >
            <option value="">Select Category</option>
            <option value="politics">Politics</option>
            <option value="business">Business</option>
          </select>

          <div className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-pd-red transition-colors">
            <ImageIcon size={18} />
            <span className="text-xs font-bold uppercase">
              Add Featured Image
            </span>
          </div>
        </div>
      </div>

      {/* Tiptap Core - Removed any */}
      <NewsEditor
        initialContent={draft.content}
        onUpdate={(json: JSONContent) => setDraft({ ...draft, content: json })}
      />
    </div>
  );
}
