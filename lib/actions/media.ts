"use server";

import { v4 as uuidv4 } from "uuid"; // To give files unique names
import { createClient } from "../utils/supabase/server";

export async function uploadMediaAction(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("file") as File;

  if (!file) return { error: "No file provided" };

  // 1. Basic Validation
  const validTypes = ["image/jpeg", "image/png", "image/webp, image/jpg"];
  if (!validTypes.includes(file.type)) {
    return { error: "Invalid file type. Only JPG, PNG, and WebP allowed." };
  }

  if (file.size > 5 * 1024 * 1024) {
    // 5MB Limit
    return { error: "File too large. Maximum size is 5MB." };
  }

  // 2. Generate a Unique Path
  // Path structure: writer_id/uuid-filename.ext
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const fileExt = file.name.split(".").pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `${user?.id}/${fileName}`;

  // 3. Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from("media")
    .upload(filePath, file, {
      upsert: false,
      contentType: file.type,
    });

  if (error) return { error: error.message };

  // 4. Get the Public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("media").getPublicUrl(data.path);

  return { success: true, url: publicUrl };
}
