"use client";
import { ensureRefresh } from "@/refreshClient";
import React, { createContext, useContext, useState, useEffect } from "react";

type AuthContextValue = {
  isAuthLoaded: boolean;
  permissions: string[];
};

const AuthContext = createContext<AuthContextValue>({
  isAuthLoaded: false,
  permissions: [],
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    async function doSilentRefresh() {
      try {
        await ensureRefresh();

        // const { permissions } = await getPermsFromJwt();
        setPermissions(permissions);
      } catch (err) {
        console.error("Silent refresh error: Possibly not logged in", err);
      } finally {
    
        setIsAuthLoaded(true);
      }
    }

    doSilentRefresh();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthLoaded, permissions }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
