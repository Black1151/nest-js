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

import { CreateYearGroupInput } from "@/__generated__/schema-types"; // ← updated import

/* -------------------------------------------------------------------------- */
/* Props                                                                      */
/* -------------------------------------------------------------------------- */
interface CreateYearGroupFormProps {
  onSubmit: (data: CreateYearGroupInput) => Promise<void>;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
export function CreateYearGroupForm({ onSubmit }: CreateYearGroupFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateYearGroupInput>();

  const submitHandler: SubmitHandler<CreateYearGroupInput> = async (
    formData
  ) => {
    await onSubmit(formData);
    reset();
  };

  return (
    <form id="year-group-form" onSubmit={handleSubmit(submitHandler)}>
      {/* Key Stage ID (optional) ----------------------------------------- */}
      <FormControl mb={4} isInvalid={!!errors.keyStageId}>
        <FormLabel>Key Stage ID</FormLabel>
        <Input type="text" {...register("keyStageId")} placeholder="e.g. KS2" />
        <FormErrorMessage>{errors.keyStageId?.message}</FormErrorMessage>
      </FormControl>

      {/* Year (required) -------------------------------------------------- */}
      <FormControl isRequired mb={4} isInvalid={!!errors.year}>
        <FormLabel>Year</FormLabel>
        <Input
          type="number"
          placeholder="e.g. 2025"
          {...register("year", {
            required: "Year is required",
            valueAsNumber: true,
          })}
        />
        <FormErrorMessage>{errors.year?.message}</FormErrorMessage>
      </FormControl>

      <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
        Submit
      </Button>
    </form>
  );
}
