// pages/oauth-redirect.tsx
"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { setAccessToken } from "@/lib/apolloClient";

export default function OAuthRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setAccessToken(token);
    }
    router.push("/dashboard");
  }, [searchParams, router]);

  return <div>Redirecting...</div>;
}
