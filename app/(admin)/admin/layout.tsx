import Sidebar from "@/app/_components/dashboard/Sidebar";
import DashboardHeader from "@/app/_components/dashboard/DashboardHeader";
import { adminSidebarLinks } from "@/config/sidebar-links";
import { createClient } from "@/lib/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Check role-based permissions
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/unauthorized");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar links={adminSidebarLinks} />
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="System Administration" userEmail={user.email} />
        <main className="p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
