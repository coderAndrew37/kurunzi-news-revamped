import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Column 1: Brand */}
        <div className="space-y-4">
          <h2 className="text-3xl font-black">NEWSROOM</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Leading the conversation with factual, verified, and timely news across Kenya and the world.
          </p>
        </div>

        {/* Column 2: Quick Sections */}
        <div>
          <h4 className="font-bold border-l-4 border-pd-red pl-3 mb-6">SECTIONS</h4>
          <ul className="grid grid-cols-1 gap-3 text-sm text-slate-400">
            <Link href="/news" className="hover:text-white transition">News</Link>
            <Link href="/politics" className="hover:text-white transition">Politics</Link>
            <Link href="/business" className="hover:text-white transition">Business</Link>
            <Link href="/sports" className="hover:text-white transition">Sports</Link>
          </ul>
        </div>

        {/* Column 3: Corporate */}
        <div>
          <h4 className="font-bold border-l-4 border-pd-red pl-3 mb-6">COMPANY</h4>
          <ul className="grid grid-cols-1 gap-3 text-sm text-slate-400">
            <li>About Us</li>
            <li>Contact Us</li>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div className="space-y-4">
          <h4 className="font-bold border-l-4 border-pd-red pl-3 mb-6">SUBSCRIBE</h4>
          <div className="flex bg-slate-800 rounded p-1">
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-transparent border-none focus:ring-0 text-sm px-3 flex-grow"
            />
            <button className="bg-pd-red px-4 py-2 rounded font-bold text-xs">JOIN</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
        <span>&copy; 2026 NEWSROOM DIGITAL MEDIA</span>
        <span>A CUSTOM SUPABASE-SANITY BUILD</span>
      </div>
    </footer>
  );
}