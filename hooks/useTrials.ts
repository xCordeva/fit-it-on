"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../app/Provider";

export function useTrials() {
  const { user, userData, setUserData } = useAuth();
  const [loading, setLoading] = useState(false);

  const fetchUserData = async () => {
    if (!user?.id) return;

    setLoading(true);
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setUserData(data);
    } else {
      setUserData(null);
    }
    setLoading(false);
  };

  const decrementTrial = async () => {
    if (!user || !userData) return false;

    const updatedCount = Math.max(userData.trial_count - 1, 0);
    const { data, error } = await supabase
      .from("users")
      .update({ trial_count: updatedCount })
      .eq("id", user.id)
      .select()
      .single();

    if (data && !error) {
      setUserData({ ...userData, trial_count: data.trial_count });
      return true;
    }
    return false;
  };

  const canTryOn = () => {
    if (user) {
      // Pro plan always allowed
      if (userData?.plan === "pro") return true;
      // Free plan must have trials left
      return (userData?.trial_count ?? 0) > 0;
    } else {
      if (typeof window === "undefined") return true;
      return !localStorage.getItem("hasTriedFree");
    }
  };

  const getRemainingTrials = () => {
    if (user) {
      if (userData?.plan === "pro") return Infinity;
      return userData?.trial_count ?? 0;
    } else {
      if (typeof window === "undefined") return true;
      return localStorage.getItem("hasTriedFree") ? 0 : 1;
    }
  };

  const markAnonymousTrialUsed = () => {
    localStorage.setItem("hasTriedFree", "true");
  };

  return {
    userData,
    loading,
    canTryOn: canTryOn(),
    remainingTrials: getRemainingTrials(),
    decrementTrial,
    markAnonymousTrialUsed,
    refetch: fetchUserData,
  };
}
