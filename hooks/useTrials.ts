"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../app/Provider";
import { useTrialsStore } from "@/stores/useTrialsStore";

export function useTrials() {
  const { user, userData, setUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const { anonTrials, setAnonTrials, _hasHydrated } = useTrialsStore();

  useEffect(() => {
    if (!user) {
      if (_hasHydrated && anonTrials === undefined) {
        setAnonTrials(1);
      }
    }
  }, [user, _hasHydrated, anonTrials, setAnonTrials]);

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
      // Pro plan always allowed
      if (userData?.plan === "pro") return true;
      // Free plan must have trials left
      return (userData?.trial_count ?? 0) > 0;
    } else {
      return _hasHydrated ? anonTrials && anonTrials > 0 : true;
    }
  };

  const getRemainingTrials = () => {
    if (user) {
      if (userData?.plan === "pro") return Infinity;
      return userData?.trial_count ?? 0;
    } else {
      return _hasHydrated ? anonTrials : undefined;
    }
  };

  const markAnonymousTrialUsed = () => {
    setAnonTrials(0);
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
