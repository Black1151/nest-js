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

  return hasAllPermissions ? <>{children}</> : <>{fallback}</>;
}
