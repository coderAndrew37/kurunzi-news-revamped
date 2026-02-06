interface StatCardProps {
  title: string;
  value: number;
  color: "blue" | "orange" | "green" | "red";
}

export default function StatCard({ title, value, color }: StatCardProps) {
  const colors = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    orange: "text-orange-600 bg-orange-50 border-orange-100",
    green: "text-green-600 bg-green-50 border-green-100",
    red: "text-red-600 bg-red-50 border-red-100",
  };

  return (
    <div
      className={`p-6 rounded-2xl border ${colors[color]} flex flex-col gap-1`}
    >
      <span className="text-[10px] font-black uppercase tracking-wider opacity-70">
        {title}
      </span>
      <span className="text-3xl font-black">{value}</span>
    </div>
  );
}
