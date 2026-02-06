"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  User,
  LogOut,
  Newspaper,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/utils/supabase/client";

export default function Sidebar({ role }: { role: "writer" | "admin" }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const menuItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Articles", href: "/dashboard/articles", icon: FileText },
    { name: "New Story", href: "/dashboard/new", icon: PlusCircle },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col sticky top-0 h-screen">
      <div className="p-8">
        <div className="flex items-center gap-3 text-pd-red mb-10">
          <Newspaper size={32} strokeWidth={3} />
          <span className="font-black text-xl tracking-tighter text-white">
            NEWSROOM
          </span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                  isActive
                    ? "bg-pd-red text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-slate-400 hover:text-white font-bold text-sm transition-colors w-full"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
