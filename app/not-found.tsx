import Link from "next/link";
import { MoveLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-9xl font-black text-slate-100">404</h1>
        <div className="relative -mt-16">
          <h2 className="text-3xl font-black uppercase text-slate-900 mb-4">
            Headline Missing
          </h2>
          <p className="text-slate-600 mb-8">
            The story you are looking for has been moved or doesn&apos;t exist. 
            Check our latest headlines instead.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/" 
              className="bg-black text-white px-6 py-3 font-bold uppercase text-sm flex items-center justify-center gap-2 hover:bg-pd-red transition-colors"
            >
              <MoveLeft size={18} /> Back to Home
            </Link>
            <Link 
              href="/search" 
              className="border-2 border-black px-6 py-3 font-bold uppercase text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
            >
              <Search size={18} /> Search News
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}