"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery("");
    }
  };

  return (
    <div className="relative flex items-center">
      {isOpen ? (
        <form 
          onSubmit={handleSearch}
          className="absolute right-0 flex items-center bg-white border-2 border-black rounded-full overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300"
        >
          <input
            aria-label="Search news"
            autoFocus
            type="text"
            placeholder="Search news..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-4 py-1.5 w-48 md:w-64 text-sm text-black focus:outline-none"
          />
          <button 
            aria-label="close search bar"
            type="button" 
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-black"
          >
            <X size={18} />
          </button>
        </form>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-black"
          aria-label="Open search"
        >
          <Search size={22} />
        </button>
      )}
    </div>
  );
}