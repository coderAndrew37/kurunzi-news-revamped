"use client";

import Link from "next/link";
import SearchBar from "./SearchBar";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";

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
  const [searchOpen, setSearchOpen] = useState(false);

  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 8);

      if (currentY > lastScrollY.current && currentY > 120) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const today = new Date().toLocaleDateString("en-KE", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const hasCategories = categories.length > 0;

  return (
    <>
      {/* Fullscreen Mobile Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 bg-white z-50 md:hidden">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Search</h3>
              <button
                aria-label="close search"
                onClick={() => setSearchOpen(false)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
            <SearchBar />
          </div>
        </div>
      )}

      <header
        className={[
          "sticky top-0 z-40 transition-transform duration-300 bg-white",
          hidden ? "-translate-y-full" : "translate-y-0",
        ].join(" ")}
      >
        {/* Main Header */}
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              {/* Logo & Date */}
              <div className="flex items-center space-x-4 lg:space-x-8">
                <Link href="/" className="group">
                  <div className="flex flex-col">
                    <span className="text-2xl lg:text-3xl font-black text-gray-900 group-hover:opacity-90 transition-opacity">
                      KURUNZI
                      <span className="text-red-600">NEWS</span>
                    </span>
                    <span className="text-xs text-gray-500 font-medium tracking-wide mt-0.5">
                      {today}
                    </span>
                  </div>
                </Link>

                {/* Desktop Date Separator */}
                <div className="hidden lg:block h-6 w-px bg-gray-300" />

                {/* Desktop Slogan/Tagline */}
                <span className="hidden lg:block text-sm text-gray-600 font-medium">
                  Independent • Trusted • Timely
                </span>
              </div>

              {/* Desktop Search & Actions */}
              <div className="hidden lg:flex items-center space-x-6">
                <div className="w-80">
                  <SearchBar />
                </div>
                <div className="flex items-center space-x-4">
                  <Link
                    href="/subscribe"
                    className="px-5 py-2 bg-red-600 text-white text-sm font-bold uppercase tracking-wider hover:bg-red-700 transition-colors"
                  >
                    Subscribe
                  </Link>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-gray-900 text-sm font-medium"
                  >
                    Sign In
                  </Link>
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="flex items-center lg:hidden space-x-4">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-gray-700 hover:text-gray-900"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>
                {hasCategories && (
                  <button
                    onClick={() => setOpen((v) => !v)}
                    className="p-2 text-gray-700 hover:text-gray-900"
                    aria-label="Menu"
                  >
                    {open ? <X size={24} /> : <Menu size={24} />}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav
          className={[
            "bg-white border-b border-gray-200 transition-all",
            scrolled ? "shadow-sm" : "",
          ].join(" ")}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex">
              {/* Home Link */}
              <Link
                href="/"
                className={[
                  "px-6 py-3.5 text-sm font-bold uppercase tracking-wider transition-colors relative",
                  pathname === "/"
                    ? "text-red-600"
                    : "text-gray-700 hover:text-red-600",
                ].join(" ")}
              >
                Home
                {pathname === "/" && (
                  <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-red-600" />
                )}
              </Link>

              {/* Desktop Categories */}
              {hasCategories && (
                <div className="hidden lg:flex items-center">
                  {categories.map((cat) => {
                    const active = pathname === `/${cat.slug}`;
                    return (
                      <Link
                        key={cat.slug}
                        href={`/${cat.slug}`}
                        className={[
                          "relative px-5 py-3.5 text-sm font-semibold uppercase tracking-wide transition-colors",
                          "text-gray-700 hover:text-red-600",
                          "border-l border-gray-100",
                          active && "text-red-600 font-bold",
                        ].join(" ")}
                      >
                        {cat.title}
                        {active && (
                          <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-red-600" />
                        )}
                      </Link>
                    );
                  })}

                  {/* More dropdown for extra categories if needed */}
                  {categories.length > 8 && (
                    <div className="relative group">
                      <button className="flex items-center px-5 py-3.5 text-sm font-semibold uppercase tracking-wide text-gray-700 hover:text-red-600 border-l border-gray-100">
                        More
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {hasCategories && (
            <div
              className={[
                "lg:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white",
                open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
              ].join(" ")}
            >
              <div className="px-4 py-3 space-y-1 border-t border-gray-200">
                <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Categories
                </div>
                {categories.map((cat) => {
                  const active = pathname === `/${cat.slug}`;
                  return (
                    <Link
                      key={cat.slug}
                      href={`/${cat.slug}`}
                      onClick={() => setOpen(false)}
                      className={[
                        "block px-3 py-3 text-sm font-semibold uppercase tracking-wide transition-colors rounded-lg",
                        active
                          ? "bg-red-50 text-red-600"
                          : "text-gray-700 hover:bg-gray-50 hover:text-red-600",
                      ].join(" ")}
                    >
                      {cat.title}
                    </Link>
                  );
                })}

                {/* Mobile Additional Links */}
                <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
                  <Link
                    href="/subscribe"
                    onClick={() => setOpen(false)}
                    className="block px-3 py-3 bg-red-600 text-white text-sm font-bold uppercase tracking-wider text-center rounded-lg hover:bg-red-700"
                  >
                    Subscribe Now
                  </Link>
                  <div className="flex space-x-4 px-3">
                    <Link
                      href="/about"
                      onClick={() => setOpen(false)}
                      className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                    >
                      About
                    </Link>
                    <Link
                      href="/contact"
                      onClick={() => setOpen(false)}
                      className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                    >
                      Contact
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
