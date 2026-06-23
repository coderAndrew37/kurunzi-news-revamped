// app/_components/wordpress/WPNavbar.tsx
// Single-row navbar: logo left · categories center · search+action right.
// Mirrors People Daily's layout exactly.
// Hide-on-scroll-down, show-on-scroll-up.

"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import SearchBar from "./WPSearchBar";

interface Category {
  slug: string;
  title: string;
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Navbar({
  categories = [],
}: {
  categories?: Category[];
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const prevPathname = useRef(pathname);

  // Close menu + search on route change
  useIsomorphicLayoutEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setMenuOpen(false);
      setSearchOpen(false);
    }
  }, [pathname]);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 4);
      setHidden(y > lastScrollY.current && y > 80);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ── Mobile fullscreen search ─────────────────────────────────────── */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-white flex flex-col md:hidden"
          role="dialog"
          aria-label="Search"
          aria-modal="true"
        >
          <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100">
            <span
              className="text-xl font-black uppercase tracking-tight"
              style={{ fontFamily: "var(--font-ui)", color: "var(--ink)" }}
            >
              KURUNZI<span className="text-red-600"> SPORTS</span>
            </span>
            <button
              onClick={() => setSearchOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
              aria-label="Close search"
            >
              <X size={22} />
            </button>
          </div>
          <div className="px-4 pt-6">
            <SearchBar onSubmit={() => setSearchOpen(false)} />
          </div>
        </div>
      )}

      {/* ── Sticky shell — always occupies space in layout ───────────────── */}
      <header className="sticky top-0 z-40">
        <div
          className={[
            "bg-white transition-transform duration-300 ease-in-out",
            scrolled ? "shadow-sm" : "",
            hidden ? "-translate-y-full" : "translate-y-0",
          ].join(" ")}
        >
          {/* ── Single row ─────────────────────────────────────────────────── */}
          <div className="border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center h-16">
                {/* Logo — left */}
                <div className="flex-shrink-0 mr-8">
                  <Link href="/" className="group">
                    <span
                      className="text-2xl font-black uppercase tracking-tight group-hover:opacity-80 transition-opacity"
                      style={{
                        fontFamily: "var(--font-ui)",
                        color: "var(--ink)",
                      }}
                    >
                      KURUNZI
                      <span className="text-red-600"> SPORTS</span>
                    </span>
                  </Link>
                </div>

                {/* Categories — center (desktop) */}
                <nav
                  aria-label="Main navigation"
                  className="hidden lg:flex items-center flex-1 gap-0"
                >
                  {categories.map((cat) => {
                    const active =
                      pathname === `/${cat.slug}` ||
                      pathname.startsWith(`/${cat.slug}/`);
                    return (
                      <Link
                        key={cat.slug}
                        href={`/${cat.slug}`}
                        aria-current={
                          pathname === `/${cat.slug}` ? "page" : undefined
                        }
                        className={[
                          "relative px-4 py-[1.125rem] text-[13px] font-semibold uppercase tracking-wide transition-colors whitespace-nowrap",
                          active
                            ? "text-gray-900"
                            : "text-gray-500 hover:text-gray-900",
                        ].join(" ")}
                        style={{ fontFamily: "var(--font-ui)" }}
                      >
                        {cat.title}
                        {/* Active underline */}
                        {active && (
                          <span
                            className="absolute inset-x-0 bottom-0 h-[2px] bg-red-600"
                            aria-hidden
                          />
                        )}
                      </Link>
                    );
                  })}
                </nav>

                {/* Right actions — desktop */}
                <div className="hidden lg:flex items-center gap-3 ml-auto flex-shrink-0">
                  {/* Pill search input */}
                  <div className="w-52">
                    <SearchBar />
                  </div>
                  {/* ePaper / CTA button */}
                  <Link
                    href="/subscribe"
                    className="px-5 py-2 rounded-full text-white text-[13px] font-bold uppercase tracking-wide transition-colors hover:opacity-90"
                    style={{
                      background: "var(--accent)",
                      fontFamily: "var(--font-ui)",
                    }}
                  >
                    Subscribe
                  </Link>
                </div>

                {/* Right actions — mobile */}
                <div className="flex items-center gap-1 ml-auto lg:hidden">
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
                    aria-label="Search"
                  >
                    <Search size={20} />
                  </button>
                  <button
                  
                    onClick={() => setMenuOpen((v) => !v)}
                    className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-controls="mobile-nav"
                  >
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Mobile menu ────────────────────────────────────────────────── */}
          <div
            id="mobile-nav"
            className={[
              "lg:hidden bg-white border-b border-gray-100 overflow-hidden transition-all duration-300",
              menuOpen ? "max-h-[480px]" : "max-h-0",
            ].join(" ")}
          >
            <nav aria-label="Mobile navigation" className="px-4 py-4 space-y-1">
              {categories.map((cat) => {
                const active =
                  pathname === `/${cat.slug}` ||
                  pathname.startsWith(`/${cat.slug}/`);
                return (
                  <Link
                    key={cat.slug}
                    href={`/${cat.slug}`}
                    className={[
                      "flex items-center px-3 py-3 rounded text-[13px] font-semibold uppercase tracking-wide transition-colors",
                      active
                        ? "bg-red-50 text-red-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    ].join(" ")}
                    style={{ fontFamily: "var(--font-ui)" }}
                  >
                    {active && (
                      <span className="w-1 h-1 rounded-full bg-red-600 mr-2.5 flex-shrink-0" />
                    )}
                    {cat.title}
                  </Link>
                );
              })}

              <div className="pt-3 mt-3 border-t border-gray-100">
                <Link
                  href="/subscribe"
                  className="block w-full text-center py-3 rounded-full text-white text-[13px] font-bold uppercase tracking-wide"
                  style={{
                    background: "var(--accent)",
                    fontFamily: "var(--font-ui)",
                  }}
                >
                  Subscribe
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
