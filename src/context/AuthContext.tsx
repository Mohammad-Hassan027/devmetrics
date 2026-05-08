import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";

type User = {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function init() {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
      }
      if (!mounted) return;
      if (data?.user) {
        const u = data.user;
        setUser({
          id: u.id,
          email: u.email ?? undefined,
          name:
            u.user_metadata?.full_name ?? u.user_metadata?.name ?? undefined,
          avatar_url: u.user_metadata?.avatar_url ?? undefined,
        });
      }
      setLoading(false);
    }

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        if (session?.user) {
          const u = session.user;
          setUser({
            id: u.id,
            email: u.email ?? undefined,
            name:
              (u.user_metadata)?.full_name ??
              (u.user_metadata)?.name ??
              undefined,
            avatar_url: (u.user_metadata)?.avatar_url ?? undefined,
          });
        } else {
          setUser(null);
        }
      },
    );

    return () => {
      mounted = false;
      // unsubscribe listener
      // listener?.subscription?.unsubscribe is optional depending on SDK version
      if ((listener)?.subscription?.unsubscribe)
        (listener).subscription.unsubscribe();
    };
  }, []);

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
