"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Spinner, Center, Text } from "@chakra-ui/react";
// or your own components
// import { setAccessToken } from "@/lib/apolloClient"; // if you're storing tokens in memory for Apollo

export default function SsoHandlerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // These will be the query parameters from the URL: "?at=...&rt=..."
  const at = searchParams.get("at");
  const rt = searchParams.get("rt");

  useEffect(() => {
    // If we have tokens, store them and redirect to a logged-in route
    if (at && rt) {
      // Option 1: Store tokens in localStorage
      localStorage.setItem("accessToken", at);
      localStorage.setItem("refreshToken", rt);

      // Option 2: If you have a custom setAccessToken function for Apollo
      // setAccessToken(at);

      // Then redirect user to your dashboard or wherever
      router.push("/dashboard");
    } else {
      // If no tokens in the URL, likely user visited /auth/sso directly
      // or something went wrong with the SSO handshake.
      router.push("/auth/login");
    }
  }, [at, rt, router]);

  return (
    <Center height="100vh" flexDirection="column">
      <Spinner size="xl" mb={4} />
      <Text>Processing your SSO login...</Text>
    </Center>
  );
}
