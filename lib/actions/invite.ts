"use server";

import { createClient } from "@supabase/supabase-js"; // Use Admin Client for this
import { revalidatePath } from "next/cache";

// Initialize the Admin client with the Service Role Key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function inviteStaffMember(formData: FormData) {
  const email = formData.get("email") as string;
  const role = formData.get("role") as string; // 'writer' or 'editor'

  // Map role to our JSONB permission structure
  const invited_permissions =
    role === "editor" ? ["writer", "editor"] : ["writer"];

  try {
    // 1. Generate the invite in the database
    const { data, error } = await supabaseAdmin
      .from("writer_invites")
      .insert({
        email,
        invited_permissions,
        expires_at: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 7 days
      })
      .select("token")
      .single();

    if (error) throw error;

    // 2. Construct the Invitation Link
    const inviteLink = `${process.env.NEXT_PUBLIC_SITE_URL}/setup-password?token=${data.token}`;

    // 3. For now, we return the link for the Admin to copy-paste.
    // Later, this is where you'll call Resend: await resend.emails.send(...)
    console.log(`Invite generated for ${email}: ${inviteLink}`);

    revalidatePath("/admin/staff");
    return { success: true, link: inviteLink };
  } catch (error) {
    console.error("Invite Error:", error);
    return { success: false, error: "Failed to generate invite." };
  }
}
