"use client";

import { Bell, UserCircle } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  userEmail?: string;
}

export default function DashboardHeader({
  title,
  userEmail,
}: DashboardHeaderProps) {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-40">
      <h1 className="font-bold text-slate-800 text-lg uppercase tracking-tight">
        {title}
      </h1>
      <div className="flex items-center gap-6">
        <button
          aria-label="user profile"
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <Bell size={20} />
        </button>
        <div className="flex items-center gap-3 border-l pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-500 uppercase">
              Current User
            </p>
            <p className="text-sm text-slate-900">{userEmail}</p>
          </div>
          <UserCircle size={32} className="text-slate-300" />
        </div>
      </div>
    </header>
  );
}
