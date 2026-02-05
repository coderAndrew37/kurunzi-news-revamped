"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="bg-pd-red/10 p-4 rounded-full mb-6">
        <div className="w-12 h-12 text-pd-red flex items-center justify-center text-3xl font-bold">!</div>
      </div>
      <h2 className="text-2xl font-black uppercase text-slate-900 mb-2">
        Signal Interrupted
      </h2>
      <p className="text-slate-600 mb-8 max-w-sm">
        We encountered a technical glitch while fetching this story.
      </p>
      <button
        onClick={() => reset()}
        className="bg-pd-red text-white px-8 py-3 font-black uppercase tracking-tighter hover:bg-black transition-all"
      >
        Refresh Feed
      </button>
    </main>
  );
}