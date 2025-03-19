"use client";

import React, { useEffect } from "react";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SomeProtectedPage() {
  const { isAuthLoaded, roles } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoaded) {
      // If user is not an Admin, redirect away
      //   if (!roles.includes("Editor")) {
      //     router.replace("/unauthorized");
      //   }
    }
  }, [isAuthLoaded, roles, router]);

  if (!isAuthLoaded) {
    return <div>Loading...</div>;
  }
  return <div>Protected Content Here</div>;
}
