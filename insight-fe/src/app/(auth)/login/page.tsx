"use client";
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

// GraphQL/Apollo-related imports
import { from, useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "@/graphql/auth/mutations";
import { setAccessToken } from "@/lib/apolloClient";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const [loginMutation, { loading, error }] = useMutation(LOGIN_MUTATION);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission for standard email/password
  const onSubmit = async (formData: LoginSchema) => {
    try {
      const { data } = await loginMutation({
        variables: formData,
      });
      if (data?.login?.accessToken) {
        setAccessToken(data.login.accessToken);
        localStorage.setItem("refreshToken", data.login.refreshToken);
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 1) Handler for "Sign in with Google"
  const handleGoogleSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
  };

  // 2) Handler for "Sign in with Microsoft"
  const handleMicrosoftSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/microsoft`;
  };

  return (
    <Container maxW="sm" mt="40px">
      <Box textAlign="center" mb="6">
        <Heading>Login</Heading>
      </Box>

      <Box p="6" boxShadow="lg" borderRadius="md">
        {/* Standard email/password form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl mb="4" isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl mb="4" isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>

          {error && (
            <Box color="red.500" mb="4">
              {error.message}
            </Box>
          )}

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isLoading={loading}
          >
            Login
          </Button>
        </form>

        {/* SSO Buttons */}
        <Box display="flex" flexDirection="column" gap={2} mt={4}>
          <Button onClick={handleGoogleSignIn}>Sign in with Google</Button>
          <Button onClick={handleMicrosoftSignIn}>
            Sign in with Microsoft
          </Button>
          {/* If you had Apple (removed, but for reference) */}
          {/* <Button onClick={handleAppleSignIn}>Sign in with Apple</Button> */}
        </Box>
      </Box>
    </Container>
  );
}
