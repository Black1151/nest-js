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
import { UpdateYearGroupInput } from "@/gqty";

interface UpdateYearGroupFormProps {
  onSubmit: (data: UpdateYearGroupInput) => Promise<void>;
  initialData?: Partial<UpdateYearGroupInput>;
}

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
      id: initialData?.id || "",
      keyStageId: initialData?.keyStageId || "",
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
      {/* ID (required) */}
      <FormControl isRequired mb={4} isInvalid={!!errors.id}>
        <FormLabel>Year Group ID</FormLabel>
        <Input
          type="text"
          {...register("id", { required: "ID is required" })}
          placeholder="Unique identifier"
        />
        <FormErrorMessage>{errors.id?.message}</FormErrorMessage>
      </FormControl>
      {/* Key Stage ID (optional) - This needs to be mapped to the key stage data types on the BE !!!!!!!!!!!!!!!!!!!!!*/}
      // update the belwo to a select
      <FormControl mb={4} isInvalid={!!errors.keyStageId}>
        <FormLabel>Key Stage ID</FormLabel>
        <Input type="text" {...register("keyStageId")} placeholder="e.g. KS2" />
        <FormErrorMessage>{errors.keyStageId?.message}</FormErrorMessage>
      </FormControl>
      {/* Year (optional) -  This needs to be mapped to the year group data types on the BE !!!!!!!!!!!!!!!!!!!!!*/}
      <FormControl mb={4} isInvalid={!!errors.year}>
        <FormLabel>Year</FormLabel>
        <Select
          {...register("year", {
            valueAsNumber: true,
          })}
          placeholder="e.g. 2025"
        >
          <option value="Year7">Year 7</option>
          <option value="Year8">Year 8</option>
          <option value="Year9">Year 9</option>
          <option value="Year10">Year 10</option>
          <option value="Year11">Year 11</option>
          <option value="Year12">Year 12</option>
          <option value="Year13">Year 13</option>
        </Select>
        <FormErrorMessage>{errors.year?.message}</FormErrorMessage>
      </FormControl>
      <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
        Update
      </Button>
    </form>
  );
}
