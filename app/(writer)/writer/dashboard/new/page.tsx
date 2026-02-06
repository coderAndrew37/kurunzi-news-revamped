"use client";

import { useState, useEffect } from "react";
import { saveDraftAction } from "@/lib/actions/articles";
import NewsEditor from "@/app/_components/editor/ArticleEditor";
import TagSelector from "@/app/_components/editor/TagSelector";
import { WriterDraft } from "@/types/editor";
import { JSONContent } from "@tiptap/react";
import { fetchNavCategories } from "@/lib/sanity/api";
import { uploadMediaAction } from "@/lib/actions/media";
import { ImageIcon, X, Loader2 } from "lucide-react";
import Image from "next/image";

// Define the Props interface
interface NewArticlePageProps {
  initialData?: WriterDraft;
}

export default function NewArticlePage({ initialData }: NewArticlePageProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<
    { title: string; slug: string }[]
  >([]);

  // Initialize state
  const [article, setArticle] = useState<WriterDraft>(
    initialData || {
      title: "",
      category: "",
      excerpt: "",
      status: "draft",
      featuredImage: null,
      tags: [],
      content: { type: "doc", content: [] },
    },
  );

  // 1. Fetch Categories and handle initial hydrate
  useEffect(() => {
    async function getCats() {
      const data = await fetchNavCategories();
      setCategories(data);

      // Only set default category if we aren't editing an existing article
      if (!initialData && data.length > 0 && !article.category) {
        setArticle((prev) => ({ ...prev, category: data[0].slug }));
      }
    }
    getCats();
  }, [initialData]);

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
    const result = await saveDraftAction(article);
    if (result.error) console.error(result.error);
    else alert("Story saved successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
        <div className="w-full md:w-1/3">
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2">
            Category
          </label>
          <select
            aria-label="Select category"
            value={article.category}
            onChange={(e) =>
              setArticle({ ...article, category: e.target.value })
            }
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-pd-red transition-colors"
          >
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-2/3">
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2">
            Excerpt
          </label>
          <textarea
            placeholder="A short summary..."
            value={article.excerpt}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-pd-red h-[46px] resize-none"
            onChange={(e) =>
              setArticle({ ...article, excerpt: e.target.value })
            }
          />
        </div>
      </div>

      <input
        className="text-5xl font-black w-full outline-none mb-8 placeholder:text-slate-200 tracking-tight"
        placeholder="Headline goes here..."
        value={article.title}
        onChange={(e) => setArticle({ ...article, title: e.target.value })}
      />

      <div className="mb-10">
        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-3">
          Featured Image
        </label>
        {article.featuredImage ? (
          <div className="relative group rounded-xl overflow-hidden border-4 border-slate-100 shadow-sm h-64">
            <Image
              src={article.featuredImage as string}
              alt="Featured"
              className="object-cover"
              fill
            />
            <button
              aria-label="Remove featured image"
              type="button"
              onClick={() =>
                setArticle((prev) => ({ ...prev, featuredImage: null }))
              }
              className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} className="text-red-500" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
            {isUploading ? (
              <Loader2 className="animate-spin text-pd-red" />
            ) : (
              <ImageIcon className="text-slate-300 mb-2" size={32} />
            )}
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {isUploading ? "Uploading..." : "Upload Cover Image"}
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

      <div className="mb-10">
        <h3 className="text-[10px] font-bold text-slate-400 mb-3 uppercase">
          Tags & Topics
        </h3>
        <TagSelector
          selectedTags={article.tags}
          onTagsChange={(tags) => setArticle({ ...article, tags })}
        />
      </div>

      <NewsEditor
        initialContent={article.content}
        onUpdate={(json: JSONContent) =>
          setArticle({ ...article, content: json })
        }
      />

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-slate-100 flex justify-end gap-4 z-50">
        <button
          onClick={handleSave}
          className="bg-pd-red text-white px-10 py-3 rounded-full font-black text-sm uppercase tracking-widest shadow-xl shadow-red-500/20 hover:bg-red-700 transition-all active:scale-95"
        >
          {initialData ? "Update Article" : "Save Draft"}
        </button>
      </div>
    </div>
  );
}
