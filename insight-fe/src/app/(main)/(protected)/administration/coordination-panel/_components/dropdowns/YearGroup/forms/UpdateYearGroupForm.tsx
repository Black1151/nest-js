"use client";

import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Select,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";

import { UpdateYearGroupInput } from "@/__generated__/schema-types"; // ← updated import

/* -------------------------------------------------------------------------- */
/* Props                                                                      */
/* -------------------------------------------------------------------------- */
interface UpdateYearGroupFormProps {
  onSubmit: (data: UpdateYearGroupInput) => Promise<void>;
  initialData?: Partial<UpdateYearGroupInput>;
  /* If you have key -stage records from a query, accept them here instead
     and map to <option> elements rather than using the static KS list below.
  */
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
export function UpdateYearGroupForm({
  onSubmit,
  initialData,
}: UpdateYearGroupFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateYearGroupInput>({
    defaultValues: {
      id: initialData?.id ?? "",
      keyStageId: initialData?.keyStageId ?? "",
      year: initialData?.year,
    },
  });

  const submitHandler: SubmitHandler<UpdateYearGroupInput> = async (
    formData
  ) => {
    await onSubmit(formData);
    reset();
  };

  return (
    <form id="update-year-group-form" onSubmit={handleSubmit(submitHandler)}>
      {/* ID --------------------------------------------------------------- */}
      <FormControl isRequired mb={4} isInvalid={!!errors.id}>
        <FormLabel>Year-group ID</FormLabel>
        <Input
          type="text"
          placeholder="Unique identifier"
          {...register("id", { required: "ID is required" })}
        />
        <FormErrorMessage>{errors.id?.message}</FormErrorMessage>
      </FormControl>

      {/* Key-stage -------------------------------------------------------- */}
      <FormControl mb={4} isInvalid={!!errors.keyStageId}>
        <FormLabel>Key Stage</FormLabel>
        <Select placeholder="Select key stage" {...register("keyStageId")}>
          {/* Replace with dynamic options if you fetch them */}
          <option value="KS1">KS1</option>
          <option value="KS2">KS2</option>
          <option value="KS3">KS3</option>
          <option value="KS4">KS4</option>
          <option value="KS5">KS5</option>
        </Select>
        <FormErrorMessage>{errors.keyStageId?.message}</FormErrorMessage>
      </FormControl>

      {/* Year ------------------------------------------------------------ */}
      <FormControl mb={4} isInvalid={!!errors.year}>
        <FormLabel>Year</FormLabel>
        <Select
          placeholder="Choose year"
          {...register("year", { valueAsNumber: true })}
        >
          <option value={7}>Year 7</option>
          <option value={8}>Year 8</option>
          <option value={9}>Year 9</option>
          <option value={10}>Year 10</option>
          <option value={11}>Year 11</option>
          <option value={12}>Year 12</option>
          <option value={13}>Year 13</option>
        </Select>
        <FormErrorMessage>{errors.year?.message}</FormErrorMessage>
      </FormControl>

      <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
        Update
      </Button>
    </form>
  );
}
