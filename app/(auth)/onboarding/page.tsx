"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OnboardingSchema } from "@/lib/schemas";
import { saveOnboardingAction } from "@/lib/actions/onboarding";
import { z } from "zod";
import { useState } from "react";
import { Loader2, UserCircle } from "lucide-react";

type OnboardingValues = z.infer<typeof OnboardingSchema>;

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingValues>({
    resolver: zodResolver(OnboardingSchema),
  });

  const onSubmit = async (data: OnboardingValues) => {
    setLoading(true);
    setServerError(null);

    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) =>
      formData.append(key, val as string),
    );

    const result = await saveOnboardingAction(formData);

    if (!result.success) {
      setServerError(result.error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
        <header className="text-center mb-8">
          <div className="inline-flex p-3 bg-red-50 text-red-600 rounded-2xl mb-4">
            <UserCircle size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
            Setup Journalist Profile
          </h1>
          <p className="text-slate-500 mt-2">
            Finish setting up your account to start writing for Kurunzi.
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {serverError && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium">
              {serverError}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Full Name
            </label>
            <input
              {...register("full_name")}
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 focus:ring-2 focus:ring-red-500 transition-all placeholder:text-slate-300"
              placeholder="e.g. Jane Doe"
            />
            {errors.full_name && (
              <p className="text-red-500 text-xs mt-1 ml-1">
                {errors.full_name.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Author Bio
            </label>
            <textarea
              {...register("bio")}
              rows={4}
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 focus:ring-2 focus:ring-red-500 transition-all placeholder:text-slate-300 resize-none"
              placeholder="Tell the readers about your expertise..."
            />
            {errors.bio && (
              <p className="text-red-500 text-xs mt-1 ml-1">
                {errors.bio.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-red-600 disabled:bg-slate-300 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm shadow-lg shadow-slate-200"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Complete Onboarding"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
