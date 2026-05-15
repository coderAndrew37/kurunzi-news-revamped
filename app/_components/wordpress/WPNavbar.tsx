"use client";

// app/_components/wordpress/WPNavbar.tsx

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import SearchBar from "./WPSearchBar";

interface Category {
  slug: string;
  title: string;
}

// useLayoutEffect is correct here: it fires synchronously after DOM mutations,
// before paint, which is exactly when we want to close menus after navigation.
// On the server React skips it silently, so no SSR mismatch warning.
// We avoid the "setState in effect body" lint error because the condition
// `prevPathname.current !== pathname` means setState is never called on mount —
// only when the route genuinely changes.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

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
  const prevPathname = useRef(pathname);

  useIsomorphicLayoutEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setOpen(false);
      setSearchOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 8);
      setHidden(currentY > lastScrollY.current && currentY > 120);
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
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
      {/* ── Fullscreen Mobile Search Overlay ─────────────────────────────── */}
      {searchOpen && (
        <div
          className="fixed inset-0 bg-white z-50 md:hidden"
          role="dialog"
          aria-label="Search"
          aria-modal="true"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-['Barlow_Condensed'] font-bold uppercase tracking-widest text-sm text-[--ink]">
                Search
              </h2>
              <button
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
                className="p-2 hover:bg-[--paper-warm] rounded transition-colors"
              >
                <X size={20} aria-hidden />
              </button>
            </div>
            <SearchBar onSubmit={() => setSearchOpen(false)} />
          </div>
        </div>
      )}

      <header
        className={[
          "sticky top-0 z-40 transition-transform duration-300 bg-white",
          hidden ? "-translate-y-full" : "translate-y-0",
        ].join(" ")}
      >
        {/* ── Main Header ──────────────────────────────────────────────────── */}
        <div className="border-b border-[--rule]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">

              {/* Logo & Date */}
              <div className="flex items-center space-x-4 lg:space-x-8">
                <Link href="/" className="group">
                  <div className="flex flex-col">
                    <span className="text-2xl lg:text-3xl font-black text-[--ink] group-hover:opacity-90 transition-opacity font-['Barlow_Condensed'] uppercase tracking-tight">
                      KURUNZI
                      <span className="text-[#dc2626]"> SPORTS</span>
                    </span>
                    <span className="text-xs text-[--ink-muted] font-['Barlow_Condensed'] tracking-wide mt-0.5">
                      {today}
                    </span>
                  </div>
                </Link>

                <div className="hidden lg:block h-6 w-px bg-[--rule]" aria-hidden />

                <span className="hidden lg:block text-sm text-[--ink-muted] font-['Source_Serif_4'] italic">
                  Independent · Trusted · Timely
                </span>
              </div>

              {/* Desktop Search & Actions */}
              <div className="hidden lg:flex items-center space-x-6">
                <div className="w-72">
                  <SearchBar />
                </div>
                <div className="flex items-center space-x-4">
                  <Link
                    href="/subscribe"
                    className="px-5 py-2 bg-[#dc2626] text-white text-sm font-bold uppercase tracking-wider hover:bg-red-700 transition-colors font-['Barlow_Condensed']"
                  >
                    Subscribe
                  </Link>
                  <Link
                    href="/login"
                    className="text-[--ink-soft] hover:text-[--ink] text-sm font-medium font-['Barlow_Condensed']"
                  >
                    Sign In
                  </Link>
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="flex items-center lg:hidden space-x-2">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-[--ink-soft] hover:text-[--ink] transition-colors"
                  aria-label="Open search"
                >
                  <Search size={20} aria-hidden />
                </button>
                {hasCategories && (
                  <button
                    onClick={() => setOpen((v) => !v)}
                    className="p-2 text-[--ink-soft] hover:text-[--ink] transition-colors"
                    aria-label={open ? "Close menu" : "Open menu"}
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                  >
                    {open ? <X size={24} aria-hidden /> : <Menu size={24} aria-hidden />}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Category Nav Bar ─────────────────────────────────────────────── */}
        <nav
          aria-label="Site categories"
          className={[
            "bg-white border-b border-[--rule] transition-shadow",
            scrolled ? "shadow-sm" : "",
          ].join(" ")}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex">
              <Link
                href="/"
                aria-current={pathname === "/" ? "page" : undefined}
                className={[
                  "relative px-6 py-3.5 text-sm font-bold uppercase tracking-wider transition-colors font-['Barlow_Condensed']",
                  pathname === "/"
                    ? "text-[#dc2626]"
                    : "text-[--ink-soft] hover:text-[#dc2626]",
                ].join(" ")}
              >
                Home
                {pathname === "/" && (
                  <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#dc2626]" aria-hidden />
                )}
              </Link>

              {hasCategories && (
                <div className="hidden lg:flex items-center">
                  {categories.map((cat) => {
                    const active =
                      pathname === `/${cat.slug}` ||
                      pathname.startsWith(`/${cat.slug}/`);
                    return (
                      <Link
                        key={cat.slug}
                        href={`/${cat.slug}`}
                        aria-current={pathname === `/${cat.slug}` ? "page" : undefined}
                        className={[
                          "relative px-5 py-3.5 text-sm uppercase tracking-wide transition-colors border-l border-[--rule] font-['Barlow_Condensed']",
                          active
                            ? "text-[#dc2626] font-bold"
                            : "text-[--ink-soft] hover:text-[#dc2626] font-semibold",
                        ].join(" ")}
                      >
                        {cat.title}
                        {active && (
                          <span
                            className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#dc2626]"
                            aria-hidden
                          />
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── Mobile Menu ────────────────────────────────────────────────── */}
          {hasCategories && (
            <div
              id="mobile-menu"
              className={[
                "lg:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white",
                open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
              ].join(" ")}
            >
              <div className="px-4 py-3 space-y-1 border-t border-[--rule]">
                <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-[--ink-muted] font-['Barlow_Condensed']">
                  Categories
                </p>
                {categories.map((cat) => {
                  const active = pathname === `/${cat.slug}`;
                  return (
                    <Link
                      key={cat.slug}
                      href={`/${cat.slug}`}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "block px-3 py-3 text-sm font-semibold uppercase tracking-wide transition-colors rounded font-['Barlow_Condensed']",
                        active
                          ? "bg-red-50 text-[#dc2626]"
                          : "text-[--ink-soft] hover:bg-[--paper-warm] hover:text-[#dc2626]",
                      ].join(" ")}
                    >
                      {cat.title}
                    </Link>
                  );
                })}

                <div className="pt-4 mt-4 border-t border-[--rule] space-y-2">
                  <Link
                    href="/subscribe"
                    className="block px-3 py-3 bg-[#dc2626] text-white text-sm font-bold uppercase tracking-wider text-center rounded hover:bg-red-700 transition-colors font-['Barlow_Condensed']"
                  >
                    Subscribe Now
                  </Link>
                  <div className="flex space-x-4 px-3">
                    <Link
                      href="/about"
                      className="text-sm text-[--ink-muted] hover:text-[--ink] font-medium font-['Barlow_Condensed']"
                    >
                      About
                    </Link>
                    <Link
                      href="/contact"
                      className="text-sm text-[--ink-muted] hover:text-[--ink] font-medium font-['Barlow_Condensed']"
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