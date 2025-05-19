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
import { CreateRoleInput } from "@/__generated__/schema-types";

/* -------------------------------------------------------------------------- */
/* Props                                                                      */
/* -------------------------------------------------------------------------- */
interface FormProps {
  onSubmit: (data: CreateRoleInput) => Promise<void>;
  isLoading: boolean;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
export function CreateRoleForm({ onSubmit, isLoading }: FormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateRoleInput>();

  const submitHandler: SubmitHandler<CreateRoleInput> = async (data) => {
    await onSubmit(data);
    reset();
  };

  return (
    <form id="role-form" onSubmit={handleSubmit(submitHandler)}>
      {/* Role name --------------------------------------------------------- */}
      <FormControl isRequired mb={4} isInvalid={!!errors.name}>
        <FormLabel>Role&nbsp;name</FormLabel>
        <Input
          type="text"
          placeholder="e.g. Course Administrator"
          {...register("name", {
            required: "Role name is required",
          })}
        />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>

      {/* Role description -------------------------------------------------- */}
      <FormControl isRequired mb={4} isInvalid={!!errors.description}>
        <FormLabel>Role&nbsp;description</FormLabel>
        <Input
          type="text"
          placeholder="Short description of the role"
          {...register("description", {
            required: "Role description is required",
          })}
        />
        <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
      </FormControl>

      <Button type="submit" colorScheme="blue" isLoading={isLoading}>
        Submit
      </Button>
    </form>
  );
}
