"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Container,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
} from "@chakra-ui/react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  // We'll store any server error messages here to display in the UI
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Updated onSubmit to call the Next.js login route instead of a GraphQL mutation
  const onSubmit = async (formData: LoginSchema) => {
    setServerError(""); // clear any prior errors
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        setServerError(errorData.error || "Login failed.");
        return;
      }

      // Optionally read user info from the response, if your /api/login returns `{ user }`
      // e.g. const { user } = await res.json();

      // Cookies are now set HTTP-only by /api/login, so we can simply redirect or navigate
      router.push("/admin"); // or wherever your protected page is
    } catch (err) {
      console.error("Login error:", err);
      setServerError("An unexpected error occurred.");
    }
  };

  return (
    <Container maxW="sm" mt="40px">
      <Box textAlign="center" mb="6">
        <Heading>Login</Heading>
      </Box>

      <Box p="6" boxShadow="lg" borderRadius="md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl mb="4" isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>

          <FormControl mb="4" isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
            />
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>

          {/* Display server-side errors, if any */}
          {serverError && (
            <Box color="red.500" mb="4">
              {serverError}
            </Box>
          )}

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isLoading={isSubmitting}
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
}
