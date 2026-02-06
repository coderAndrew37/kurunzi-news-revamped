import { ShieldAlert, Mail } from "lucide-react";

export default function SuspendedPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-xl border border-red-100 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 text-red-600 rounded-full mb-6">
          <ShieldAlert size={40} />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">
          Account Suspended
        </h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Your access to the Kurunzi Newsroom has been restricted by the
          editorial board. You can no longer draft or submit articles at this
          time.
        </p>
        <div className="flex flex-col gap-3">
          <a
            href="mailto:editor@kurunzi.com"
            className="flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all"
          >
            <Mail size={18} />
            Contact Editor-in-Chief
          </a>
          <a
            href="/login"
            className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            Return to Login
          </a>
        </div>
      </div>
    </main>
  );
}
