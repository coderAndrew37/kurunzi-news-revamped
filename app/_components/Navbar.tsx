"use client";

import Link from "next/link";
import SearchBar from "./SearchBar";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

interface Category {
  slug: string;
  title: string;
}

export default function Navbar({
  categories = [],
}: {
  categories?: Category[];
}) {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  const lastScrollY = useRef(0);

  /* Scroll behavior: shadow + auto-hide */
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;

      setScrolled(currentY > 8);

      if (currentY > lastScrollY.current && currentY > 120) {
        setHidden(true); // scrolling down
      } else {
        setHidden(false); // scrolling up
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const today = new Date().toLocaleDateString("en-KE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hasCategories = categories.length > 0;

  return (
    <header
      className={[
        "sticky top-0 z-50 transition-transform duration-300",
        hidden ? "-translate-y-full" : "translate-y-0",
      ].join(" ")}
    >
      {/* Top Tier */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex flex-col">
            <Link
              href="/"
              className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-black"
            >
              KURUNZI<span className="text-pd-red">NEWS</span>
            </Link>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
              {today}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <SearchBar />
          </div>

          {/* Mobile menu button */}
          {hasCategories && (
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden text-black"
              aria-label="Toggle menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav
        className={[
          "bg-pd-nav backdrop-blur transition-all duration-300",
          scrolled ? "shadow-lg bg-opacity-90" : "shadow-sm bg-opacity-100",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto flex items-center">
          {/* Home */}
          <Link
            href="/"
            className={[
              "px-6 py-3 font-black text-sm uppercase transition",
              pathname === "/"
                ? "bg-pd-red text-white"
                : "bg-pd-red text-white hover:bg-black",
            ].join(" ")}
          >
            Home
          </Link>

          {/* Desktop categories */}
          {hasCategories && (
            <div className="hidden md:flex items-center">
              {categories.map((cat) => {
                const active = pathname === `/${cat.slug}`;
                return (
                  <Link
                    key={cat.slug}
                    href={`/${cat.slug}`}
                    className={[
                      "relative px-5 py-3 text-xs md:text-sm font-black uppercase whitespace-nowrap transition",
                      "text-slate-800 hover:text-pd-red",
                      "border-r border-black/5",
                      active && "text-pd-red",
                    ].join(" ")}
                  >
                    {cat.title}
                    {active && (
                      <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-pd-red" />
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Mobile menu (animated slide-down) */}
        {hasCategories && (
          <div
            className={[
              "md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out",
              open ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
            ].join(" ")}
          >
            <div className="bg-pd-nav border-t shadow-lg">
              {categories.map((cat) => {
                const active = pathname === `/${cat.slug}`;
                return (
                  <Link
                    key={cat.slug}
                    href={`/${cat.slug}`}
                    onClick={() => setOpen(false)}
                    className={[
                      "block px-4 py-3 text-sm font-bold uppercase transition",
                      "border-b border-black/5",
                      active
                        ? "text-pd-red bg-white"
                        : "text-slate-800 hover:text-pd-red hover:bg-white",
                    ].join(" ")}
                  >
                    {cat.title}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
