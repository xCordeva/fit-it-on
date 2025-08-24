import { supabase } from "./supabaseClient";

// Function to sanitize filename for Supabase storage
export function sanitizeFilename(filename: string): string {
  // Handle edge cases
  if (!filename || filename.trim() === "") {
    return "image.jpg";
  }

  // Remove or replace invalid characters for Supabase storage keys
  // Supabase storage keys cannot contain: [ ] { } ( ) < > " " ' ` ~ ! @ # $ % ^ & * + = | \ : ; ? /
  let sanitized = filename
    .replace(/[\[\]{}()<>"'`~!@#$%^&*+=|\\:;?/]/g, "") // Remove invalid characters
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .replace(/[^\w\-_.]/g, "_"); // Replace any other non-word characters with underscores

  // Ensure the filename isn't too long (Supabase has limits)
  if (sanitized.length > 100) {
    const extension = sanitized.split(".").pop() || "jpg";
    const nameWithoutExt = sanitized.substring(0, sanitized.lastIndexOf("."));
    sanitized = nameWithoutExt.substring(0, 90) + "." + extension;
  }

  // Ensure the filename has a valid extension
  if (!sanitized.includes(".")) {
    sanitized += ".jpg";
  }

  return sanitized;
}

// this is used for user inputs, since a user would upload a file (image)
export async function uploadImageToSupabase(
  file: File,
  fileType: string,
  userId: string
) {
  // Validate inputs
  if (!userId || userId.trim() === "") {
    throw new Error("User ID is required");
  }

  if (!fileType || !["person", "garment", "results"].includes(fileType)) {
    throw new Error(
      `Invalid fileType: ${fileType}. Must be one of: person, garment, results`
    );
  }

  const sanitizedFilename = sanitizeFilename(file.name);
  const filePath = `users/${userId}/${fileType}/${Date.now()}-${sanitizedFilename}`;

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
  return parts[1] || "";
}
