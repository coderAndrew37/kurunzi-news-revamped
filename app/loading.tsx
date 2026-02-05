export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Featured Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 animate-pulse">
        <div className="lg:col-span-8 h-[400px] bg-slate-100 rounded-2xl" />
        <div className="lg:col-span-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-video bg-slate-100 rounded-xl" />
            <div className="h-6 w-3/4 bg-slate-100 rounded" />
            <div className="h-4 w-1/2 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}