"use client";

import { createClient } from "@/lib/utils/supabase/client";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export default function TagSelector({
  selectedTags,
  onTagsChange,
}: {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{ name: string }[]>([]);
  const supabase = createClient();

  // Fuzzy search existing tags as the writer types
  useEffect(() => {
    if (query.length < 2) return setSuggestions([]);

    const fetchTags = async () => {
      const { data } = await supabase.rpc("search_tags", {
        search_query: query,
      });
      if (data) setSuggestions(data);
    };

    const debounce = setTimeout(fetchTags, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const addTag = (tagName: string) => {
    const cleanTag = tagName.trim();
    if (cleanTag && !selectedTags.includes(cleanTag)) {
      onTagsChange([...selectedTags, cleanTag]);
    }
    setQuery("");
    setSuggestions([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full text-sm font-medium"
          >
            {tag}
            <button
              aria-label={`Remove tag: ${tag}`}
              onClick={() =>
                onTagsChange(selectedTags.filter((t) => t !== tag))
              }
            >
              <X size={14} className="hover:text-red-500" />
            </button>
          </span>
        ))}
      </div>

      <div className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && (e.preventDefault(), addTag(query))
          }
          placeholder="Add a topic (e.g. Nairobi, Politics)..."
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-slate-400 outline-none"
        />

        {suggestions.length > 0 && (
          <div className="absolute z-10 w-full bg-white border rounded-lg shadow-xl mt-1">
            {suggestions.map((s) => (
              <button
                key={s.name}
                onClick={() => addTag(s.name)}
                className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center justify-between"
              >
                {s.name}{" "}
                <span className="text-[10px] text-slate-400">Existing</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
