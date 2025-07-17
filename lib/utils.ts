import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

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
  if (typeof window === "undefined") return;

  const stored = localStorage.getItem("anon-trials-storage");
  const parsed = stored ? JSON.parse(stored) : null;
  const anonTrials = parsed?.state?.anonTrials;

  if (anonTrials === 0) {
    const { data, error } = await supabase
      .from("users")
      .select("upgraded_from_anonymous, trial_count")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Failed to fetch user upgrade flag:", error);
      return;
    }

    if (data?.upgraded_from_anonymous || data?.trial_count > 3) {
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

export async function fetchFreshUserData(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Failed to fetch user data:", error);
    return null;
  }

  return data;
}

export function getAnonUserId() {
  const key = "anon-user-id";
  const stored = localStorage.getItem(key);
  if (stored) return stored;

  const newId = uuidv4();
  localStorage.setItem(key, newId);
  return newId;
}
