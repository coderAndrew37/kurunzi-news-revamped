import Link from "next/link";
import { ShieldAlert, Mail, ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#FAFAFA]">
      <div className="max-w-md w-full space-y-8">
        {/* Branding/Logo */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black tracking-tighter uppercase italic">
            Kurunzi<span className="text-pd-red">News</span>
          </h2>
        </div>

        <div className="bg-white p-10 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-pd-red">
              <ShieldAlert size={40} />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 leading-tight">
              Invitation Link <br />
              <span className="text-pd-red">Invalid or Expired</span>
            </h1>
            <p className="text-slate-500 font-medium text-sm leading-relaxed">
              Because we use a secure PKCE framework, invite links are
              single-use and expire quickly for your protection.
            </p>
          </div>

          <div className="mt-10 space-y-3">
            <Button
              asChild
              className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold transition-all group"
            >
              <Link href="/login">
                Go to Login
                <ArrowRight
                  size={18}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </Button>

            <Button
              variant="outline"
              asChild
              className="w-full h-14 rounded-2xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
            >
              <a href="mailto:admin@kurunzinews.co.ke">
                <Mail size={18} className="mr-2" />
                Request New Invite
              </a>
            </Button>
          </div>
        </div>

        {/* Support Section */}
        <div className="flex items-center justify-center gap-2 text-slate-400">
          <HelpCircle size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Editorial Technical Support
          </span>
        </div>
      </div>
    </div>
  );
}
