import {
  TiptapNode,
  SanityBlock,
  SanitySpan,
  SanityYoutubeBlock,
  SanityImageBlock,
} from "../../types/editor";

const generateKey = () => Math.random().toString(36).substring(2, 11);

export function tiptapToPortableText(nodes: TiptapNode[]): any[] {
  return nodes
    .map((node) => {
      const _key = generateKey();

      switch (node.type) {
        case "paragraph":
        case "heading":
        case "blockquote":
          return transformTextBlock(node, _key);

        case "bulletList":
        case "orderedList":
          return transformList(node);

        case "youtube":
          return {
            _type: "youtube",
            _key,
            url: node.attrs?.src || "",
            videoCaption: node.attrs?.caption,
          } as SanityYoutubeBlock;

        case "image":
          return {
            _type: "inlineImage",
            _key,
            alt: node.attrs?.alt || "News image",
            caption: node.attrs?.caption,
            attribution: node.attrs?.source,
            _tempUrl: node.attrs?.src,
          } as SanityImageBlock;

        default:
          return null;
      }
    })
    .flat()
    .filter(Boolean);
}

/**
 * Transforms standard text nodes into Sanity Block format
 */
function transformTextBlock(node: TiptapNode, _key: string): SanityBlock {
  const markDefs: any[] = [];

  const children: SanitySpan[] = (node.content || []).map((child) => {
    const spanKey = generateKey();
    const marks: string[] = [];

    child.marks?.forEach((mark) => {
      if (mark.type === "link" && mark.attrs?.href) {
        const linkKey = `link-${generateKey()}`;
        markDefs.push({ _key: linkKey, _type: "link", href: mark.attrs.href });
        marks.push(linkKey);
      } else if (mark.type === "bold") {
        // Map Tiptap 'bold' to Sanity 'strong'
        marks.push("strong");
      } else if (mark.type === "italic") {
        // Map Tiptap 'italic' to Sanity 'em'
        marks.push("em");
      } else {
        marks.push(mark.type);
      }
    });

    return {
      _type: "span",
      _key: spanKey,
      text: child.text || "",
      marks,
    };
  });

  // Fix hundefined: provide a fallback level if node.attrs.level is missing
  let style: string = "normal";
  if (node.type === "heading") {
    style = `h${node.attrs?.level || 2}`;
  } else if (node.type === "blockquote") {
    style = "blockquote";
  }

  return {
    _type: "block",
    _key,
    style: style as any,
    markDefs,
    children:
      children.length > 0
        ? children
        : [{ _type: "span", _key: generateKey(), text: "", marks: [] }],
  };
}

/**
 * Handles nested list structures
 */
function transformList(node: TiptapNode): SanityBlock[] {
  return (node.content || [])
    .map((listItem) => {
      // Tiptap lists nest content inside a listItem node
      const contentNode = listItem.content?.[0];
      if (!contentNode) return null;

      // Ensure a unique key for every block in a list to satisfy React requirements
      const block = transformTextBlock(contentNode, generateKey());
      return {
        ...block,
        listItem: node.type === "bulletList" ? "bullet" : "number",
      };
    })
    .filter(Boolean) as SanityBlock[];
}
