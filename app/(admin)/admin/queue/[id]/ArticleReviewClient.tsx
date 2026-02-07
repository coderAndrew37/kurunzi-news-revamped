"use client";

import NewsEditor from "@/app/_components/editor/ArticleEditor";
import { approveAndPublishAction } from "@/lib/actions/publish";
import { ArticleWorkflowRow } from "@/types/database";
import { TiptapNode } from "@/types/editor";
import { JSONContent } from "@tiptap/react";
import { Loader2, Search, Send, ShieldCheck } from "lucide-react";
import { useState } from "react";

interface ArticleReviewClientProps {
  initialArticle: ArticleWorkflowRow;
}

export default function ArticleReviewClient({
  initialArticle,
}: ArticleReviewClientProps) {
  const [article, setArticle] = useState<ArticleWorkflowRow>(initialArticle);
  const [publishing, setPublishing] = useState(false);
  const [overrides, setOverrides] = useState({
    metaTitle: initialArticle.title,
    isBreaking: false,
  });

  const handlePublish = async () => {
    if (
      !confirm(
        "Confirm publication: This will push the article live to the main site.",
      )
    )
      return;

    setPublishing(true);
    const result = await approveAndPublishAction(article.id, {
      metaTitle: overrides.metaTitle,
      isBreaking: overrides.isBreaking,
    });

    if (result.success) {
      alert("Successfully published to Sanity!");
      window.location.href = "/admin/queue";
    } else {
      alert(`Publishing Error: ${result.error.message}`);
    }
    setPublishing(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-[1400px] mx-auto p-6">
      {/* Left Column: The Content Editor */}
      <div className="flex-1 bg-white rounded-[2.5rem] p-8 lg:p-12 border border-slate-100 shadow-sm">
        <header className="mb-10 border-b border-slate-50 pb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full font-black uppercase text-[10px] tracking-widest">
              {article.category}
            </span>
            <span className="text-slate-300 text-xs">|</span>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-tight">
              Draft ID: {article.id.split("-")[0]}
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
            {article.title}
          </h1>

          <div className="flex items-center gap-2 mt-6">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
              {article.profiles?.full_name?.charAt(0)}
            </div>
            <p className="text-slate-500 font-medium">
              Written by{" "}
              <span className="text-slate-900 font-bold">
                {article.profiles?.full_name}
              </span>
            </p>
          </div>
        </header>

        <NewsEditor
          initialContent={article.content as unknown as JSONContent}
          onUpdate={(json) =>
            setArticle({
              ...article,
              // Cast the content array specifically to your strict Node type
              content: {
                type: "doc",
                content: (json.content || []) as TiptapNode[],
              },
            })
          }
        />
      </div>

      {/* Right Column: EiC Toolbox */}
      <aside className="w-full lg:w-100 space-y-6">
        {/* SEO & Quality Check Card */}
        <section className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200">
          <h3 className="flex items-center gap-2 font-black uppercase text-xs tracking-[0.2em] mb-8 text-slate-400">
            <Search size={16} className="text-red-500" />
            SEO Optimization
          </h3>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                Meta Title Override
              </label>
              <input
                value={overrides.metaTitle}
                onChange={(e) =>
                  setOverrides({ ...overrides, metaTitle: e.target.value })
                }
                className="w-full bg-slate-800 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-red-500 transition-all"
                placeholder="Enter custom SEO title..."
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl">
              <div>
                <p className="text-xs font-bold">Breaking News</p>
                <p className="text-[10px] text-slate-500">
                  Highlight in ticker and alerts
                </p>
              </div>
              <input
                aria-label="breaking news flag"
                type="checkbox"
                checked={overrides.isBreaking}
                onChange={(e) =>
                  setOverrides({ ...overrides, isBreaking: e.target.checked })
                }
                className="w-5 h-5 accent-red-500"
              />
            </div>
          </div>
        </section>

        {/* Quality Controls */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="flex items-center gap-2 font-black uppercase text-xs tracking-[0.2em] text-slate-800 mb-6">
            <ShieldCheck size={16} className="text-green-600" />
            Pre-Flight Check
          </h3>

          <ul className="space-y-4">
            <CheckItem
              label="Featured Image Linked"
              active={!!article.featured_image_url}
            />
            <CheckItem
              label="Category Logic Valid"
              active={!!article.category}
            />
            <CheckItem
              label="Sanity Reference Ready"
              active={!!article.profiles?.sanity_author_id}
            />
          </ul>
        </section>

        {/* Action Button */}
        <button
          onClick={handlePublish}
          disabled={publishing}
          className="w-full bg-red-600 text-white py-8 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 hover:bg-red-700 transition-all shadow-xl shadow-red-500/40 active:scale-95 disabled:bg-slate-200 disabled:shadow-none"
        >
          {publishing ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
          Push to Live Site
        </button>
      </aside>
    </div>
  );
}

function CheckItem({ label, active }: { label: string; active: boolean }) {
  return (
    <li
      className={`flex items-center gap-3 text-[11px] font-black uppercase tracking-widest ${active ? "text-slate-600" : "text-slate-300"}`}
    >
      <div
        className={`w-2 h-2 rounded-full ${active ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-slate-200"}`}
      />
      {label}
    </li>
  );
}
