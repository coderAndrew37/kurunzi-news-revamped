"use server";

import { createClient } from "@/lib/utils/supabase/server";
import { createClient as createAdmin } from "@supabase/supabase-js";
import { sanityServerClient as sanity } from "@/lib/sanity/server";
import { OnboardingSchema } from "@/lib/schemas";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createError, parseUnknownError } from "@/lib/utils/error-builder";
import { ActionResponse } from "@/types/errors";

const supabaseAdmin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function saveOnboardingAction(
  formData: FormData,
): Promise<ActionResponse> {
  const supabase = await createClient();
  const rawData = {
    full_name: formData.get("full_name"),
    bio: formData.get("bio"),
  };

  const validated = OnboardingSchema.safeParse(rawData);
  if (!validated.success) {
    return {
      success: false,
      error: createError(
        "VALIDATION_ERROR",
        "Check your inputs",
        validated.error.flatten().fieldErrors as any,
      ),
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return {
      success: false,
      error: createError("AUTH_UNAUTHORIZED", "Session expired"),
    };

  try {
    const sanityAuthor = await sanity.createOrReplace({
      _id: `author-${user.id}`,
      _type: "author",
      name: validated.data.full_name,
      slug: {
        _type: "slug",
        current: validated.data.full_name
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-"),
      },
      bio: validated.data.bio,
      supabaseUserId: user.id,
    });

    const { error: dbError } = await supabaseAdmin
      .from("profiles")
      .update({
        full_name: validated.data.full_name,
        bio: validated.data.bio,
        sanity_author_id: sanityAuthor._id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (dbError) throw dbError;

    // Clear the cache so the dashboard sees the new name/bio
    revalidatePath("/", "layout");
  } catch (err: unknown) {
    return { success: false, error: parseUnknownError(err) };
  }

  redirect("/writer/dashboard");
}
