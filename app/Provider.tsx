"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Session, User } from "@supabase/supabase-js";
import { adjustTrialCountIfAnonymousTrialUsed } from "@/lib/utils";
import { fetchFreshUserData } from "@/lib/utils";

interface UserData {
  trial_count: number;
  plan: string;
}

// Define the shape of your AuthContext value
interface AuthContextType {
  session: Session | null;
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>; // Adjust return type if needed
  signInWithGoogle: () => Promise<any>;
  signInWithFacebook: () => Promise<any>;
  signUp: (email: string, password: string, name: string) => Promise<any>;
  signOut: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  updatePassword: (password: string) => Promise<any>;
  setUserData: (data: UserData | null) => void;
}

// Create the context with a default null value (it will be provided by the Provider)
const AuthContext = createContext<AuthContextType | null>(null);
// Custom hook to consume the AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({
  children,
  initialSession,
  currentUser,
  userData,
}: {
  children: React.ReactNode;
  initialSession: Session | null;
  currentUser: User | null;
  userData: UserData | null;
}) {
  const [session, setSessionState] = useState<Session | null>(initialSession);
  const [user, setUserState] = useState<User | null>(currentUser ?? null);
  const [loading, setLoading] = useState(false); // Set to false initially as session is known
  const [userDataState, setUserDataState] = useState<UserData | null>(
    userData ?? null
  );

  useEffect(() => {

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSessionState(currentSession);
      setUserState(currentSession?.user ?? null);
      setLoading(false); // Auth state change means loading is done

      if (
        currentSession?.user &&
        (event === "SIGNED_IN" ||
          event === "USER_UPDATED" ||
          event === "INITIAL_SESSION")
      ) {
        setTimeout(async () => {
          await adjustTrialCountIfAnonymousTrialUsed(currentSession.user.id);
          const freshData = await fetchFreshUserData(currentSession.user.id);
          setUserDataState(freshData);
        }, 500);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const contextValue = {
    session,
    user,
    loading,
    userData: userDataState,
    setUserData: setUserDataState,

    signIn: async (email: string, password: string) => {
      setLoading(true);
      const res = await supabase.auth.signInWithPassword({ email, password });
      if (res.data?.user) {
        const freshData = await fetchFreshUserData(res.data.user.id);
        setUserDataState(freshData);
      }
      setLoading(false);
      return res;
    },

    signInWithGoogle: async () => {
      setLoading(true);
      const res = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/app` },
      });
      setLoading(false);
      return res;
    },

    signInWithFacebook: async () => {
      setLoading(true);
      const res = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: { redirectTo: `${window.location.origin}/app` },
      });
      setLoading(false);
      return res;
    },

    signUp: async (email: string, password: string, name: string) => {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });

      if (data?.user) {
        await adjustTrialCountIfAnonymousTrialUsed(data.user.id);
      }

      setLoading(false);
      return { data, error };
    },

    signOut: async () => {
      setLoading(true);
      const res = await supabase.auth.signOut();
      setLoading(false);
      return res;
    },

    resetPassword: async (email: string) => {
      setLoading(true);
      const res = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password/token`,
      });

      setLoading(false);
      return res;
    },

    updatePassword: async (password: string) => {
      setLoading(true);
      const res = await supabase.auth.updateUser({ password });
      setLoading(false);
      return res;
    },
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
