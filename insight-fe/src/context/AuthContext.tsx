// "use client";
// import { ensureRefresh } from "@/refreshClient";
// import React, { createContext, useContext, useState, useEffect } from "react";

// type AuthContextValue = {
//   isAuthLoaded: boolean;
//   roles: string[];
// };

// const AuthContext = createContext<AuthContextValue>({
//   isAuthLoaded: false,
//   roles: [],
// });

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [isAuthLoaded, setIsAuthLoaded] = useState(false);
//   const [roles, setRoles] = useState<string[]>([]);

//   useEffect(() => {
//     async function doSilentRefresh() {
//       try {
//         await ensureRefresh();
//       } catch (err) {
//         console.error("Silent refresh error: Possibly not logged in", err);
//       } finally {
//         setIsAuthLoaded(true);
//       }
//     }

//     doSilentRefresh();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ isAuthLoaded, roles }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }

"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type AuthContextValue = {
  isAuthLoaded: boolean;
  roles: string[];
};

const AuthContext = createContext<AuthContextValue>({
  isAuthLoaded: false,
  roles: [],
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    async function doSilentRefresh() {
      try {
        const resp = await fetch("/api/refresh", {
          method: "POST",
          credentials: "include",
        });
      } catch (err) {
        console.error("Silent refresh error: Possibly not logged in", err);
      } finally {
        setIsAuthLoaded(true);
      }
    }

    doSilentRefresh();
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
