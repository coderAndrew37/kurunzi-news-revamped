import { JSONContent } from "@tiptap/react";
import { ReactNode } from "react";
import { TypedObject } from "@portabletext/types";

// --- ARTICLE CORE TYPES ---

export type ArticleStatus =
  | "draft"
  | "pending_review"
  | "rejected"
  | "approved";

export interface WriterDraft {
  id?: string;
  slug?: string;
  title: string;
  excerpt: string;
  category: string;
  featuredImage: string | File | null;
  // Editorial Metadata
  imageCaption?: string;
  imageSource?: string;
  imageAlt?: string;
  isBreaking?: boolean;
  siteContext?: string;
  // Content & Status
  content: JSONContent;
  status: ArticleStatus;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
  editorNotes?: string;
}

// --- UI & TOOLBAR TYPES ---

export interface ToolbarButtonProps {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
  title?: string; // Added for hover tooltips (Display Title)
}

export interface InternalLink {
  title: string;
  category: string;
  slug: string;
}

// --- TIPTAP JSON STRUCTURE ---

export interface TiptapNode {
  type:
    | "paragraph"
    | "heading"
    | "blockquote"
    | "bulletList"
    | "orderedList"
    | "listItem"
    | "youtube"
    | "image"
    | "text";
  attrs?: {
    level?: number;
    src?: string;
    alt?: string;
    caption?: string; // For Inline Images
    source?: string; // For Image Photo Credit/Source
    href?: string;
    url?: string; // For YouTube videos
  };
  content?: TiptapNode[];
  text?: string;
  marks?: Array<{
    type: string;
    attrs?: Record<string, any>;
  }>;
}

// --- SANITY PORTABLE TEXT STRUCTURE ---

export interface SanityBlock extends TypedObject {
  _type: "block";
  _key: string;
  style: "normal" | "h2" | "h3" | "blockquote";
  children: SanitySpan[];
  markDefs: MarkDefinition[];
  listItem?: "bullet" | "number";
}

export interface SanitySpan {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
}

export interface MarkDefinition {
  _key: string;
  _type: "link";
  href: string;
}

export interface SanityYoutubeBlock extends TypedObject {
  _type: "youtube";
  _key: string;
  url: string;
  videoCaption?: string;
}

export interface SanityImageBlock extends TypedObject {
  _type: "inlineImage";
  _key: string;
  alt: string;
  caption?: string;
  attribution?: string; // Maps to Tiptap 'source' / Writer 'imageSource'
  _tempUrl?: string; // Used only during transition
  asset?: {
    _type: "reference";
    _ref: string;
  };
}

// --- API & WORKFLOW TYPES ---

export type ActionResponse = {
  success: boolean;
  articleId?: string;
  error?: string | Record<string, string[]>; // Generic or Zod flattened errors
  warning?: string;
};

export interface WorkflowItem {
  id: string;
  title: string;
  status: ArticleStatus;
  category: string;
  updated_at: string;
  site_context: string;
  is_breaking: boolean;
}

export interface SanityCategory {
  _id: string;
  title: string;
  slug: string;
}

export interface SanitySiteContext {
  title: string;
  value: string;
}

export interface EditorMetadata {
  categories: SanityCategory[];
  siteContexts: SanitySiteContext[];
}
