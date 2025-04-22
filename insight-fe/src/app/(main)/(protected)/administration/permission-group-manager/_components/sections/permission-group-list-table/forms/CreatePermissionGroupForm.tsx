import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { CreatePermissionGroupInput } from "@/gqty";

interface PermissionGroupFormProps {
  onSubmit: (data: CreatePermissionGroupInput) => Promise<void>;
}

export function CreatePermissionGroupForm({
  onSubmit,
}: PermissionGroupFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreatePermissionGroupInput>();

  const submitHandler: SubmitHandler<CreatePermissionGroupInput> = async (
    data
  ) => {
    await onSubmit(data);
    reset();
  };

  return (
    <form id="permission-group-form" onSubmit={handleSubmit(submitHandler)}>
      {/* Name */}
      <FormControl isRequired mb={4} isInvalid={!!errors.name}>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          {...register("name", {
            required: "Name is required",
          })}
        />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>

      {/* Description */}
      <FormControl isRequired mb={4} isInvalid={!!errors.description}>
        <FormLabel>Description</FormLabel>
        <Input
          type="text"
          {...register("description", {
            required: "Description is required",
          })}
        />
        <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
      </FormControl>

      <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
        Create Permission Group
      </Button>
    </form>
  );
}
