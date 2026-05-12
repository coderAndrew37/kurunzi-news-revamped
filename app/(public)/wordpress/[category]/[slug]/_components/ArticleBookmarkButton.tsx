// app/(public)/wordpress/[category]/[slug]/_components/ArticleBookmarkButton.tsx
// Fix: useEffect calling setState synchronously is an ESLint anti-pattern.
// Solution: initialise state lazily from localStorage using the useState
// initialiser function. This runs once on mount, synchronously, before
// the first render — no effect needed at all for reading localStorage.
"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";

interface Props {
  slug: string;
}

function getBookmarks(): string[] {
  try {
    return JSON.parse(localStorage.getItem("kn_bookmarks") ?? "[]");
  } catch {
    return [];
  }
}

export default function ArticleBookmarkButton({ slug }: Props) {
  // Lazy initialiser — runs once on mount, reads localStorage synchronously
  // before first render. No useEffect needed.
  const [bookmarked, setBookmarked] = useState<boolean>(
    () => getBookmarks().includes(slug),
  );

  const toggle = () => {
    const next = !bookmarked;
    setBookmarked(next);
    const saved = getBookmarks();
    localStorage.setItem(
      "kn_bookmarks",
      JSON.stringify(next ? [...saved, slug] : saved.filter((s) => s !== slug)),
    );
  };

  return (
    <button
      onClick={toggle}
      className="kn-action-btn"
      style={{
        borderColor: bookmarked ? "var(--accent)" : "var(--rule)",
        color: bookmarked ? "var(--accent)" : "var(--ink-soft)",
      }}
      aria-label={bookmarked ? "Remove bookmark" : "Save article"}
    >
      <Bookmark size={14} fill={bookmarked ? "currentColor" : "none"} />
      <span>{bookmarked ? "Saved" : "Save"}</span>
    </button>
  );
}