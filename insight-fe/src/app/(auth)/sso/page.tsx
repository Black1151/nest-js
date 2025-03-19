"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Spinner, Center, Text } from "@chakra-ui/react";

export default function SsoHandlerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const at = searchParams.get("at");
  const rt = searchParams.get("rt");

  useEffect(() => {
    if (at && rt) {
      localStorage.setItem("accessToken", at);
      localStorage.setItem("refreshToken", rt);
      router.push("/dashboard");
    } else {
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
