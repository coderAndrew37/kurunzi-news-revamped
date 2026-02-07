"use client";

import { useState } from "react";
import { saveDraftAction } from "@/lib/actions/articles";
import NewsEditor from "@/app/_components/editor/ArticleEditor";
import TagSelector from "@/app/_components/editor/TagSelector";
import { WriterDraft } from "@/types/editor";
import { JSONContent } from "@tiptap/react";
import { uploadMediaAction } from "@/lib/actions/media";
import { ImageIcon, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface NewArticleClientProps {
  initialData?: WriterDraft;
  initialCategories: { title: string; slug: string }[];
}

export default function NewArticleClient({
  initialData,
  initialCategories,
}: NewArticleClientProps) {
  const [isUploading, setIsUploading] = useState(false);

  // Initialize state using initialData if editing, or a blank template if new
  const [article, setArticle] = useState<WriterDraft>(
    initialData || {
      title: "",
      category: initialCategories[0]?.slug || "",
      excerpt: "",
      status: "draft",
      featuredImage: null,
      tags: [],
      content: { type: "doc", content: [] },
    },
  );

  const handleFeaturedImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadMediaAction(formData);

    if (result.success && result.url) {
      setArticle((prev) => ({ ...prev, featuredImage: result.url }));
    } else {
      alert(result.error || "Image upload failed");
    }
    setIsUploading(false);
  };

  const handleSave = async () => {
    if (!article.title) return alert("Please add a title");
    if (!article.category) return alert("Please select a category");

    const result = await saveDraftAction(article);
    if (result.error) {
      console.error(result.error);
      alert("Failed to save: " + result.error);
    } else {
      alert("Story saved successfully!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 pb-32">
      {/* Meta Settings: Category & Excerpt */}
      <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
        <div className="w-full md:w-1/3">
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2 tracking-widest">
            Category
          </label>
          <select
            aria-label="Select category"
            value={article.category}
            onChange={(e) =>
              setArticle({ ...article, category: e.target.value })
            }
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none cursor-pointer"
          >
            {initialCategories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-2/3">
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2 tracking-widest">
            Excerpt / Lede
          </label>
          <textarea
            placeholder="A short summary for previews..."
            value={article.excerpt}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 h-[46px] resize-none transition-all"
            onChange={(e) =>
              setArticle({ ...article, excerpt: e.target.value })
            }
          />
        </div>
      </div>

      {/* Headline Input */}
      <input
        className="text-5xl font-black w-full outline-none mb-8 placeholder:text-slate-200 tracking-tight leading-tight focus:placeholder:text-slate-100"
        placeholder="Headline goes here..."
        value={article.title}
        onChange={(e) => setArticle({ ...article, title: e.target.value })}
      />

      {/* Featured Image Section */}
      <div className="mb-10">
        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-3 tracking-widest">
          Featured Image
        </label>
        {article.featuredImage ? (
          <div className="relative group rounded-2xl overflow-hidden border-4 border-slate-100 shadow-sm h-80">
            <Image
              src={article.featuredImage as string}
              alt="Featured cover"
              className="object-cover"
              fill
              priority
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                aria-label="Remove featured image"
                type="button"
                onClick={() =>
                  setArticle((prev) => ({ ...prev, featuredImage: null }))
                }
                className="bg-white p-3 rounded-full shadow-xl hover:scale-110 transition-transform"
              >
                <X size={20} className="text-red-500" />
              </button>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100/50 hover:border-red-200 cursor-pointer transition-all group">
            {isUploading ? (
              <Loader2 className="animate-spin text-red-500" size={32} />
            ) : (
              <ImageIcon
                className="text-slate-300 group-hover:text-red-300 mb-2 transition-colors"
                size={40}
              />
            )}
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {isUploading ? "Uploading to Cloud..." : "Upload Cover Image"}
            </span>
            <input
              type="file"
              className="hidden"
              onChange={handleFeaturedImageUpload}
              accept="image/*"
              disabled={isUploading}
            />
          </label>
        )}
      </div>

      {/* Tag Selector Component */}
      <div className="mb-10">
        <h3 className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-widest">
          Tags & Topics
        </h3>
        <TagSelector
          selectedTags={article.tags}
          onTagsChange={(tags) => setArticle({ ...article, tags })}
        />
      </div>

      {/* Main Tiptap Editor */}
      <div className="min-h-[400px]">
        <NewsEditor
          initialContent={article.content}
          onUpdate={(json: JSONContent) =>
            setArticle({ ...article, content: json as any })
          }
        />
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/60 backdrop-blur-xl border-t border-slate-100 flex justify-end items-center gap-4 z-50">
        <p className="hidden md:block text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-4">
          Draft automatically saved to workflow
        </p>
        <button
          onClick={handleSave}
          disabled={isUploading}
          className="bg-red-600 disabled:bg-slate-300 text-white px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl shadow-red-500/30 hover:bg-red-700 transition-all active:scale-95 flex items-center gap-2"
        >
          {initialData ? "Update Article" : "Save Story Draft"}
        </button>
      </div>
    </div>
  );
}
