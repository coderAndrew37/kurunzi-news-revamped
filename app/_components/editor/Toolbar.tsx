"use client";

import { Editor } from "@tiptap/react";
import {
  Bold,
  Heading1,
  Image as ImageIcon,
  Link as LinkIcon,
  Quote,
} from "lucide-react";
import { useState } from "react";
import LinkSearch from "./LinkSearch";
import { ToolbarButtonProps } from "@/types/editor";

interface EditorToolbarProps {
  editor: Editor | null;
  onImageClick: () => void;
}

export default function EditorToolbar({
  editor,
  onImageClick,
}: EditorToolbarProps) {
  const [showLinkSearch, setShowLinkSearch] = useState(false);

  if (!editor) return null;

  const handleLinkSelect = (url: string, title: string) => {
    // If text is selected, link it. If not, insert the title as a link.
    const { from, to } = editor.state.selection;

    if (from === to) {
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${url}">${title}</a> `)
        .run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
    setShowLinkSearch(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-900 text-white rounded-t-xl">
      <ToolbarButton
        title="Bold (Ctrl+B)"
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
      >
        <Bold size={18} />
      </ToolbarButton>

      <ToolbarButton
        title="Secondary Heading"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
      >
        <Heading1 size={18} />
      </ToolbarButton>

      <div className="relative">
        <ToolbarButton
          title="Add Link"
          onClick={() => setShowLinkSearch(!showLinkSearch)}
          active={editor.isActive("link")}
        >
          <LinkIcon size={18} />
        </ToolbarButton>

        {showLinkSearch && (
          <LinkSearch
            onSelect={handleLinkSelect}
            onClose={() => setShowLinkSearch(false)}
          />
        )}
      </div>

      <div className="w-[1px] h-6 bg-slate-700 mx-1 self-center" />

      {/* Triggering the professional upload flow instead of prompt */}
      <ToolbarButton title="Insert Image" onClick={onImageClick}>
        <ImageIcon size={18} />
      </ToolbarButton>

      <ToolbarButton
        title="Blockquote"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
      >
        <Quote size={18} />
      </ToolbarButton>
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  active,
  title,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title} // Native tooltip on hover
      onClick={onClick}
      className={`p-2 rounded-md transition-all ${
        active ? "bg-pd-red text-white" : "hover:bg-slate-700 text-slate-300"
      }`}
    >
      {children}
    </button>
  );
}
