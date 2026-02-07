"use client";

import { createClient } from "@/lib/utils/supabase/client";
import { X, Hash, Plus, Command } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface Suggestion {
  name: string;
}

export default function TagSelector({
  selectedTags,
  onTagsChange,
}: {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchTags = async () => {
      const { data } = await supabase.rpc("search_tags", {
        search_query: query,
      });
      if (data) setSuggestions(data);
    };

    const debounce = setTimeout(fetchTags, 200);
    return () => clearTimeout(debounce);
  }, [query, supabase]);

  const addTag = (tagName: string) => {
    const cleanTag = tagName.trim();
    if (
      cleanTag &&
      !selectedTags.includes(cleanTag) &&
      selectedTags.length < 8
    ) {
      onTagsChange([...selectedTags, cleanTag]);
    }
    setQuery("");
    setSuggestions([]);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > -1 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        addTag(suggestions[activeIndex].name);
      } else {
        addTag(query);
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
    }
  };

  return (
    <div className="w-full">
      {/* Active Tags Display */}
      <div className="flex flex-wrap gap-2 mb-4 min-h-10 items-center p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
        {selectedTags.length === 0 && (
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-2">
            No keywords attached
          </span>
        )}
        {selectedTags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-tight text-slate-700 shadow-sm animate-in fade-in zoom-in duration-200"
          >
            <Hash size={10} className="text-red-500" />
            {tag}
            <button
              aria-label="filter selected tags"
              type="button"
              onClick={() =>
                onTagsChange(selectedTags.filter((t) => t !== tag))
              }
              className="hover:bg-red-50 p-0.5 rounded-full transition-colors group"
            >
              <X
                size={12}
                className="group-hover:text-red-600 text-slate-400"
              />
            </button>
          </span>
        ))}
      </div>

      {/* Input Field */}
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-500 transition-colors">
          <Plus size={18} />
        </div>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type to search or enter new topic..."
          className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none ring-offset-0 focus:ring-4 focus:ring-red-500/5 focus:border-red-500/50 transition-all"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 opacity-20 group-focus-within:opacity-100 transition-opacity">
          <Command size={12} className="text-slate-400" />
          <span className="text-[10px] font-black text-slate-400">ENTER</span>
        </div>

        {/* Suggestions Dropdown */}
        {(suggestions.length > 0 ||
          (query.length >= 2 &&
            !suggestions.some(
              (s) => s.name.toLowerCase() === query.toLowerCase(),
            ))) && (
          <div className="absolute z-50 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl mt-2 py-2 overflow-hidden animate-in slide-in-from-top-2 duration-200">
            {suggestions.map((s, index) => (
              <button
                type="button"
                key={s.name}
                onClick={() => addTag(s.name)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`w-full text-left px-5 py-3 flex items-center justify-between transition-colors ${
                  activeIndex === index
                    ? "bg-red-50 text-red-700"
                    : "text-slate-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Hash
                    size={14}
                    className={
                      activeIndex === index ? "text-red-500" : "text-slate-300"
                    }
                  />
                  <span className="text-sm font-bold">{s.name}</span>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">
                  Database Topic
                </span>
              </button>
            ))}

            {/* Custom Tag Option */}
            {query.length >= 2 &&
              !suggestions.some(
                (s) => s.name.toLowerCase() === query.toLowerCase(),
              ) && (
                <button
                  type="button"
                  onClick={() => addTag(query)}
                  className={`w-full text-left px-5 py-3 flex items-center justify-between border-t border-slate-50 transition-colors ${
                    activeIndex === -1 && suggestions.length === 0
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Plus size={14} className="text-blue-500" />
                    <span className="text-sm font-bold italic">"{query}"</span>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-blue-500 bg-blue-100 px-2 py-0.5 rounded">
                    Create New
                  </span>
                </button>
              )}
          </div>
        )}
      </div>

      {/* Limit indicator */}
      <p className="mt-2 ml-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
        {selectedTags.length}/8 Topics Selected
      </p>
    </div>
  );
}
