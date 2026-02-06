"use client";

import NewsEditor from "@/app/_components/editor/ArticleEditor";
import { approveAndPublishAction } from "@/lib/actions/publish";
import { Loader2, Search, Send, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export default function ArticleReviewPage({
  params,
}: {
  params: { id: string };
}) {
  const [article, setArticle] = useState<any>(null);
  const [publishing, setPublishing] = useState(false);
  const [seoScore, setSeoScore] = useState(0);

  // 1. Fetch the draft from Supabase Workflow
  useEffect(() => {
    async function loadDraft() {
      // In a real app, fetch from Supabase here
      // const { data } = await supabase.from('article_workflow').select('*').eq('id', params.id).single();
      // setArticle(data);
    }
    loadDraft();
  }, [params.id]);

  const handlePublish = async () => {
    setPublishing(true);
    const result = await approveAndPublishAction(params.id);
    if (result.success) {
      alert("Published to Sanity!");
      window.location.href = "/admin/queue";
    } else {
      alert(result.error);
    }
    setPublishing(false);
  };

  if (!article)
    return (
      <div className="p-20 text-center">
        <Loader2 className="animate-spin mx-auto" />
      </div>
    );

  return (
    <div className="flex gap-8">
      {/* Left Column: The Content Editor */}
      <div className="flex-1 bg-white rounded-3xl p-10 border shadow-sm">
        <header className="mb-8 border-b pb-6">
          <span className="text-pd-red font-black uppercase text-xs tracking-widest">
            {article.category}
          </span>
          <h1 className="text-4xl font-black mt-2 leading-tight">
            {article.title}
          </h1>
          <p className="text-slate-400 mt-2 font-medium italic">
            Draft by {article.profiles?.full_name}
          </p>
        </header>

        <NewsEditor
          initialContent={article.content}
          onUpdate={(json) => setArticle({ ...article, content: json })}
        />
      </div>

      {/* Right Column: EiC Toolbox */}
      <aside className="w-96 space-y-6">
        {/* SEO & Quality Check Card */}
        <section className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
          <h3 className="flex items-center gap-2 font-bold mb-6">
            <Search size={18} className="text-pd-red" />
            SEO Optimization
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500">
                Meta Title Override
              </label>
              <input
                aria-label="meta title"
                value={article.title}
                className="w-full bg-slate-800 border-none rounded-lg p-3 mt-1 text-sm outline-none focus:ring-2 focus:ring-pd-red"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500">
                Slug (URL)
              </label>
              <input
                placeholder="article-url-slug"
                className="w-full bg-slate-800 border-none rounded-lg p-3 mt-1 text-sm font-mono"
              />
            </div>
          </div>
        </section>

        {/* Quality Controls */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200">
          <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
            <ShieldCheck size={18} className="text-green-600" />
            Pre-Flight Check
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-xs font-bold text-slate-600">
              <div className="w-2 h-2 rounded-full bg-green-500" /> Featured
              Image Set
            </li>
            <li className="flex items-center gap-3 text-xs font-bold text-slate-600">
              <div className="w-2 h-2 rounded-full bg-green-500" /> Category
              Assigned
            </li>
            <li className="flex items-center gap-3 text-xs font-bold text-slate-400">
              <div className="w-2 h-2 rounded-full bg-slate-200" /> Internal
              Links Present
            </li>
          </ul>
        </section>

        {/* Action Button */}
        <button
          onClick={handlePublish}
          disabled={publishing}
          className="w-full bg-pd-red text-white py-6 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-700 transition-all shadow-xl shadow-red-500/20"
        >
          {publishing ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Send size={20} />
          )}
          Push to Live Site
        </button>
      </aside>
    </div>
  );
}
