import Link from "@tiptap/extension-link";

export const CustomLink = Link.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      "data-internal-link": {
        default: null,
        parseHTML: (element) => element.getAttribute("data-internal-link"),
        renderHTML: (attributes) => {
          if (!attributes["data-internal-link"]) return {};
          return { "data-internal-link": attributes["data-internal-link"] };
        },
      },
    };
  },
});
