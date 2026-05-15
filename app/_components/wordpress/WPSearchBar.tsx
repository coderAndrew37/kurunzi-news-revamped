"use client";

// app/_components/SearchBar.tsx
// A controlled search form that submits GET /search?q=<term>.
// Works as a plain HTML form (no JS needed for navigation),
// but uses the router for instant client-side navigation when JS is available.

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface SearchBarProps {
  /** Pre-fill the input — pass the current ?q= value on the search page. */
  defaultValue?: string;
  /** Called after the form submits (e.g. close a mobile overlay). */
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = inputRef.current?.value.trim() ?? "";
    if (!q) return;
    onSubmit?.();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      // Fallback for no-JS: native GET navigation still works.
      method="GET"
      action="/search"
      role="search"
      className="relative flex items-center w-full"
    >
      <label htmlFor="navbar-search" className="sr-only">
        Search Kurunzi Sports
      </label>

      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--ink-faint] pointer-events-none"
          aria-hidden
        />
        <input
          ref={inputRef}
          id="navbar-search"
          name="q"
          type="search"
          defaultValue={defaultValue}
          placeholder={placeholder}
          autoComplete="off"
          className={[
            "w-full h-9 pl-9 pr-3",
            "bg-[--paper-warm] border border-[--rule]",
            "font-['Source_Serif_4'] text-sm text-[--ink] placeholder:text-[--ink-faint]",
            "focus:outline-none focus:border-[--accent] focus:bg-white",
            "transition-colors",
          ].join(" ")}
        />
      </div>

      {/* Visually hidden submit — Enter key triggers it */}
      <button type="submit" className="sr-only">
        Search
      </button>
    </form>
  );
}