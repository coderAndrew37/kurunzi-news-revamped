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
            _tempUrl: node.attrs?.src,
          } as SanityImageBlock;

        default:
          return null;
      }
    })
    .flat()
    .filter(Boolean);
}

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
      } else {
        marks.push(mark.type); // e.g., 'strong', 'em'
      }
    });

    return {
      _type: "span",
      _key: spanKey,
      text: child.text || "",
      marks,
    };
  });

  return {
    _type: "block",
    _key,
    style:
      node.type === "heading"
        ? (`h${node.attrs?.level}` as any)
        : node.type === "blockquote"
          ? "blockquote"
          : "normal",
    markDefs,
    children:
      children.length > 0
        ? children
        : [{ _type: "span", _key: generateKey(), text: "", marks: [] }],
  };
}

function transformList(node: TiptapNode): SanityBlock[] {
  return (node.content || [])
    .map((listItem) => {
      // Dig into the paragraph inside the listItem
      const contentNode = listItem.content?.[0];
      if (!contentNode) return null;

      const block = transformTextBlock(contentNode, generateKey());
      return {
        ...block,
        listItem: node.type === "bulletList" ? "bullet" : "number",
      };
    })
    .filter(Boolean) as SanityBlock[];
}
