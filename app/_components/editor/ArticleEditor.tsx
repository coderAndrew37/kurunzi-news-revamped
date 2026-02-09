"use client";

import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
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
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      CharacterCount.configure({ limit: 10000 }),
      NewsImage.configure({
        allowBase64: false,
        HTMLAttributes: {
          class:
            "rounded-2xl border border-slate-200 shadow-xl my-10 max-w-full h-auto mx-auto block transition-all hover:shadow-2xl",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-red-600 underline decoration-red-200 underline-offset-4 font-bold cursor-pointer hover:text-red-700",
        },
      }),
      Placeholder.configure({
        placeholder: "Write the next big headline here...",
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => onUpdate(editor.getJSON()),
    editorProps: {
      attributes: {
        class:
          "prose prose-lg prose-slate max-w-none min-h-[600px] py-12 px-8 lg:px-12 focus:outline-none " +
          "prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter " +
          "prose-p:font-serif prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-xl " +
          "prose-blockquote:border-l-4 prose-blockquote:border-red-600 prose-blockquote:italic prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-6",
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
          // @ts-ignore
          caption: metadata.caption,
          // @ts-ignore
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
    <div className="w-full bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm relative">
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-50">
        <EditorToolbar
          editor={editor}
          onImageClick={() => fileInputRef.current?.click()}
        />
      </div>

      {/* HIDDEN FILE INPUT FOR TOOLBAR IMAGE BUTTON */}
      <input
        aria-label="hidden file input for toolbar image button"
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) prepareImageMetadata(file);
        }}
      />

      <div className="relative">
        <EditorContent editor={editor} />
        <div className="absolute bottom-6 right-8 pointer-events-none">
          <div className="bg-slate-900 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest opacity-20">
            {editor.storage.characterCount.characters()} / 10,000 Characters
          </div>
        </div>
      </div>

      {/* METADATA MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
            {/* Preview Side */}
            <div className="w-full md:w-1/2 bg-slate-100 relative min-h-62.5">
              {pendingImage && (
                <img
                  src={pendingImage.url}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white flex items-center gap-2">
                <ImageIcon size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Image Preview
                </span>
              </div>
            </div>

            {/* Form Side */}
            <div className="w-full md:w-1/2 p-8 flex flex-col gap-5">
              <div className="flex justify-between items-center">
                <h3 className="font-black uppercase text-xs tracking-widest text-slate-400">
                  Editorial Details
                </h3>
                <button
                  aria-label="Close Metadata Modal"
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-300 hover:text-red-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1">
                    Alt Text <Info size={10} className="text-slate-300" />
                  </label>
                  <input
                    autoFocus
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-600/10 transition-all"
                    placeholder="Describe for screen readers..."
                    value={metadata.alt}
                    onChange={(e) =>
                      setMetadata({ ...metadata, alt: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                    Caption
                  </label>
                  <textarea
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-600/10 transition-all resize-none"
                    placeholder="The story behind the shot..."
                    rows={2}
                    value={metadata.caption}
                    onChange={(e) =>
                      setMetadata({ ...metadata, caption: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                    Photo Credit
                  </label>
                  <input
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-600/10 transition-all"
                    placeholder="Agency or Photographer"
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
                className="mt-2 w-full bg-red-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-200 disabled:bg-slate-200"
              >
                {isUploading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 size={14} />
                    Insert Into Story
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
