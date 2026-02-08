"use server";

import { sendEmail } from "@/lib/mail";
import {
  InviteStaffSchema,
  LoginFormSchema,
  OnboardingSchema,
  SetupPasswordSchema,
} from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { supabaseAdmin } from "../utils/supabase/admin";
import { createClient } from "../utils/supabase/server";

/**
 * LOGIN
 */
export async function loginAction(values: z.infer<typeof LoginFormSchema>) {
  const supabase = await createClient();

  const validatedFields = LoginFormSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields provided." };
  }

  const { email, password } = validatedFields.data;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { error: error.message };

  redirect("/writer/dashboard");
}

/**
 * FINALIZING THE INVITE
 */
export async function finalizeInviteAction(formData: FormData) {
  const supabase = await createClient();

  const rawData = Object.fromEntries(formData.entries());
  const token = formData.get("token") as string;

  const validated = SetupPasswordSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }

  const { data: authData, error: authError } = await supabase.auth.updateUser({
    password: validated.data.password,
  });

  if (authError) return { error: authError.message };

  const { error: inviteError } = await supabase.rpc("accept_writer_invite", {
    provided_token: token,
    new_user_id: authData.user.id,
  });

  if (inviteError) return { error: inviteError.message };

  redirect("/onboarding");
}

/**
 * SAVING ONBOARDING DETAILS
 */
export async function saveOnboardingAction(formData: FormData) {
  const supabase = await createClient();
  const rawData = Object.fromEntries(formData.entries());

  const validated = OnboardingSchema.safeParse(rawData);
  if (!validated.success) return { error: "Validation failed" };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: validated.data.full_name,
      bio: validated.data.bio,
    })
    .eq("id", user?.id);

  if (error) return { error: error.message };

  redirect("/writer/dashboard");
}

export async function inviteStaffMember(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validated = InviteStaffSchema.safeParse(rawData);

  // 1. Validation Check
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { email, role } = validated.data;
  const invited_permissions =
    role === "admin" ? ["writer", "admin"] : ["writer"];

  try {
    // 2. Database Transaction: Generate Invite Token
    const { data, error: dbError } = await supabaseAdmin
      .from("writer_invites")
      .insert({
        email,
        invited_permissions,
        expires_at: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 Days
        ).toISOString(),
      })
      .select("token")
      .single();

    if (dbError) {
      if (dbError.code === "23505")
        return { error: "This email already has a pending invitation." };
      throw dbError;
    }

    // 3. Construct Invite Link
    const inviteLink = `${process.env.NEXT_PUBLIC_SITE_URL}/setup-password?token=${data.token}`;

    // 4. Send Email via Resend (Handles Sandbox rerouting internally)
    const emailResult = await sendEmail({
      to: email,
      subject: `Invitation to join Kurunzi Newsroom as ${role === "admin" ? "an Editor" : "a Writer"}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #0f172a; margin-bottom: 16px;">Welcome to Kurunzi</h2>
          <p style="color: #475569; line-height: 1.6;">You've been invited to join our editorial team. As <strong>${role === "admin" ? "an Editor" : "a Writer"}</strong>, you will have access to our internal newsroom tools to draft and manage stories.</p>
          <div style="margin: 32px 0;">
            <a href="${inviteLink}" style="background-color: #e11d48; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
              Set Up Your Account
            </a>
          </div>
          <p style="color: #94a3b8; font-size: 12px;">This invitation link will expire in 7 days. If you were not expecting this invite, please ignore this email.</p>
        </div>
      `,
    });

    if (!emailResult.success) {
      // We don't throw here because the DB record was created;
      // we just want to warn the Admin.
      return {
        success: true,
        link: inviteLink,
        warning:
          "Invite created, but email failed to send. You can copy the link manually.",
      };
    }

    // 5. Refresh the Staff List UI
    revalidatePath("/admin/staff");

    return {
      success: true,
      message: `Successfully invited ${email}!`,
    };
  } catch (error: any) {
    console.error("INVITE_ERROR:", error);
    return { error: error.message || "An unexpected error occurred." };
  }
}
