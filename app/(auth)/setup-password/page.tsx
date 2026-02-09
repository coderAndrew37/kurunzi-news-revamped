"use client";

import { useActionState, useEffect } from "react";
import { finalizeInviteAction } from "@/lib/actions/auth";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Define the shape of our state to fix the "Property does not exist" errors
interface FormState {
  success?: boolean;
  error?:
    | string
    | {
        password?: string[];
        confirmPassword?: string[];
      };
}

export default function SetupPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  // Initial state matches the interface
  const initialState: FormState = {};

  const [state, formAction, isPending] = useActionState(
    finalizeInviteAction,
    initialState,
  );

  useEffect(() => {
    // Narrowing the error type for the toast
    if (state?.error && typeof state.error === "string") {
      toast.error(state.error);
    }
  }, [state]);

  // Helper to safely access field errors
  const fieldErrors = typeof state?.error === "object" ? state.error : {};

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black tracking-tighter uppercase italic">
            Kurunzi<span className="text-pd-red">News</span>
          </h2>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white rotate-3">
              <ShieldCheck size={32} />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Secure Your Account
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-2">
              Set a strong password to access the writer portal.
            </p>
          </div>

          <form action={formAction} className="space-y-5">
            <input type="hidden" name="token" value={token ?? ""} />

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                New Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <Input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-11 h-14 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white transition-all"
                />
              </div>
              {fieldErrors.password && (
                <p className="text-red-500 text-[11px] font-bold ml-1">
                  {fieldErrors.password[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="pl-11 h-14 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white transition-all"
                />
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-red-500 text-[11px] font-bold ml-1">
                  {fieldErrors.confirmPassword[0]}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold transition-all shadow-lg shadow-slate-200"
            >
              {isPending ? (
                <Loader2 className="animate-spin mr-2" size={20} />
              ) : (
                <CheckCircle2 className="mr-2" size={20} />
              )}
              {isPending ? "Activating..." : "Activate Account"}
            </Button>
          </form>
        </div>

        <p className="text-center mt-8 text-slate-400 text-xs font-medium uppercase tracking-widest">
          Kurunzi Editorial Security
        </p>
      </div>
    </div>
  );
}
