import { JSONContent } from "@tiptap/react";
import { ReactNode } from "react";

export type ArticleStatus =
  | "draft"
  | "pending_review"
  | "rejected"
  | "approved";

export interface WriterDraft {
  id?: string;
  title: string;
  excerpt: string;
  category: string;
  featuredImage: string | File | null;
  content: JSONContent;
  status: ArticleStatus;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ToolbarButtonProps {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
}
export interface InternalLink {
  title: string;
  category: string;
  slug: string;
}

import { TypedObject } from "@portabletext/types";

// Tiptap's JSON Structure
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
    caption?: string;
    href?: string;
  };
  content?: TiptapNode[];
  text?: string;
  marks?: Array<{
    type: string;
    attrs?: Record<string, any>;
  }>;
}

// Sanity's Portable Text Structure
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
  _tempUrl?: string; // Used only during transition
  asset?: {
    _type: "reference";
    _ref: string;
  };
}
