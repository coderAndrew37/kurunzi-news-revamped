// app/subscribe/SubscribeForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const subscribeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  interests: z.array(z.string()).min(1, "Please select at least one interest"),
});

type SubscribeFormData = z.infer<typeof subscribeSchema>;

const INTERESTS = [
  "Football",
  "Athletics",
  "Rugby",
  "Transfer News",
  "Local Leagues",
  "International",
  "Opinion & Analysis",
];

export default function SubscribeForm() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SubscribeFormData>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: {
      interests: [],
    },
  });

  const selectedInterests = watch("interests");

  const onSubmit = async (data: SubscribeFormData) => {
    setStatus("loading");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1200));

      console.log("Subscription data:", data);

      setStatus("success");
      setMessage("You've been subscribed successfully! Welcome to the family.");
      reset();

      // Reset status after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  const toggleInterest = (interest: string) => {
    const current = selectedInterests || [];
    if (current.includes(interest)) {
      setValue(
        "interests",
        current.filter((i) => i !== interest),
      );
    } else {
      setValue("interests", [...current, interest]);
    }
  };

  return (
    <div className="bg-white border border-[#e8e2da] rounded-2xl p-8 md:p-10 shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-[#5c534a] mb-2">
            Full Name <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            {...register("name")}
            className="w-full px-4 py-3 border border-[#e8e2da] rounded-lg focus:outline-none focus:border-[#1a5c38]"
            placeholder="John Doe"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-[#5c534a] mb-2">
            Email Address *
          </label>
          <input
            type="email"
            {...register("email")}
            className="w-full px-4 py-3 border border-[#e8e2da] rounded-lg focus:outline-none focus:border-[#1a5c38]"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1.5 text-red-600 text-sm flex items-center gap-1">
              <AlertCircle size={14} /> {errors.email.message}
            </p>
          )}
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-medium text-[#5c534a] mb-3">
            What interests you? *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {INTERESTS.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-4 py-3 text-sm border rounded-xl transition-all ${
                  selectedInterests?.includes(interest)
                    ? "border-[#1a5c38] bg-[#1a5c38] text-white"
                    : "border-[#e8e2da] hover:border-[#1a5c38]"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
          {errors.interests && (
            <p className="mt-2 text-red-600 text-sm">
              {errors.interests.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-[#1a5c38] hover:bg-[#13482a] disabled:bg-gray-400 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 text-lg"
        >
          {status === "loading" && (
            <Loader2 className="animate-spin" size={22} />
          )}
          {status === "success" ? "Subscribed Successfully" : "Subscribe Now"}
        </button>
      </form>

      {/* Status Messages */}
      {status === "success" && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl flex gap-3 text-green-700">
          <CheckCircle className="shrink-0 mt-0.5" />
          <p>{message}</p>
        </div>
      )}

      {status === "error" && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3 text-red-700">
          <AlertCircle className="shrink-0 mt-0.5" />
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}
