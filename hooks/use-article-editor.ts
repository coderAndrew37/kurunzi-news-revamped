import { saveDraftAction } from "@/lib/actions/articles";
import { uploadMediaAction } from "@/lib/actions/media";
import { slugify } from "@/lib/utils/slugify";
import { WriterDraft } from "@/types/editor";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const STORAGE_KEY = "pda_draft_v1";

export function useArticleEditor(
  initialData: WriterDraft | undefined,
  initialCategory: string,
) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const BLANK_STATE: WriterDraft = {
    title: "",
    slug: "",
    category: initialCategory,
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
    editorNotes: "",
  };

  const [article, setArticle] = useState<WriterDraft>(
    initialData || BLANK_STATE,
  );

  // Hydration-safe LocalStorage restore
  useEffect(() => {
    if (!initialData) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setArticle(JSON.parse(saved));
    }
  }, [initialData]);

  // Auto-save
  const canEdit = article.status === "draft" || article.status === "rejected";
  useEffect(() => {
    if (!initialData && canEdit) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(article));
    }
  }, [article, initialData, canEdit]);

  const updateField = (fields: Partial<WriterDraft>) => {
    if (!canEdit) return;
    setArticle((prev) => ({ ...prev, ...fields }));
  };

  const handleTitleChange = (title: string) => {
    updateField({ title, slug: slugify(title) });
  };

  const handleImageUpload = async (file: File) => {
    if (!canEdit) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await uploadMediaAction(formData);
      if (result.success) {
        updateField({ featuredImage: result.url });
        toast.success("Image uploaded");
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const resetArticle = () => {
    localStorage.removeItem(STORAGE_KEY);
    setArticle(BLANK_STATE);
  };

  const handleAction = async (targetStatus: WriterDraft["status"]) => {
    if (!canEdit) return;
    const isSubmission = targetStatus === "pending_review";
    isSubmission ? setIsSubmitting(true) : setIsSaving(true);

    try {
      const result = await saveDraftAction({
        ...article,
        status: targetStatus,
      });
      if (result.success) {
        toast.success(isSubmission ? "Submitted!" : "Saved!");
        localStorage.removeItem(STORAGE_KEY);
        if (isSubmission) {
          router.push("/writer/dashboard");
          router.refresh();
        } else if (result.articleId) {
          updateField({ id: result.articleId });
        }
      } else {
        toast.error("Error saving article");
      }
    } catch (err) {
      toast.error("System error");
    } finally {
      isSubmission ? setIsSubmitting(false) : setIsSaving(false);
    }
  };

  return {
    article,
    setArticle,
    canEdit,
    isUploading,
    isSaving,
    isSubmitting,
    handleTitleChange,
    handleImageUpload,
    handleAction,
    updateField,
    resetArticle,
  };
}
