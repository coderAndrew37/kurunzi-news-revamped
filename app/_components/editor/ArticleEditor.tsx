"use client";

import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";

import EditorToolbar from "./Toolbar";
import { uploadEditorImage } from "@/lib/editor/upload";

export interface NewsEditorProps {
  initialContent?: JSONContent;
  onUpdate: (content: JSONContent) => void;
}

export default function NewsEditor({
  initialContent,
  onUpdate,
}: NewsEditorProps) {
  const editor = useEditor({
    // FIX: Prevents SSR Hydration Mismatch in Next.js
    immediatelyRender: false,

    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      CharacterCount.configure({
        limit: 10000,
      }),
      Image.configure({
        allowBase64: true,
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
    onUpdate: ({ editor }) => {
      onUpdate(editor.getJSON());
    },
    editorProps: {
      attributes: {
        // Tailwind Prose (Typography) configuration for a "People Daily" Editorial feel
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
            handleImageUpload(file);
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
              handleImageUpload(file);
              return true;
            }
          }
        }
        return false;
      },
    },
  });

  const handleImageUpload = async (file: File) => {
    if (!editor) return;
    try {
      const url = await uploadEditorImage(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("System Error: Could not upload editorial image.");
    }
  };

  // Prevent UI flickering during hydration
  if (!editor) {
    return (
      <div className="w-full min-h-[600px] bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin" />
          <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
            Initialising Newsroom Editor
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm transition-all focus-within:shadow-md focus-within:border-slate-200 relative">
      {/* Editorial Toolbar */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-50">
        <EditorToolbar editor={editor} />
      </div>

      {/* Main Content Area */}
      <div className="relative">
        <EditorContent editor={editor} />

        {/* Character Count Overlay */}
        <div className="absolute bottom-6 right-8 pointer-events-none">
          <div className="bg-slate-900 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest opacity-20 group-hover:opacity-100 transition-opacity">
            {editor.storage.characterCount.characters()} / 10,000 Characters
          </div>
        </div>
      </div>
    </div>
  );
}
