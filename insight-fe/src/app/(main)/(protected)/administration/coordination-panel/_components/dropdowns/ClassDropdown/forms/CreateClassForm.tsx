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

interface FormValues {
  name: string;
}

interface CreateClassFormProps {
  onSubmit: (values: FormValues) => Promise<void>;
}

export function CreateClassForm({ onSubmit }: CreateClassFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ defaultValues: { name: "" } });

  const submitHandler: SubmitHandler<FormValues> = async (values) => {
    await onSubmit(values);
    reset();
  };

  return (
    <form id="class-form" onSubmit={handleSubmit(submitHandler)}>
      <FormControl isRequired mb={4} isInvalid={!!errors.name}>
        <FormLabel>Class name</FormLabel>
        <Input
          placeholder="e.g. 7A"
          {...register("name", { required: "Name is required" })}
        />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>
      <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
        Submit
      </Button>
    </form>
  );
}
