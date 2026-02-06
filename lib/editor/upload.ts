import { uploadMediaAction } from "@/lib/actions/media";

export async function uploadEditorImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const result = await uploadMediaAction(formData);

  if (result.error || !result.url) {
    throw new Error(result.error || "Upload failed");
  }

  return result.url; // This URL goes straight into Tiptap
}
