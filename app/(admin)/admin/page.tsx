import StatCard from "@/app/_components/dashboard/StatCard";
import { createClient } from "@/lib/utils/supabase/server";
import { Newspaper, Users, Clock, CheckCircle } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch system-wide stats
  const { count: pendingCount } = await supabase
    .from("article_workflow")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending_review");

  const { count: approvedCount } = await supabase
    .from("article_workflow")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved");

  const { count: staffCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
            Command Center
          </h1>
          <p className="text-slate-500 font-medium">Global Newsroom Overview</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          System Live
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Awaiting Review"
          value={pendingCount || 0}
          color="orange"
        />
        <StatCard
          title="Total Published"
          value={approvedCount || 0}
          color="green"
        />
        <StatCard title="Active Staff" value={staffCount || 0} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-black uppercase text-xs text-slate-400 mb-6 tracking-widest">
            Recent Activity
          </h3>
          <div className="space-y-6">
            {/* We can map a feed of recent workflow changes here later */}
            <p className="text-sm text-slate-400 italic">
              Tracking live updates from writers...
            </p>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-3xl text-white">
          <h3 className="font-black uppercase text-xs text-slate-500 mb-6 tracking-widest">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <a
              href="/admin/queue"
              className="p-4 bg-slate-800 rounded-2xl hover:bg-pd-red transition-all group"
            >
              <Clock className="mb-2 text-slate-500 group-hover:text-white" />
              <p className="font-bold text-sm">Review Queue</p>
            </a>
            <a
              href="/admin/staff"
              className="p-4 bg-slate-800 rounded-2xl hover:bg-pd-red transition-all group"
            >
              <Users className="mb-2 text-slate-500 group-hover:text-white" />
              <p className="font-bold text-sm">Manage Staff</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
