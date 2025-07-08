import { supabase } from "./supabaseClient";

export async function fetchUserPhotoFromSupabase(
  userId: string,
  photoType: string
) {
  const folderPath = `users/${userId}/${photoType}`;

  // Optional: Check if the file exists (you can skip this if you're sure it exists)
  const { data: files, error } = await supabase.storage
    .from("user-uploads")
    .list(folderPath);

  if (!files || files.length === 0 || error) {
    return [];
  }

  // Get the public URL
  const urls = files.map((file) => {
    const { data } = supabase.storage
      .from("user-uploads")
      .getPublicUrl(`${folderPath}/${file.name}`);
    return data.publicUrl;
  });

  return urls;
}
