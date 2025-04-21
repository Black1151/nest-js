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
import { Role } from "@/gqty";

interface FormProps {
  onSubmit: (data: Role) => Promise<void>;
}

export function CreateRoleForm({ onSubmit }: FormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Role>();

  const submitHandler: SubmitHandler<Role> = async (data) => {
    const preparedData = {
      ...data,
    };

    await onSubmit(preparedData);
    reset();
  };

  return (
    <form id="user-form" onSubmit={handleSubmit(submitHandler)}>
      {/* First Name */}
      <FormControl isRequired mb={4} isInvalid={!!errors.name}>
        <FormLabel>Role name</FormLabel>
        <Input
          type="text"
          {...register("name", {
            required: "Role name is required",
          })}
        />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>

      {/* Last Name */}
      <FormControl isRequired mb={4} isInvalid={!!errors.description}>
        <FormLabel>Role description</FormLabel>
        <Input
          type="text"
          {...register("description", {
            required: "Role description is required",
          })}
        />
        <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
      </FormControl>

      <Button type="submit" colorScheme="blue">
        Submit
      </Button>
    </form>
  );
}
