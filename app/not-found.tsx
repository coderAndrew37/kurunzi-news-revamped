// app/not-found.tsx
// 404 page — pure Tailwind, red-600 accent, matches site palette.

import { Home, Search } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-24">
      <div className="max-w-xl w-full text-center">

        {/* Visual */}
        <div className="mb-8 relative inline-block">
          <span className="text-[12rem] font-black leading-none text-gray-100 select-none tracking-tighter">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 shadow-lg">
              Out of Bounds
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-gray-900 mb-5 leading-none">
          This story is{' '}
          <span className="text-red-600">off the pitch.</span>
        </h1>

        <p className="text-base sm:text-lg text-gray-500 italic leading-relaxed mb-10">
          The page you&apos;re looking for may have been moved, deleted, or the
          URL changed during our digital stadium upgrade.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-gray-900 text-white px-8 py-3.5 font-bold text-xs uppercase tracking-widest transition-colors rounded-full"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            Back to Home
          </Link>
          <Link
            href="/search"
            className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-red-600 text-red-600 hover:bg-red-50 px-8 py-3.5 font-bold text-xs uppercase tracking-widest transition-colors rounded-full"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            Search Archive
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-14 pt-8 border-t border-gray-200">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
            Try these categories
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {['Football', 'Athletics', 'Rugby', 'Basketball'].map((cat) => (
              <Link
                key={cat}
                href={`/${cat.toLowerCase()}`}
                className="text-sm font-bold uppercase text-gray-600 hover:text-red-600 transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}