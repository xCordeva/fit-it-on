import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { supabase } from "@/lib/supabase";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const TOAST_CONFIG = {
  success: {
    duration: 2000,
    style: { background: "var(--success)", color: "#fff" },
  },
  error: {
    duration: 4000,
    style: { background: "var(--error)", color: "#fff" },
  },
};

export async function adjustTrialCountIfAnonymousTrialUsed(userId: string) {
  if (localStorage.getItem("hasTriedFree")) {
    // Check if this was already upgraded
    const { data, error } = await supabase
      .from("users")
      .select("upgraded_from_anonymous")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Failed to fetch user upgrade flag:", error);
      return;
    }

    if (data?.upgraded_from_anonymous) {
      return;
    }

    // Update trial count and mark as upgraded
    const { error: updateError } = await supabase
      .from("users")
      .update({
        trial_count: 2,
        upgraded_from_anonymous: true,
      })
      .eq("id", userId);

    if (updateError) {
      console.error("Failed to adjust trial count:", updateError);
    }
  }
}
