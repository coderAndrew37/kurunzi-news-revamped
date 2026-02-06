"use server";

import { createClient } from "@/lib/utils/supabase/server";
import { sanityServerClient as sanity } from "@/lib/sanity/client"; // Sanity Write Client
import { OnboardingSchema } from "@/lib/schemas";
import { redirect } from "next/navigation";

export async function saveOnboardingAction(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const rawData = {
    full_name: formData.get("full_name"),
    bio: formData.get("bio"),
    avatar_url: formData.get("avatar_url"),
  };

  const validated = OnboardingSchema.safeParse(rawData);
  if (!validated.success)
    return { errors: validated.error.flatten().fieldErrors };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Session expired." };

  try {
    // 1. Create/Update Author in Sanity
    // We use a deterministic ID based on Supabase UUID to avoid duplicates
    const sanityAuthor = await sanity.createOrReplace({
      _id: `author-${user.id}`,
      _type: "author",
      name: validated.data.full_name,
      slug: {
        _type: "slug",
        current: validated.data.full_name.toLowerCase().replace(/\s+/g, "-"),
      },
      bio: validated.data.bio,
      supabaseUserId: user.id,
      // Note: Handling image upload to Sanity assets would go here if avatar_url is a file
    });

    // 2. Update the Profile in Supabase (including the sanity_author_id link)
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: validated.data.full_name,
        bio: validated.data.bio,
        avatar_url: validated.data.avatar_url,
        sanity_author_id: sanityAuthor._id, // Add this column to your table!
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) throw error;
  } catch (err: any) {
    return { error: "Onboarding sync failed: " + err.message };
  }

  redirect("/dashboard");
}
