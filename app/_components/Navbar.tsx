import { fetchNavCategories } from "@/lib/sanity/api";
import Link from "next/link";
import SearchBar from "./SearchBar";

export default async function Navbar() {
  const categories = await fetchNavCategories();
  const today = new Date().toLocaleDateString("en-KE", { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  return (
    <header className="w-full bg-white border-b sticky top-0 z-50">
      {/* Top Tier: Branding & Meta */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex flex-col">
          <Link href="/" className="text-3xl md:text-4xl font-black tracking-tighter text-black uppercase">
            KURUNZI<span className="text-pd-red">NEWS</span>
          </Link>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
            {today}
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Ad Space (Hidden on Mobile) */}
          <div className="hidden lg:flex w-[468px] h-14 bg-slate-50 border border-dashed border-slate-200 items-center justify-center text-[10px] text-slate-300 uppercase font-bold">
            Advertisement
          </div>
          
          {/* Search Bar Integration */}
          <SearchBar />
        </div>
      </div>

      {/* Bottom Tier: Navigation */}
      <nav className="bg-black text-white shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center">
          <Link 
            href="/" 
            className="px-6 py-3 bg-pd-red font-black text-sm uppercase hover:bg-white hover:text-pd-red transition-all"
          >
            Home
          </Link>
          <div className="flex items-center overflow-x-auto no-scrollbar scroll-smooth">
            {categories.map((cat) => (
              <Link 
                key={cat.slug} 
                href={`/${cat.slug}`} 
                className="px-5 py-3 text-xs md:text-sm font-black uppercase hover:text-pd-red transition-colors whitespace-nowrap border-r border-white/10"
              >
                {cat.title}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}