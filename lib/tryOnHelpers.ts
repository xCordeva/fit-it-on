import { supabase } from "./supabaseClient";

// this is used for user inputs, since a user would upload a file (image)
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

// this is used for results, since the endpoint returns a url
export async function uploadImageFromUrlToSupabase(
  imageUrl: string,
  fileType: string,
  userId: string
) {
  // Fetch the image data as a Blob
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image from URL: ${response.statusText}`);
  }

  const blob = await response.blob();
  const filePath = `users/${userId}/${fileType}/result-${Date.now()}.jpg`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from("user-uploads")
    .upload(filePath, blob, {
      contentType: blob.type,
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from("user-uploads")
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

export async function uploadBufferToSupabase(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
) {
  const { data, error } = await supabase.storage
    .from("user-uploads")
    .upload(fileName, fileBuffer, {
      contentType: mimeType,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from("user-uploads")
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}

export async function deleteImageFromSupabase(url: string) {
  try {
    const filePath = extractPathFromUrl(url);
    const { error } = await supabase.storage
      .from("user-uploads")
      .remove([filePath]);

    if (error) {
      throw new Error(error.message);
    }
    return true;
  } catch (err: any) {
    console.error("Error deleting image:", err.message);
    return false;
  }
}

// This extracts the relative path from the public URL
function extractPathFromUrl(url: string): string {
  const parts = url.split("/user-uploads/");
  console.log(parts[1]);
  return parts[1] || "";
}
