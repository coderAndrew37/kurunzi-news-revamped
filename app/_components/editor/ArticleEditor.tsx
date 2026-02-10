"use client";

import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import { useState, useRef } from "react";
import { X, Image as ImageIcon, CheckCircle2, Info } from "lucide-react";

import EditorToolbar from "./Toolbar";
import { uploadEditorImage } from "@/lib/editor/upload";

// 1. Extended Image Node to support Editorial Metadata
const NewsImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      alt: { default: "" },
      caption: { default: "" },
      source: { default: "" },
    };
  },
});

export interface NewsEditorProps {
  initialContent?: JSONContent;
  onUpdate: (content: JSONContent) => void;
}

export default function NewsEditor({
  initialContent,
  onUpdate,
}: NewsEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal & Upload State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingImage, setPendingImage] = useState<{
    url: string;
    file: File;
  } | null>(null);
  const [metadata, setMetadata] = useState({
    alt: "",
    caption: "",
    source: "",
  });
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        // Configure lists manually for better Tailwind class injection
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc ml-6 space-y-2 text-slate-700 marker:text-red-500",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class:
            "list-decimal ml-6 space-y-2 text-slate-700 marker:text-slate-400 marker:font-bold",
        },
      }),
      ListItem,
      CharacterCount.configure({ limit: 10000 }),
      NewsImage.configure({
        allowBase64: false,
        HTMLAttributes: {
          class:
            "rounded-2xl border border-slate-200 shadow-xl my-12 max-w-full h-auto mx-auto block transition-all hover:shadow-2xl",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-red-600 underline decoration-red-200 underline-offset-4 font-medium hover:text-red-700",
        },
      }),
      Placeholder.configure({
        placeholder: "Tell your story...",
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => onUpdate(editor.getJSON()),
    editorProps: {
      attributes: {
        class:
          "prose prose-lg prose-slate max-w-none focus:outline-none " +
          "py-16 px-8 lg:px-24 " +
          "prose-p:font-serif prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-[1.25rem] " +
          "prose-headings:text-slate-900 prose-headings:font-bold " +
          "prose-blockquote:border-l-4 prose-blockquote:border-red-600 prose-blockquote:bg-slate-50/50 prose-blockquote:font-serif prose-blockquote:text-slate-600 prose-blockquote:rounded-r-xl",
      },
      handleDrop: (view, event, _slice, moved) => {
        if (!moved && event.dataTransfer?.files?.length) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            prepareImageMetadata(file);
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        for (const item of items) {
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (file) {
              prepareImageMetadata(file);
              return true;
            }
          }
        }
        return false;
      },
    },
  });

  const prepareImageMetadata = (file: File) => {
    const tempUrl = URL.createObjectURL(file);
    setPendingImage({ url: tempUrl, file });
    setIsModalOpen(true);
  };

  const handleFinalInsert = async () => {
    if (!editor || !pendingImage) return;
    setIsUploading(true);

    try {
      const finalUrl = await uploadEditorImage(pendingImage.file);

      editor
        .chain()
        .focus()
        .setImage({
          src: finalUrl,
          alt: metadata.alt,
          // @ts-ignore - handled by NewsImage extension
          caption: metadata.caption,
          // @ts-ignore - handled by NewsImage extension
          source: metadata.source,
        })
        .run();

      // Reset
      setIsModalOpen(false);
      setPendingImage(null);
      setMetadata({ alt: "", caption: "", source: "" });
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      alert("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!editor) return null;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col h-[85vh] overflow-hidden relative">
      {/* 1. STICKY PREMIUM TOOLBAR */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-3 py-2 shrink-0">
        <EditorToolbar
          editor={editor}
          onImageClick={() => fileInputRef.current?.click()}
        />
      </div>

      {/* 2. SCROLLABLE CONTENT AREA */}
      <div className="flex-1 overflow-y-auto scrollbar-hide selection:bg-red-100">
        <div className="max-w-4xl mx-auto">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* 3. PREMIUM FOOTER */}
      <div className="p-4 border-t border-slate-50 bg-slate-50/50 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live Editor
          </span>
          <span className="text-[10px] font-medium text-slate-400">
            Press{" "}
            <kbd className="bg-white border shadow-xs rounded px-1 text-slate-500 font-sans">
              Mod + Enter
            </kbd>{" "}
            for break
          </span>
        </div>

        <div className="bg-slate-900 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
          {editor.storage.characterCount.characters().toLocaleString()} / 10,000
          Characters
        </div>
      </div>

      {/* HIDDEN FILE INPUT */}
      <input
        aria-label="Upload Image"
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) prepareImageMetadata(file);
        }}
      />

      {/* METADATA MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/20">
            {/* Preview Side */}
            <div className="w-full md:w-1/2 bg-slate-100 relative min-h-75">
              {pendingImage && (
                <img
                  src={pendingImage.url}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white flex items-center gap-2">
                <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                  <ImageIcon size={16} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Visual Asset Preview
                </span>
              </div>
            </div>

            {/* Form Side */}
            <div className="w-full md:w-1/2 p-8 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h3 className="font-black uppercase text-[10px] tracking-[0.2em] text-slate-400">
                  Image Metadata
                </h3>
                <button
                  aria-label="close modal"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 bg-slate-50 text-slate-400 hover:text-red-600 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                    Alt Text <Info size={12} className="text-slate-300" />
                  </label>
                  <input
                    autoFocus
                    className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600/20 transition-all"
                    placeholder="Describe for accessibility..."
                    value={metadata.alt}
                    onChange={(e) =>
                      setMetadata({ ...metadata, alt: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                    Caption
                  </label>
                  <textarea
                    className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600/20 transition-all resize-none"
                    placeholder="Context for readers..."
                    rows={2}
                    value={metadata.caption}
                    onChange={(e) =>
                      setMetadata({ ...metadata, caption: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                    Photo Credit
                  </label>
                  <input
                    className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600/20 transition-all"
                    placeholder="Source or Photographer"
                    value={metadata.source}
                    onChange={(e) =>
                      setMetadata({ ...metadata, source: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                onClick={handleFinalInsert}
                disabled={isUploading}
                className="mt-2 w-full bg-red-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-xl shadow-red-100 disabled:bg-slate-200 disabled:shadow-none"
              >
                {isUploading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 size={14} />
                    Insert Asset
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
