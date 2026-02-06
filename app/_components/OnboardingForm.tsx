"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OnboardingSchema } from "@/lib/schemas";
import { z } from "zod";

type OnboardingValues = z.infer<typeof OnboardingSchema>;

export default function OnboardingForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingValues>({
    resolver: zodResolver(OnboardingSchema),
  });

  const onSubmit = async (data: OnboardingValues) => {
    // Call Server Action
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("full_name")} placeholder="Full Name" />
      {errors.full_name && (
        <p className="text-red-500">{errors.full_name.message}</p>
      )}

      <textarea {...register("bio")} placeholder="Writer Bio" />
      {errors.bio && <p className="text-red-500">{errors.bio.message}</p>}

      <button type="submit">Complete Profile</button>
    </form>
  );
}
