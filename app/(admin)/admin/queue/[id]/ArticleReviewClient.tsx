"use client";

import { JSONContent } from "@tiptap/react";
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Globe,
  Image as ImageIcon,
  Loader2,
  MessageSquare,
  Search,
  Send,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import NewsEditor from "@/app/_components/editor/ArticleEditor";
import { approveArticleAction } from "@/lib/actions/approve";
import { rejectArticleAction } from "@/lib/actions/articles";
import { publishToSanityAction } from "@/lib/actions/publish";
import { ArticleWorkflowRow, EicOverrides } from "@/types/database";
import { EditorMetadata, TiptapNode } from "@/types/editor";

interface ArticleReviewClientProps {
  initialArticle: ArticleWorkflowRow;
  initialMeta: EditorMetadata;
}

export default function ArticleReviewClient({
  initialArticle,
  initialMeta,
}: ArticleReviewClientProps) {
  const [article, setArticle] = useState<ArticleWorkflowRow>(initialArticle);
  const [isApproving, setIsApproving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [meta] = useState<EditorMetadata>(initialMeta);

  const [overrides, setOverrides] = useState<EicOverrides>({
    metaTitle: initialArticle?.title ?? "",
    isBreaking: initialArticle?.is_breaking ?? false,
    siteContext: initialArticle?.site_context ?? "main",
  });

  if (!initialArticle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
        <AlertCircle className="mb-4 text-red-500" size={48} />
        <h2 className="text-xl font-bold">Article Data Missing</h2>
      </div>
    );
  }

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const result = await approveArticleAction(article.id, overrides);
      if (result.success) {
        toast.success("Article marked as Approved");
        setArticle((prev) => ({ ...prev, status: "approved" }));
      } else {
        toast.error(`Approval Failed: ${result.error?.message}`);
      }
    } catch (err) {
      toast.error("An unexpected error occurred during approval.");
    } finally {
      setIsApproving(false);
    }
  };

  const handlePublish = async () => {
    if (!confirm("Push this story live to Sanity?")) return;
    setIsPublishing(true);
    try {
      const result = await publishToSanityAction(article.id, overrides);
      if (result.success) {
        toast.success("Live on Sanity!");
        window.location.href = "/admin/queue";
      } else {
        toast.error(`Publishing Error: ${result.error?.message}`);
      }
    } catch (err) {
      toast.error("An unexpected error occurred during publishing.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-350 mx-auto p-6 animate-in fade-in duration-500">
      {/* LEFT: CONTENT & EDITOR */}
      <div className="flex-1 space-y-6">
        <section className="bg-white rounded-[3rem] p-8 lg:p-14 border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <ArticleHeader article={article} overrides={overrides} />

          <NewsEditor
            initialContent={article.content as unknown as JSONContent}
            onUpdate={(json) =>
              setArticle((prev) => ({
                ...prev,
                content: {
                  type: "doc",
                  content: (json.content || []) as TiptapNode[],
                },
              }))
            }
          />
        </section>
      </div>

      {/* RIGHT: EDITORIAL SIDEBAR */}
      <aside className="w-full lg:w-100 space-y-6">
        <EditorialSidebar
          overrides={overrides}
          setOverrides={setOverrides}
          article={article}
          setArticle={setArticle}
          meta={meta}
        />

        <MediaPreview url={article.featured_image_url} />

        <ActionButtons
          status={article.status}
          isApproving={isApproving}
          isPublishing={isPublishing}
          onApprove={handleApprove}
          onPublish={handlePublish}
        />
      </aside>
    </div>
  );
}

/**
 * SUB-COMPONENT: ARTICLE HEADER
 */
function ArticleHeader({
  article,
  overrides,
}: {
  article: ArticleWorkflowRow;
  overrides: EicOverrides;
}) {
  return (
    <header className="mb-10 border-b border-slate-50 pb-10">
      <div className="flex items-center gap-4 mb-6">
        <span className="bg-red-600 text-white px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest shadow-lg shadow-red-200">
          {article.category || "Uncategorized"}
        </span>
        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
          <Globe size={12} />
          {overrides.siteContext}
        </div>
      </div>

      <h1 className="text-5xl lg:text-6xl font-black text-slate-900 leading-[1.05] tracking-tighter mb-8">
        {overrides.metaTitle || article.title}
      </h1>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-sm font-black text-white">
            {article.profiles?.full_name?.charAt(0) || "W"}
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Author
            </p>
            <p className="text-slate-900 font-bold">
              {article.profiles?.full_name || "Unknown"}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
            Status
          </p>
          <span
            className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
              article.status === "approved"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {article.status?.replace("_", " ") || "Draft"}
          </span>
        </div>
      </div>
    </header>
  );
}

/**
 * SUB-COMPONENT: EDITORIAL SIDEBAR (Overrides)
 */
interface SidebarProps {
  overrides: EicOverrides;
  setOverrides: React.Dispatch<React.SetStateAction<EicOverrides>>;
  article: ArticleWorkflowRow;
  setArticle: React.Dispatch<React.SetStateAction<ArticleWorkflowRow>>;
  meta: EditorMetadata;
}

function EditorialSidebar({
  overrides,
  setOverrides,
  article,
  setArticle,
  meta,
}: SidebarProps) {
  const [rejectNote, setRejectNote] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  const handleReject = async () => {
    if (!rejectNote.trim())
      return toast.error("Please provide a reason for rejection.");
    setIsRejecting(true);

    const result = await rejectArticleAction(article.id, rejectNote);

    if (result.success) {
      toast.success("Article sent back to writer with feedback.");
      window.location.href = "/admin/queue";
    } else {
      toast.error(
        typeof result.error === "string" ? result.error : "Failed to reject",
      );
    }
    setIsRejecting(false);
  };

  return (
    <section className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl">
      <h3 className="flex items-center gap-2 font-black uppercase text-[10px] tracking-[0.2em] mb-8 text-slate-400">
        <Search size={14} className="text-red-500" />
        Editorial Overrides
      </h3>

      <div className="space-y-6">
        {/* SEO Headline */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
            SEO Headline
          </label>
          <textarea
            aria-label="SEO Headline"
            value={overrides.metaTitle}
            onChange={(e) =>
              setOverrides((prev) => ({ ...prev, metaTitle: e.target.value }))
            }
            className="w-full bg-slate-800 border-none rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-red-500 min-h-25"
          />
        </div>

        {/* Category Selector */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
            Primary Section
          </label>
          <select
            aria-label="Category"
            value={article.category || ""}
            onChange={(e) =>
              setArticle((prev) => ({ ...prev, category: e.target.value }))
            }
            className="w-full bg-slate-800 border-none rounded-2xl p-4 text-xs font-black uppercase outline-none focus:ring-2 focus:ring-red-500"
          >
            {meta.categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        {/* Breaking & Context */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
            <span className="text-[10px] font-black uppercase">Breaking</span>
            <input
              aria-label="is-breaking"
              type="checkbox"
              checked={overrides.isBreaking}
              onChange={(e) =>
                setOverrides((prev) => ({
                  ...prev,
                  isBreaking: e.target.checked,
                }))
              }
              className="w-5 h-5 accent-red-500"
            />
          </div>

          <select
            aria-label="Context"
            value={overrides.siteContext || "main"}
            onChange={(e) =>
              setOverrides((prev) => ({ ...prev, siteContext: e.target.value }))
            }
            className="bg-slate-800 border-none rounded-2xl p-4 text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-red-500"
          >
            {meta.siteContexts.map((ctx) => (
              <option key={ctx.value} value={ctx.value}>
                {ctx.title}
              </option>
            ))}
          </select>
        </div>

        {/* REJECTION BLOCK */}
        <div className="pt-8 mt-8 border-t border-slate-800 space-y-4">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
            <MessageSquare size={12} className="text-amber-500" />
            Return with Feedback
          </label>
          <textarea
            placeholder="What needs fixing? (e.g. 'Update lede', 'Add source')..."
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-xs outline-none focus:border-red-500 transition-all min-h-24 placeholder:text-slate-600"
          />
          <button
            onClick={handleReject}
            disabled={isRejecting}
            className="w-full py-4 bg-transparent border-2 border-red-900/50 text-red-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-[0.98] flex justify-center items-center gap-2"
          >
            {isRejecting ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              "Reject & Send Back"
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

/**
 * SUB-COMPONENT: MEDIA PREVIEW
 */
function MediaPreview({ url }: { url: string | null }) {
  return (
    <section className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
      <h3 className="flex items-center gap-2 font-black uppercase text-[10px] tracking-[0.2em] text-slate-400 mb-4">
        <ImageIcon size={14} /> Featured Media
      </h3>
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-50">
        {url ? (
          <Image src={url} alt="Preview" fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300 text-[10px] font-bold uppercase">
            No Image
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * SUB-COMPONENT: ACTIONS
 */
interface ActionProps {
  status: string | null;
  isApproving: boolean;
  isPublishing: boolean;
  onApprove: () => void;
  onPublish: () => void;
}

function ActionButtons({
  status,
  isApproving,
  isPublishing,
  onApprove,
  onPublish,
}: ActionProps) {
  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={onApprove}
        disabled={isApproving || isPublishing || status === "approved"}
        className="w-full bg-white text-slate-900 border-2 border-slate-100 py-6 rounded-4xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-slate-50 transition-all disabled:opacity-50"
      >
        {isApproving ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <CheckCircle size={16} />
        )}
        {status === "approved" ? "Clearance Granted" : "Approve Draft"}
      </button>

      <button
        onClick={onPublish}
        disabled={isPublishing || isApproving}
        className="w-full bg-red-600 text-white py-8 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-red-700 transition-all shadow-xl shadow-red-500/40 active:scale-95 disabled:bg-slate-200"
      >
        {isPublishing ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <>
            <Send size={18} />
            Publish to Sanity
            <ChevronRight size={16} />
          </>
        )}
      </button>
    </div>
  );
}
