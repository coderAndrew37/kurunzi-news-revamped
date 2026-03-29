import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] text-white pt-20 pb-10 border-t-4 border-[#1a5c38]">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Column 1: Brand */}
        <div className="space-y-6">
          <h2 className="text-3xl font-black tracking-tighter italic">
            KURUNZI<span className="text-red-600">SPORTS</span>
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed font-['Source_Serif_4']">
            Kenya's premier digital sports archive. Delivering deep-dive
            analysis, breaking news, and historical records from the pitch to
            the track.
          </p>
          <div className="flex gap-4">
            {/* Social icons could go here */}
            <div className="w-8 h-8 rounded-full bg-[#1a5c38] flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer">
              <span className="text-[10px] font-bold">FB</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#1a5c38] flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer">
              <span className="text-[10px] font-bold">X</span>
            </div>
          </div>
        </div>

        {/* Column 2: Quick Sections */}
        <div>
          <h4 className="font-bold border-l-4 border-red-600 pl-3 mb-6 uppercase tracking-widest text-xs">
            Sections
          </h4>
          <ul className="grid grid-cols-1 gap-4 text-xs font-bold uppercase tracking-wider text-gray-400">
            <li>
              <Link
                href="/football"
                className="hover:text-[#1a5c38] transition"
              >
                Football
              </Link>
            </li>
            <li>
              <Link
                href="/athletics"
                className="hover:text-[#1a5c38] transition"
              >
                Athletics
              </Link>
            </li>
            <li>
              <Link href="/rugby" className="hover:text-[#1a5c38] transition">
                Rugby
              </Link>
            </li>
            <li>
              <Link
                href="/basketball"
                className="hover:text-[#1a5c38] transition"
              >
                Basketball
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Corporate */}
        <div>
          <h4 className="font-bold border-l-4 border-red-600 pl-3 mb-6 uppercase tracking-widest text-xs">
            Company
          </h4>
          <ul className="grid grid-cols-1 gap-4 text-xs font-bold uppercase tracking-wider text-gray-400">
            <li>
              <Link href="/about" className="hover:text-white transition">
                About the Archive
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition">
                Editorial Team
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white transition">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white transition">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div className="space-y-4">
          <h4 className="font-bold border-l-4 border-red-600 pl-3 mb-6 uppercase tracking-widest text-xs">
            Newsletter
          </h4>
          <p className="text-[11px] text-gray-500 uppercase font-bold tracking-tighter">
            Get the morning whistle in your inbox.
          </p>
          <div className="flex bg-[#1a1a1a] rounded-sm p-1 border border-gray-800 focus-within:border-[#1a5c38] transition-all">
            <input
              type="email"
              placeholder="Email address"
              className="bg-transparent border-none focus:ring-0 text-sm px-3 flex-grow text-white"
            />
            <button className="bg-[#1a5c38] hover:bg-red-600 px-4 py-2 rounded-sm font-black text-[10px] uppercase tracking-widest transition-colors">
              JOIN
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] text-gray-600 font-bold uppercase tracking-[0.2em]">
        <div className="flex items-center gap-4">
          <span>&copy; {currentYear} KURUNZI SPORTS MEDIA</span>
          <span className="hidden md:inline text-gray-800">|</span>
          <span>NAIROBI, KENYA</span>
        </div>

        <div className="flex items-center gap-1 group">
          <span>CRAFTED BY</span>
          <Link
            href="https://sleeksites.co.ke"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#1a5c38] transition-colors"
          >
            SLEEKSITES AGENCY
          </Link>
        </div>
      </div>
    </footer>
  );
}
