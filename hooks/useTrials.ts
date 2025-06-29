"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";

interface UserData {
  trial_count: number;
  plan: string;
}

export function useTrials() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user?.id) return;

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
    if (!user) return false;
    if (!userData) return false;

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
      if (typeof window === "undefined") {
        return true;
      }
      return !localStorage.getItem("hasTriedFree");
    }
  };

  const getRemainingTrials = () => {
    if (user) {
      if (userData?.plan === "pro") return Infinity;
      return userData?.trial_count ?? 0;
    } else {
      if (typeof window === "undefined") {
        return true;
      }
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
