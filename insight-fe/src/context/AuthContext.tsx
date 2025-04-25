"use client";
import { ensureRefresh } from "@/refreshClient";
import React, { createContext, useContext, useState, useEffect } from "react";

type AuthContextValue = {
  isAuthLoaded: boolean;
  userPermissions: string[];
  userPublicId: string;
};

const AuthContext = createContext<AuthContextValue>({
  isAuthLoaded: false,
  userPermissions: [],
  userPublicId: "",
});

export interface UserPayload {
  publicId: string;
  permissions: string[];
}

export function AuthProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: UserPayload | null;
}) {
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [userPublicId, setUserPublicId] = useState<string>("");

  useEffect(() => {
    if (user) {
      setUserPublicId(user.publicId);
      setUserPermissions(user.permissions);
    }
  }, [user]);

  useEffect(() => {
    async function doSilentRefresh() {
      try {
        const resp = await fetch("/api/refresh", {
          method: "POST",
          credentials: "include",
        });

        const { userDetails } = await resp.json();
        setUserPublicId(userDetails.publicId);
        setUserPermissions(userDetails.permissions);
      } catch (err) {
        console.error("Silent refresh error: Possibly not logged in", err);
      } finally {
        setIsAuthLoaded(true);
      }
    }

    doSilentRefresh();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthLoaded, userPermissions, userPublicId }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
