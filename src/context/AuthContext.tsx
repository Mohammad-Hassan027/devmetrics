import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "../services/supabase";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";

export type AuthUser = {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function safeString(v: unknown): string | undefined {
  return typeof v === "string" && v.trim().length > 0 ? v : undefined;
}

function mapUser(u: SupabaseUser): AuthUser {
  const meta = (u.user_metadata ?? {}) as Record<string, unknown>;
  return {
    id: u.id,
    email: safeString(u.email),
    name: safeString((meta.full_name as unknown) ?? (meta.name as unknown)),
    avatar_url: safeString(meta.avatar_url) ?? undefined,
  };
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;

    async function init() {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();
      if (error)
        console.error("supabase.getUser error:", error.message ?? error);
      if (!active) return;
      if (data?.user) setUser(mapUser(data.user));
      setLoading(false);
    }

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        if (session?.user) setUser(mapUser(session.user));
        else setUser(null);
      },
    );

    return () => {
      active = false;
      // SDK returns { subscription } with unsubscribe()
      try {
        (listener as any)?.subscription?.unsubscribe?.();
      } catch {
        // best-effort unsubscribe
      }
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
