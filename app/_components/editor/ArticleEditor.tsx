"use client";

import {
  useEditor,
  EditorContent,
  BubbleMenu,
  JSONContent,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import BubbleMenuExtension from "@tiptap/extension-bubble-menu";

import { Bold, Italic, Heading2, Link as LinkIcon } from "lucide-react";
import EditorToolbar from "./Toolbar";
import { uploadEditorImage } from "@/lib/editor/upload";

// Explicitly define the props for TypeScript
export interface NewsEditorProps {
  initialContent?: JSONContent;
  onUpdate: (content: JSONContent) => void;
}

export default function NewsEditor({
  initialContent,
  onUpdate,
}: NewsEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable the default bubble menu from StarterKit to use our custom one
        // history: true,
      }),
      BubbleMenuExtension.configure({
        element: null, // This is managed by the React component below
      }),
      CharacterCount.configure({
        limit: 10000,
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class:
            "rounded-xl border border-slate-200 shadow-lg my-8 max-w-full h-auto mx-auto block",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline font-medium cursor-pointer",
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing your scoop here...",
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-lg focus:outline-none max-w-none min-h-[500px] pb-20 px-8",
      },
      // Logic for Drag & Drop uploads
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
      // Logic for Pasting images (Screenshots etc)
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
      // This calls the Supabase Server Action logic we built
      const url = await uploadEditorImage(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all focus-within:border-slate-400 relative">
      {/* 1. Main Toolbar at the Top */}
      <EditorToolbar editor={editor} />

      {/* 2. Floating Bubble Menu (Appears when text is highlighted) */}
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 150 }}
          className="flex bg-slate-900 text-white rounded-lg shadow-2xl border border-slate-700 overflow-hidden"
        >
          <button
            aria-label="Toggle bold"
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 hover:bg-slate-800 transition-colors ${
              editor.isActive("bold") ? "text-red-500" : ""
            }`}
          >
            <Bold size={16} />
          </button>

          <button
            aria-label="Toggle Italic"
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 hover:bg-slate-800 transition-colors ${
              editor.isActive("italic") ? "text-red-500" : ""
            }`}
          >
            <Italic size={16} />
          </button>

          <button
            aria-label="Toggle Heading Level 2"
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`p-2 hover:bg-slate-800 transition-colors ${
              editor.isActive("heading", { level: 2 }) ? "text-red-500" : ""
            }`}
          >
            <Heading2 size={16} />
          </button>

          <button
            aria-label="Add Link"
            type="button"
            onClick={() => {
              const url = window.prompt("Enter link URL");
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }}
            className={`p-2 hover:bg-slate-800 transition-colors ${
              editor.isActive("link") ? "text-red-500" : ""
            }`}
          >
            <LinkIcon size={16} />
          </button>
        </BubbleMenu>
      )}

      {/* 3. The actual editable area */}
      <div className="py-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
