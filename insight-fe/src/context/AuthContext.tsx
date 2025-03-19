"use client"; // Must be a client component to run in the browser

import React, { createContext, useContext, useState, useEffect } from "react";

/**
 * We create a context that can hold any auth-related
 * data the client needs (e.g. roles, user info, or just isLoggedIn).
 */
type AuthContextValue = {
  isAuthLoaded: boolean; // whether we've tried to load/refresh
  roles: string[];
};

const AuthContext = createContext<AuthContextValue>({
  isAuthLoaded: false,
  roles: [],
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);

  /**
   * On mount, attempt a "silent refresh".
   * - fetch("/api/refresh", { credentials: "include" })
   *   so that cookies are sent & set from the same domain
   */
  useEffect(() => {
    async function doRefresh() {
      try {
        const resp = await fetch("/api/refresh", {
          method: "POST",
          credentials: "include", // important so the browser sends/receives cookies
        });

        // Even if the refresh fails, we can proceed to loaded state
        if (!resp.ok) {
          console.warn("Refresh request failed. Possibly not logged in.");
        } else {
          const data = await resp.json();
          if (data.error) {
            console.warn("Refresh error: ", data.error);
          } else {
            // Optionally, you can fetch user info if needed
            // await loadUserRoles();
          }
        }
      } catch (err) {
        console.error("Silent refresh error:", err);
      } finally {
        setIsAuthLoaded(true);
      }
    }

    doRefresh();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthLoaded, roles }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
