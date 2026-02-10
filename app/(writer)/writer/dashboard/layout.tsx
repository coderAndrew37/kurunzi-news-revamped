import Sidebar from "@/app/_components/dashboard/Sidebar";
import DashboardHeader from "@/app/_components/dashboard/DashboardHeader";
import { writerSidebarLinks } from "@/config/sidebar-links";
import { createClient } from "@/lib/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function WriterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar links={writerSidebarLinks} />
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="Writer Newsroom" userEmail={user.email} />
        <main className="p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
