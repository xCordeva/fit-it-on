"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { adjustTrialCountIfAnonymousTrialUsed } from "@/lib/utils";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      // If the user just signed in or signed up
      if (
        session?.user &&
        (event === "SIGNED_IN" || event === "USER_UPDATED")
      ) {
        await adjustTrialCountIfAnonymousTrialUsed(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signInWithGoogle = async () => {
    return supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `/` },
    });
  };

  const signUp = async (email: string, password: string, name: string) => {
    if (!name.trim()) throw new Error("Name is required");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (data?.user) {
      await adjustTrialCountIfAnonymousTrialUsed(data.user.id);
    }
    return { data, error };
  };

  const signOut = async () => {
    return supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password/token`,
    });
  };

  const setSession = async (access_token: string, refresh_token: string) => {
    return supabase.auth.setSession({ access_token, refresh_token });
  };

  const updatePassword = async (password: string) => {
    return supabase.auth.updateUser({ password });
  };

  return {
    user,
    loading,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    resetPassword,
    setSession,
    updatePassword,
  };
}
