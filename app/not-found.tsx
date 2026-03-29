import { Home, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[80-vh] flex items-center justify-center bg-[#fdfcfb] px-4 py-24">
      <div className="max-w-xl w-full text-center">
        {/* Visual Element */}
        <div className="mb-8 relative inline-block">
          <span className="text-[12rem] font-black leading-none text-[#e8e2da] select-none uppercase tracking-tighter">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="kn-kicker bg-[#1a5c38] text-white px-4 py-1 rounded-sm shadow-xl">
              Out of Bounds
            </span>
          </div>
        </div>

        {/* Messaging */}
        <h1 className="kn-headline text-3xl md:text-5xl mb-6 uppercase tracking-tighter">
          This story is <span className="text-[#1a5c38]">off the pitch.</span>
        </h1>

        <p className="font-['Source_Serif_4'] text-lg text-[#7a736c] mb-12 italic leading-relaxed">
          The page you are looking for might have been moved, deleted, or the
          URL might have changed during our digital stadium upgrade.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="kn-action-btn w-full sm:w-auto bg-[#1a5c38] text-white px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:bg-black transition-all"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>

          <Link
            href="/search"
            className="kn-action-btn w-full sm:w-auto border-2 border-[#1a5c38] text-[#1a5c38] px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:bg-[#f7f4f0] transition-all"
          >
            <Search className="w-4 h-4" />
            Search Archive
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-16 pt-8 border-t border-[#e8e2da]">
          <p className="font-['Barlow_Condensed'] text-[10px] font-bold text-[#b5aea7] uppercase tracking-[0.3em] mb-4">
            Try these categories
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/football"
              className="text-sm font-bold uppercase hover:text-[#1a5c38]"
            >
              Football
            </Link>
            <Link
              href="/athletics"
              className="text-sm font-bold uppercase hover:text-[#1a5c38]"
            >
              Athletics
            </Link>
            <Link
              href="/rugby"
              className="text-sm font-bold uppercase hover:text-[#1a5c38]"
            >
              Rugby
            </Link>
            <Link
              href="/basketball"
              className="text-sm font-bold uppercase hover:text-[#1a5c38]"
            >
              Basketball
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
