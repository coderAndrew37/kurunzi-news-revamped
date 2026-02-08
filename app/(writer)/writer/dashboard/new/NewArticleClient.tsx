"use client";

import NewsEditor from "@/app/_components/editor/ArticleEditor";
import TagSelector from "@/app/_components/editor/TagSelector";
import { saveDraftAction } from "@/lib/actions/articles";
import { uploadMediaAction } from "@/lib/actions/media";
import { ActionResponse, WriterDraft } from "@/types/editor";
import {
  Globe,
  ImageIcon,
  Loader2,
  Save,
  X,
  Zap,
  Send,
  Info,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils/slugify";

interface NewArticleClientProps {
  initialData?: WriterDraft;
  initialCategories: { title: string; slug: string }[];
}

const STORAGE_KEY = "pda_draft_v1";

export default function NewArticleClient({
  initialData,
  initialCategories,
}: NewArticleClientProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Initialize State
  const [article, setArticle] = useState<WriterDraft>(() => {
    if (initialData) return initialData;

    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    }

    return {
      title: "",
      slug: "",
      category: initialCategories[0]?.slug || "",
      excerpt: "",
      status: "draft",
      featuredImage: null,
      imageAlt: "",
      imageCaption: "",
      imageSource: "",
      isBreaking: false,
      siteContext: "main",
      tags: [],
      content: { type: "doc", content: [] },
    };
  });

  // 2. Auto-save to LocalStorage
  useEffect(() => {
    if (!initialData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(article));
    }
  }, [article, initialData]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setArticle((prev) => ({
      ...prev,
      title,
      slug: slugify(title),
    }));
  };

  const handleFeaturedImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const promise = uploadMediaAction(formData);

    toast.promise(promise, {
      loading: "Uploading master media...",
      success: (result) => {
        setIsUploading(false);
        if (result.success) {
          setArticle((prev) => ({ ...prev, featuredImage: result.url }));
          return "Image processed successfully";
        }
        throw new Error(result.error);
      },
      error: (err) => {
        setIsUploading(false);
        return `Upload failed: ${err.message}`;
      },
    });
  };

  const handleAction = async (
    targetStatus: WriterDraft["status"] = "draft",
  ) => {
    const isSubmission = targetStatus === "pending_review";
    isSubmission ? setIsSubmitting(true) : setIsSaving(true);

    const payload = {
      ...article,
      status: targetStatus,
      slug: article.slug || slugify(article.title),
    };

    const result = (await saveDraftAction(payload)) as ActionResponse;

    if (result.success) {
      toast.success(
        isSubmission
          ? "Story submitted for editorial review"
          : "Draft saved to cloud",
      );
      if (!initialData) localStorage.removeItem(STORAGE_KEY);
      if (isSubmission) router.push("/writer/dashboard");
    } else if (result.error) {
      if (typeof result.error === "object") {
        Object.entries(result.error).forEach(([field, messages]) => {
          toast.error(`${field}: ${messages[0]}`);
        });
      } else {
        toast.error(result.error);
      }
    }

    isSubmission ? setIsSubmitting(false) : setIsSaving(false);
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 pb-40">
      {/* Editorial Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10 bg-slate-50 p-5 rounded-4xl border border-slate-100">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-slate-400" />
            <select
              aria-label="select site context"
              value={article.siteContext}
              onChange={(e) =>
                setArticle({ ...article, siteContext: e.target.value })
              }
              className="bg-transparent font-black uppercase text-[10px] tracking-widest outline-none cursor-pointer"
            >
              <option value="main">Main News</option>
              <option value="worldcup">World Cup 2027</option>
              <option value="elections">Elections 2027</option>
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          <button
            onClick={() =>
              setArticle({ ...article, isBreaking: !article.isBreaking })
            }
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all border ${
              article.isBreaking
                ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-200"
                : "bg-white border-slate-200 text-slate-400 hover:border-red-300"
            }`}
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

        <div className="px-4 py-1.5 rounded-full bg-slate-200 text-slate-500 text-[9px] font-black uppercase tracking-widest">
          {article.status} Mode
        </div>
      </div>

      {/* Main Inputs */}
      <input
        className="text-6xl font-black w-full outline-none mb-4 placeholder:text-slate-100 tracking-tighter leading-[1.1]"
        placeholder="Enter Headline..."
        value={article.title}
        onChange={handleTitleChange}
      />

      <div className="flex items-center gap-2 mb-8 text-slate-400 font-mono text-xs overflow-hidden">
        <span className="bg-slate-100 px-2 py-1 rounded text-[10px]">
          URL SLUG
        </span>
        <span className="truncate whitespace-nowrap">
          /news/{article.slug || "your-headline-here"}
        </span>
      </div>

      <textarea
        placeholder="Start with a strong lede (summary)..."
        value={article.excerpt}
        className="w-full p-0 bg-transparent text-2xl text-slate-500 font-serif italic mb-12 border-none outline-none resize-none leading-relaxed"
        rows={2}
        onChange={(e) => setArticle({ ...article, excerpt: e.target.value })}
      />

      {/* Featured Media Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
        <div className="lg:col-span-3">
          {article.featuredImage ? (
            <div className="relative group rounded-[2.5rem] overflow-hidden aspect-video shadow-2xl border-8 border-slate-50">
              <Image
                src={
                  typeof article.featuredImage === "string"
                    ? article.featuredImage
                    : ""
                }
                alt="Feature"
                className="object-cover"
                fill
                priority
              />
              <button
                aria-label="Remove featured image"
                onClick={() => setArticle({ ...article, featuredImage: null })}
                className="absolute top-6 right-6 bg-white/90 backdrop-blur p-3 rounded-full text-red-600 shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50 hover:bg-white hover:border-red-300 transition-all cursor-pointer group">
              <div className="bg-white p-6 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                <ImageIcon
                  size={40}
                  className="text-slate-300 group-hover:text-red-400"
                />
              </div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                Upload Master Media
              </span>
              <input
                type="file"
                className="hidden"
                onChange={handleFeaturedImageUpload}
                accept="image/*"
              />
            </label>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1">
              Alt Text <Info size={10} />
            </label>
            <input
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] outline-none focus:bg-white transition-all"
              placeholder="Accessibility description..."
              value={article.imageAlt}
              onChange={(e) =>
                setArticle({ ...article, imageAlt: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Caption
            </label>
            <textarea
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] outline-none focus:bg-white transition-all resize-none"
              placeholder="Describe the scene..."
              rows={2}
              value={article.imageCaption}
              onChange={(e) =>
                setArticle({ ...article, imageCaption: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Image Source
            </label>
            <input
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] outline-none focus:bg-white transition-all"
              placeholder="e.g. Getty Images"
              value={article.imageSource}
              onChange={(e) =>
                setArticle({ ...article, imageSource: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
            Section / Category
          </label>
          <select
            aria-label="select category"
            value={article.category}
            onChange={(e) =>
              setArticle({ ...article, category: e.target.value })
            }
            className="w-full p-5 bg-slate-900 text-white rounded-3xl font-bold outline-none ring-offset-4 focus:ring-2 focus:ring-red-500 transition-all cursor-pointer shadow-xl"
          >
            {initialCategories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
            Related Keywords
          </label>
          <TagSelector
            selectedTags={article.tags}
            onTagsChange={(tags) => setArticle({ ...article, tags })}
          />
        </div>
      </div>

      <NewsEditor
        initialContent={article.content}
        onUpdate={(json) => setArticle({ ...article, content: json })}
      />

      {/* Global Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-8 bg-white/80 backdrop-blur-2xl border-t border-slate-100 flex justify-between items-center z-50">
        <div className="hidden md:flex items-center gap-3">
          <div
            className={`w-2.5 h-2.5 rounded-full ${isSaving || isSubmitting ? "bg-amber-500 animate-pulse" : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"}`}
          />
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
            {isSaving || isSubmitting
              ? "Cloud Sync in Progress"
              : "Editorial Workspace Safe"}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => handleAction("draft")}
            disabled={isSaving || isSubmitting || isUploading}
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
            onClick={() => handleAction("pending_review")}
            disabled={isSaving || isSubmitting || isUploading}
            className="group relative bg-red-600 disabled:bg-slate-300 text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-red-500/40 hover:bg-red-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3 overflow-hidden"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Send size={18} />
            )}
            <span>Submit for Review</span>
          </button>
        </div>
      </div>
    </div>
  );
}
