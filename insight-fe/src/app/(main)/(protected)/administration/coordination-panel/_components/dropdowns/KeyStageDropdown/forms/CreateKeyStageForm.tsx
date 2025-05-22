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

const CREATE_KEY_STAGE = typedGql("mutation")({
  createKeyStage: [{ data: $("data", "CreateKeyStageInput!") }, { id: true }],
} as const);

type FormValues = { name: string; description?: string };

interface CreateKeyStageFormProps {
  onSuccess: () => void;
}

export default function CreateKeyStageForm({ onSuccess }: CreateKeyStageFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: { name: "", description: "" },
    mode: "onChange",
  });

  const [createKeyStage, { loading }] = useMutation(CREATE_KEY_STAGE, {
    onCompleted: onSuccess,
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    await createKeyStage({
      variables: {
        data: { name: values.name.trim(), description: values.description?.trim() || null },
      },
    });
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} p={4}>
      <Stack spacing={6}>
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>Name</FormLabel>
          <Input placeholder="Key Stage name" {...register("name", { required: "Name is required" })} />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Input placeholder="Description" {...register("description")} />
        </FormControl>
        <Button type="submit" colorScheme="blue" isDisabled={isSubmitting || loading}" leftIcon={(isSubmitting || loading) ? <Spinner size="sm" /> : undefined}>
          Create Key Stage
        </Button>
      </Stack>
    </Box>
  );
}

