"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../app/Provider";

export function useTrials() {
  const { user, userData, setUserData } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      getRemainingTrials();
    }
  }, [user]);

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
      return (userData?.trial_count ?? 0) > 0;
    }
  };

  const getRemainingTrials = () => {
    if (user) {
      return userData?.trial_count ?? 0;
    }
  };

  return {
    userData,
    loading,
    canTryOn: canTryOn(),
    remainingTrials: getRemainingTrials(),
    decrementTrial,
    refetch: fetchUserData,
  };
}
