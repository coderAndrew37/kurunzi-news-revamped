"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormSchema } from "@/lib/schemas";
import { z } from "zod";
import { loginAction } from "@/lib/actions/auth";
import { Newspaper, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    setIsLoading(true);
    setServerError(null);

    const result = await loginAction(values);

    // If result is returned, it means redirect didn't happen (an error occurred)
    if (result?.error) {
      setServerError(result.error);
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-10">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="bg-pd-red p-3 rounded-2xl mb-4 shadow-lg shadow-red-500/20 text-white">
            <Newspaper size={32} />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
            Kurunzi Newsroom
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-1">
            Writer & Editor Portal
          </p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-bold">
            <AlertCircle size={18} />
            <p>{serverError}</p>
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
              Email Address
            </label>
            <input
              {...form.register("email")}
              type="email"
              placeholder="writer@kurunzi.com"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-pd-red transition-all font-medium"
            />
            {form.formState.errors.email && (
              <p className="text-red-500 text-xs font-bold mt-1 ml-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
              Password
            </label>
            <input
              {...form.register("password")}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-pd-red transition-all font-medium"
            />
            {form.formState.errors.password && (
              <p className="text-red-500 text-xs font-bold mt-1 ml-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg hover:bg-black transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Enter Dashboard"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          Secured for Kurunzi Media Group
        </p>
      </div>
    </main>
  );
}
