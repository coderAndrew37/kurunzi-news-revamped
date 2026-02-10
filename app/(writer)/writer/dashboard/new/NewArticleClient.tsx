"use client";

import { useArticleEditor } from "@/hooks/use-article-editor";
import EditorHeader from "./_components/EditorHeader";
import MediaSection from "./_components/MediaSection";
import ActionFooter from "./_components/ActionFooter";
import NewsEditor from "@/app/_components/editor/ArticleEditor";
import TagSelector from "@/app/_components/editor/TagSelector";
import { WriterDraft } from "@/types/editor";

interface NewArticleClientProps {
  initialData?: WriterDraft; // Made optional
  initialCategories: { title: string; slug: string }[];
}

export default function NewArticleClient({
  initialData,
  initialCategories,
}: NewArticleClientProps) {
  // 1. Call the hook and destructure everything you need
  const {
    article,
    canEdit,
    isUploading,
    isSaving,
    isSubmitting,
    handleTitleChange,
    handleImageUpload,
    handleAction,
    updateField,
    resetArticle, // Destructured correctly here
  } = useArticleEditor(initialData, initialCategories[0]?.slug);

  // 2. Determine if it's a new article
  const isNew = !initialData;

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 pb-40">
      {/* 1. Header & Status */}
      <EditorHeader
        article={article}
        updateField={updateField}
        canEdit={canEdit}
        onReset={resetArticle}
        isNewArticle={isNew}
      />

      {/* 2. Main Title & Excerpt */}
      <input
        disabled={!canEdit}
        className="text-6xl font-black w-full outline-none mb-4 tracking-tighter leading-[1.1] text-slate-900 placeholder:text-slate-100 disabled:text-slate-300"
        placeholder="Enter Headline..."
        value={article.title}
        onChange={(e) => handleTitleChange(e.target.value)}
      />

      <textarea
        disabled={!canEdit}
        className="w-full text-2xl text-slate-500 font-serif italic mb-12 outline-none bg-transparent resize-none"
        placeholder="Start with a strong lede..."
        value={article.excerpt}
        onChange={(e) => updateField({ excerpt: e.target.value })}
      />

      {/* 3. Media Uploads */}
      <MediaSection
        article={article}
        onUpload={handleImageUpload}
        updateField={updateField}
        canEdit={canEdit}
      />

      {/* 4. Taxonomy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
            Section / Category
          </label>
          <select
            aria-label="article category"
            value={article.category}
            onChange={(e) => updateField({ category: e.target.value })}
            className="w-full p-5 bg-slate-900 text-white rounded-3xl font-bold outline-none"
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
            onTagsChange={(tags) => updateField({ tags })}
          />
        </div>
      </div>

      {/* 5. The Editor */}
      <NewsEditor
        initialContent={article.content}
        onUpdate={(json) => updateField({ content: json })}
      />

      {/* 6. Sticky Footer */}
      <ActionFooter
        article={article}
        onAction={handleAction}
        loadingStates={{ isSaving, isSubmitting, isUploading }}
        canEdit={canEdit}
      />
    </div>
  );
}
