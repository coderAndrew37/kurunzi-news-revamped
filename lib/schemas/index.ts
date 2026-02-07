import { z } from "zod";

// 1. Setup Password Schema
export const SetupPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain one uppercase letter")
      .regex(/[0-9]/, "Password must contain one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// 2. Writer Onboarding Schema
export const OnboardingSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
});

export const LoginFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const InviteStaffSchema = z.object({
  email: z.string().email("Please enter a valid work email"),
  role: z.enum(["writer", "editor"], {
    message: "Please select a valid role",
  }),
});
