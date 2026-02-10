"use client";

import { Editor } from "@tiptap/react";
import {
  Bold,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Image as ImageIcon,
  Link as LinkIcon,
  Quote,
  Type,
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

  return (
    <div className="flex flex-wrap items-center gap-1 p-1">
      <ToolbarButton
        title="Normal Text"
        onClick={() => editor.chain().focus().setParagraph().run()}
        active={editor.isActive("paragraph")}
      >
        <Type size={18} />
      </ToolbarButton>

      <div className="w-px h-4 bg-slate-200 mx-1" />

      <ToolbarButton
        title="Heading 2"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
      >
        <Heading2 size={18} />
      </ToolbarButton>

      <ToolbarButton
        title="Heading 3"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
      >
        <Heading3 size={18} />
      </ToolbarButton>

      <div className="w-px h-4 bg-slate-200 mx-1" />

      <ToolbarButton
        title="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
      >
        <Bold size={18} />
      </ToolbarButton>

      <ToolbarButton
        title="Bullet List"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
      >
        <List size={18} />
      </ToolbarButton>

      <ToolbarButton
        title="Numbered List"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
      >
        <ListOrdered size={18} />
      </ToolbarButton>

      <ToolbarButton
        title="Blockquote"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
      >
        <Quote size={18} />
      </ToolbarButton>

      <div className="w-px h-4 bg-slate-200 mx-1" />

      <ToolbarButton title="Insert Image" onClick={onImageClick}>
        <ImageIcon size={18} />
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
            onSelect={(url, title) => {
              if (editor.state.selection.empty) {
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
            }}
            onClose={() => setShowLinkSearch(false)}
          />
        )}
      </div>
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
      title={title}
      onClick={onClick}
      className={`p-2 rounded-xl transition-all ${
        active
          ? "bg-slate-900 text-white shadow-sm"
          : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"
      }`}
    >
      {children}
    </button>
  );
}
