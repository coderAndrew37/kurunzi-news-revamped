"use client";

import { createClient } from "@/lib/utils/supabase/client";
import type { SidebarLink } from "@/types";
import {
  FileText,
  LayoutDashboard,
  LogOut,
  Newspaper,
  PlusCircle,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

/**
 * Map of allowed icon names → Lucide components
 * This MUST live in the Client Component
 */
const ICON_MAP = {
  LayoutDashboard,
  FileText,
  PlusCircle,
  User,
  Newspaper,
} as const;

interface SidebarProps {
  links: SidebarLink[];
  onLogout?: () => Promise<void>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export default function Sidebar({ links, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    try {
      if (onLogout) {
        await onLogout();
      } else {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        // Force a hard redirect to the main public site
        // This ensures we leave the admin. or writer. subdomain entirely
        window.location.href = `${SITE_URL}/login`;
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col sticky top-0 h-screen">
      {/* Logo / Brand */}
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <Newspaper size={32} strokeWidth={3} className="text-pd-red" />
          <span className="font-black text-xl tracking-tighter">NEWSROOM</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {links.map((item) => {
            const isActive = pathname === item.href;
            const Icon = ICON_MAP[item.icon as keyof typeof ICON_MAP] ?? null;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                  isActive
                    ? "bg-pd-red text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {Icon && <Icon size={18} />}
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="mt-auto p-8 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-slate-400 hover:text-white font-bold text-sm w-full transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
