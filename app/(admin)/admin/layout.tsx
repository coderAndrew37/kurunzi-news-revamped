import Sidebar from "@/app/_components/dashboard/Sidebar";
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("permissions")
    .eq("id", user.id)
    .single();

  if (!profile?.permissions?.includes("admin")) {
    redirect("/unauthorized");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar links={adminSidebarLinks} />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
