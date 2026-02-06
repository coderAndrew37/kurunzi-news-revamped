"use client";

import { searchArticles } from "@/lib/sanity/api";
import { Post } from "@/types";
import { Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function LinkSearch({
  onSelect,
  onClose,
}: {
  onSelect: (url: string, title: string) => void;
  onClose: () => void;
}) {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (term.length > 2) {
        setLoading(true);
        const data = await searchArticles(term);
        setResults(data);
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [term]);

  return (
    <div className="absolute top-12 left-0 w-80 bg-white border border-slate-200 shadow-2xl rounded-xl z-50 p-4">
      <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg mb-4">
        <Search size={16} className="text-slate-400" />
        <input
          autoFocus
          placeholder="Search articles to link..."
          className="bg-transparent outline-none text-sm w-full"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        {loading && <Loader2 size={14} className="animate-spin text-pd-red" />}
      </div>

      <div className="max-h-60 overflow-y-auto space-y-2 no-scrollbar">
        {results.map((post) => (
          <button
            key={post._id}
            onClick={() =>
              onSelect(`/${post.categoryTitle}/${post.slug}`, post.title)
            }
            className="w-full text-left p-2 hover:bg-slate-50 rounded-md transition-colors"
          >
            <p className="text-xs font-bold line-clamp-1">{post.title}</p>
            <span className="text-[10px] uppercase text-slate-400 font-bold">
              {post.slug.current} -{" "}
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                year: "2-digit",
              })}
            </span>
          </button>
        ))}
        {term.length > 2 && results.length === 0 && !loading && (
          <p className="text-center text-[10px] text-slate-400 py-4 font-bold">
            No articles found.
          </p>
        )}
      </div>
    </div>
  );
}
