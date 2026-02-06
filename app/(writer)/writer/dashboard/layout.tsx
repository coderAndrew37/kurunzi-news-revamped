import Sidebar from "@/app/_components/dashboard/Sidebar";

export default function WriterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="writer" />
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-40">
          <h1 className="font-bold text-slate-800">Writer Portal</h1>
          <div className="flex items-center gap-4">
            {/* Profile circle and notification bell */}
          </div>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
