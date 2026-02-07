// app/writer/dashboard/_components/DashboardStats.tsx
export default function DashboardStats({ articles }: { articles: any[] }) {
  const stats = [
    {
      label: "Total Submissions",
      value: articles.length,
      color: "text-slate-900",
    },
    {
      label: "In Review",
      value: articles.filter((a) => a.status === "pending_review").length,
      color: "text-amber-500",
    },
    {
      label: "Live Articles",
      value: articles.filter((a) => a.status === "approved").length,
      color: "text-emerald-500",
    },
    {
      label: "Needs Attention",
      value: articles.filter((a) => a.status === "rejected").length,
      color: "text-pd-red",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="p-6 md:p-8 bg-white border border-slate-100 rounded-4xl shadow-sm hover:shadow-md transition-shadow"
        >
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
            {stat.label}
          </p>
          <p className={`text-4xl font-black tracking-tighter ${stat.color}`}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
