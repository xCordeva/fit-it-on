import { supabase } from "./supabase";

export async function uploadImageToSupabase(
  file: File,
  fileType: string,
  userId: string
) {
  const filePath = `users/${userId}/${fileType}/${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from("user-uploads")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from("user-uploads")
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}
