// app/(protected)/layout.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const refreshToken = cookies().get("refreshToken")?.value;
  if (!refreshToken) {
    return redirect("/login");
  }

  return <>{children}</>;
}
