"use client";

import { searchArticlesAction } from "@/lib/actions/searchArticle";
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
        // Call the Server Action instead of the direct Sanity API
        const data = await searchArticlesAction(term);
        setResults(data);
        setLoading(false);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [term]);

  return (
    <div className="absolute top-12 left-0 w-80 bg-white border border-slate-200 shadow-2xl rounded-2xl z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl mb-4 border border-slate-100 focus-within:border-red-200 transition-all">
        <Search size={16} className="text-slate-400" />
        <input
          autoFocus
          placeholder="Search articles to link..."
          className="bg-transparent outline-none text-sm w-full font-medium"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        {loading && <Loader2 size={14} className="animate-spin text-red-600" />}
      </div>

      <div className="max-h-60 overflow-y-auto space-y-1 custom-scrollbar">
        {results.map((post) => (
          <button
            key={post._id}
            type="button"
            onClick={() =>
              onSelect(`/${post.category}/${post.slug}`, post.title)
            }
            className="w-full text-left p-3 hover:bg-red-50 rounded-xl transition-all group"
          >
            <p className="text-xs font-black text-slate-700 group-hover:text-red-700 line-clamp-1">
              {post.title}
            </p>
            <div className="flex justify-between items-center mt-1">
              <span className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">
                {post.category}
              </span>
              <span className="text-[9px] text-slate-300 font-bold">
                {new Date(post.publishedAt).getFullYear()}
              </span>
            </div>
          </button>
        ))}

        {term.length > 2 && results.length === 0 && !loading && (
          <div className="text-center py-6">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              No results found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
