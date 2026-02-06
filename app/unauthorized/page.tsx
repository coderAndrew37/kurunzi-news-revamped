import { Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white shadow-sm border border-slate-200 text-slate-400 rounded-2xl mb-6">
          <Lock size={28} />
        </div>
        <h1 className="text-6xl font-black text-slate-200 mb-4">403</h1>
        <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">
          Access Denied
        </h2>
        <p className="text-slate-500 mb-10 leading-relaxed">
          You do not have the required permissions to access this specific area
          of the newsroom. If you believe this is a mistake, contact your
          supervisor.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-pd-red font-black text-sm uppercase tracking-widest hover:gap-4 transition-all"
        >
          <ArrowLeft size={16} />
          Back to your Dashboard
        </Link>
      </div>
    </main>
  );
}
