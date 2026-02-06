// app/(auth)/onboarding/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OnboardingSchema } from "@/lib/schemas";
import { saveOnboardingAction } from "@/lib/actions/onboarding";
import { z } from "zod";

type OnboardingValues = z.infer<typeof OnboardingSchema>;

export default function OnboardingPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingValues>({
    resolver: zodResolver(OnboardingSchema),
  });

  const onSubmit = async (data: OnboardingValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => formData.append(key, val));
    await saveOnboardingAction(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          {...register("full_name")}
          className="border p-2 w-full"
          placeholder="Full Name"
        />
        {errors.full_name && (
          <p className="text-red-500 text-sm">{errors.full_name.message}</p>
        )}
      </div>

      <div>
        <textarea
          {...register("bio")}
          className="border p-2 w-full"
          placeholder="Short Bio"
        />
        {errors.bio && (
          <p className="text-red-500 text-sm">{errors.bio.message}</p>
        )}
      </div>

      <button type="submit" className="bg-black text-white px-4 py-2 rounded">
        Complete Setup
      </button>
    </form>
  );
}
