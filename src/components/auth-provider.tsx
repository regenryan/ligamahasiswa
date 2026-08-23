"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  startTransition,
  type ReactNode,
} from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  chapterSlug: string;
  role: "user" | "member" | "committee" | "national" | "admin";
  status: "active" | "expired" | "suspended";
  memberId: string;
  membershipExpiresAt: string;
}

type AuthCtx = {
  user: AuthUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        startTransition(() => {
          setUser(data.user ?? null);
        });
      } else {
        startTransition(() => {
          setUser(null);
        });
      }
    } catch {
      startTransition(() => {
        setUser(null);
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    const { logoutAction } = await import("@/app/actions/auth");
    await logoutAction();
    startTransition(() => {
      setUser(null);
    });
  }, []);

  useEffect(() => {
    startTransition(() => {
      refresh();
    });
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
