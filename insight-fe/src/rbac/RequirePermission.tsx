// components/RequirePermission.tsx
import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

interface Props {
  permission: string;
  fallback?: ReactNode;
  children: ReactNode;
}

export function RequirePermission({
  permission,
  children,
  fallback = null,
}: Props) {
  const { userPermissions } = useAuth();
  const hasPermission = userPermissions.includes(permission);

  return hasPermission ? <>{children}</> : <>{fallback}</>;
}
