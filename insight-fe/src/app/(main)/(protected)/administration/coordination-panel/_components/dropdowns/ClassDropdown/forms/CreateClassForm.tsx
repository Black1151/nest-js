"use client";

import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";

import { CreateClassInput } from "@/__generated__/schema-types";

interface CreateClassFormProps {
  onSubmit: (data: CreateClassInput) => Promise<void>;
  isLoading?: boolean;
}

export default function CreateClassForm({
  onSubmit,
  isLoading = false,
}: CreateClassFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateClassInput>();

  const submitHandler: SubmitHandler<CreateClassInput> = async (formData) => {
    await onSubmit({ name: formData.name.trim() });
    reset();
  };

  return (
    <form id="create-class-form" onSubmit={handleSubmit(submitHandler)}>
      <FormControl isRequired mb={4} isInvalid={!!errors.name}>
        <FormLabel>Class name</FormLabel>
        <Input
          type="text"
          placeholder="e.g. 7A Maths"
          {...register("name", { required: "Name is required" })}
        />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>

      <Button type="submit" colorScheme="blue" isLoading={isSubmitting || isLoading}>
        Create Class
      </Button>
    </form>
  );
}
