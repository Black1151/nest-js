// hooks/usePermissionRedirect.ts
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * Redirects to the specified path if the user lacks **any** of the given permissions.
 *
 * @param permissions - Array of required permission strings
 * @param redirectPath - Optional path to redirect to (defaults to "/unauthorised")
 */
interface PermissionRedirectProps {
  permissions: string[];
  redirectPath?: string;
}

export function usePermissionRedirect({
  permissions,
  redirectPath = "/unauthorised",
}: PermissionRedirectProps) {
  const { userPermissions } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // if (!userPermissions) return;

    const hasAll = permissions.every((perm) => userPermissions.includes(perm));

    if (!hasAll) {
      router.replace(redirectPath);
    }
  }, [userPermissions, permissions, redirectPath, router]);
}
