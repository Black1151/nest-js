import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

interface Props {
  permissions: string[];
  fallback?: ReactNode;
  children: ReactNode;
}

export function RequirePermission({
  permissions,
  children,
  fallback = null,
}: Props) {
  const { userPermissions } = useAuth();
  const hasAllPermissions = permissions.every((permission) =>
    userPermissions.includes(permission)
  );

  // /// DEV BYPASS
  // if (process.env.NODE_ENV === "development") {
  //   return <>{children}</>;
  // }
  // ///

  return hasAllPermissions ? <>{children}</> : <>{fallback}</>;
}
