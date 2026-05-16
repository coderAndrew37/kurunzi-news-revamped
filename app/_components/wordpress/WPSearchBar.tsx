"use client";

// app/_components/wordpress/WPSearchBar.tsx
// Controlled search form with live suggestions dropdown.
// Suggestions are debounced (300 ms) to avoid hammering the API.
// Keyboard navigation: ArrowDown/Up moves through results, Enter selects,
// Escape closes. Click outside also closes.

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { searchArticles } from "@/lib/wordpress/data";
import type { SportsPost } from "@/lib/wordpress/types";
import Image from "next/image";

interface SearchBarProps {
  /** Pre-fill the input — pass the current ?q= value on the search page. */
  defaultValue?: string;
  /** Called after a search is submitted or a suggestion is chosen. */
  onSubmit?: () => void;
  placeholder?: string;
}

export default function SearchBar({
  defaultValue = "",
  onSubmit,
  placeholder = "Search stories, players, teams…",
}: SearchBarProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<SportsPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Fetch suggestions (debounced) ────────────────────────────────────────
  const fetchSuggestions = useCallback(async (term: string) => {
    if (term.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const results = await searchArticles(term);
      setSuggestions(results.slice(0, 5));
      setOpen(results.length > 0);
    } catch {
      setSuggestions([]);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setActiveIndex(-1);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  // ── Submit (navigate to search page) ─────────────────────────────────────
  const navigate = useCallback(
    (term: string) => {
      if (!term.trim()) return;
      setOpen(false);
      onSubmit?.();
      router.push(`/search?q=${encodeURIComponent(term.trim())}`);
    },
    [router, onSubmit],
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(query);
  };

  // ── Choose a suggestion ───────────────────────────────────────────────────
  const chooseSuggestion = (post: SportsPost) => {
    setQuery(post.title);
    setOpen(false);
    onSubmit?.();
    router.push(`/${post.category.toLowerCase()}/${post.slug}`);
  };

  // ── Keyboard navigation ───────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      chooseSuggestion(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  // ── Close on outside click ────────────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearQuery = () => {
    setQuery("");
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form
        onSubmit={handleSubmit}
        method="GET"
        action="/search"
        role="search"
        className="relative flex items-center w-full"
      >
        <label htmlFor="navbar-search" className="sr-only">
          Search Kurunzi Sports
        </label>

        <div className="relative flex-1">
          {/* Search icon */}
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--ink-faint] pointer-events-none"
            aria-hidden
          />

          <input
            ref={inputRef}
            id="navbar-search"
            name="q"
            type="search"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoComplete="off"
            aria-autocomplete="list"
            aria-controls={open ? "search-suggestions" : undefined}
            aria-activedescendant={
              activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined
            }
            aria-expanded={open}
            role="combobox"
            className={[
              "w-full h-9 pl-9",
              // Show clear button only when there's text
              query ? "pr-8" : "pr-3",
              "bg-[--paper-warm] border border-[--rule]",
              "font-['Source_Serif_4'] text-sm text-[--ink] placeholder:text-[--ink-faint]",
              "focus:outline-none focus:border-[--accent] focus:bg-white",
              "transition-colors",
            ].join(" ")}
          />

          {/* Right-side: loader or clear button */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
            {loading ? (
              <Loader2
                className="w-4 h-4 text-[--ink-faint] animate-spin"
                aria-hidden
              />
            ) : query ? (
              <button
                type="button"
                onClick={clearQuery}
                aria-label="Clear search"
                className="p-0.5 text-[--ink-faint] hover:text-[--ink] transition-colors"
              >
                <X className="w-3.5 h-3.5" aria-hidden />
              </button>
            ) : null}
          </div>
        </div>

        {/* Visually hidden submit — Enter key triggers it */}
        <button type="submit" className="sr-only">
          Search
        </button>
      </form>

      {/* ── Suggestions Dropdown ────────────────────────────────────────────── */}
      {open && suggestions.length > 0 && (
        <ul
          id="search-suggestions"
          role="listbox"
          aria-label="Search suggestions"
          className={[
            "absolute top-full left-0 right-0 z-50 mt-1",
            "bg-white border border-[--rule] shadow-lg",
            "divide-y divide-[--rule]",
            "overflow-hidden",
            // Subtle entrance animation via Tailwind (opacity + translate)
            "animate-in fade-in slide-in-from-top-1 duration-150",
          ].join(" ")}
        >
          {suggestions.map((post, i) => (
            <li
              key={post.slug}
              id={`suggestion-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(-1)}
              onClick={() => chooseSuggestion(post)}
              className={[
                "flex items-start gap-3 px-3 py-2.5 cursor-pointer transition-colors",
                i === activeIndex
                  ? "bg-[--paper-warm]"
                  : "hover:bg-[--paper-warm]",
              ].join(" ")}
            >
              {/* Thumbnail */}
              {post.featuredImage ? (
                <Image
                  src={post.featuredImage}
                  alt=""
                  aria-hidden
                  className="w-10 h-10 object-cover flex-shrink-0 mt-0.5"
                  fill
                />
              ) : (
                <div
                  className="w-10 h-10 bg-[--paper-warm] border border-[--rule] flex-shrink-0 mt-0.5 flex items-center justify-center"
                  aria-hidden
                >
                  <Search className="w-3.5 h-3.5 text-[--ink-faint]" />
                </div>
              )}

              {/* Text */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[--ink] font-['Barlow_Condensed'] uppercase tracking-wide leading-tight line-clamp-1">
                  {post.title}
                </p>
                <p className="text-xs text-[--ink-muted] font-['Barlow_Condensed'] mt-0.5 uppercase tracking-wider">
                  {post.category}
                </p>
              </div>
            </li>
          ))}

          {/* "See all results" footer */}
          <li
            role="option"
            aria-selected={false}
            onClick={() => navigate(query)}
            className="flex items-center justify-between px-3 py-2 cursor-pointer bg-[--paper-warm] hover:bg-[--rule] transition-colors"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-[--ink-soft] font-['Barlow_Condensed']">
              See all results for &quot;{query}&quot;
            </span>
            <Search className="w-3 h-3 text-[--ink-faint]" aria-hidden />
          </li>
        </ul>
      )}
    </div>
  );
}
