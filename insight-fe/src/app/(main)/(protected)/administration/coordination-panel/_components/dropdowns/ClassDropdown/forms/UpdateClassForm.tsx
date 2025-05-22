"use client";

import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";

import { useMutation } from "@apollo/client";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";
import { UpdateClassInput } from "@/__generated__/schema-types";

/* -------------------------------------------------------------------------- */
/* GraphQL document                                                           */
/* -------------------------------------------------------------------------- */
const UPDATE_CLASS = typedGql("mutation")({
  updateClass: [{ data: $("data", "UpdateClassInput!") }, { id: true }],
} as const);

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */
type FormValues = { name: string };
interface UpdateClassFormProps {
  classId: string;
  initialName: string;
  onSuccess: () => void;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
export default function UpdateClassForm({
  classId,
  initialName,
  onSuccess,
}: UpdateClassFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { name: initialName },
    mode: "onChange",
  });

  const [updateClass, { loading: updating }] = useMutation(UPDATE_CLASS, {
    onCompleted: onSuccess,
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    await updateClass({
      variables: {
        data: { id: classId, name: values.name.trim() } as UpdateClassInput,
      },
    });
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} p={4}>
      <Stack spacing={6}>
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>Class name</FormLabel>
          <Input
            placeholder="Class name"
            {...register("name", { required: "Name is required" })}
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          isDisabled={isSubmitting || updating}
          leftIcon={
            isSubmitting || updating ? <Spinner size="sm" /> : undefined
          }
        >
          Update Class
        </Button>
      </Stack>
    </Box>
  );
}

