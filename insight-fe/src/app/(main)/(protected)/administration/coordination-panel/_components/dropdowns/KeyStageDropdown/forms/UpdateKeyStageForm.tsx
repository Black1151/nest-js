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

const UPDATE_KEY_STAGE = typedGql("mutation")({
  updateKeyStage: [{ data: $("data", "UpdateKeyStageInput!") }, { id: true }],
} as const);

type FormValues = { name: string; description?: string };

interface UpdateKeyStageFormProps {
  keyStageId: string;
  initialName: string;
  initialDescription?: string | null;
  onSuccess: () => void;
}

export default function UpdateKeyStageForm({
  keyStageId,
  initialName,
  initialDescription,
  onSuccess,
}: UpdateKeyStageFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    defaultValues: { name: initialName, description: initialDescription ?? "" },
    mode: "onChange",
  });

  const [updateKeyStage, { loading }] = useMutation(UPDATE_KEY_STAGE, {
    onCompleted: onSuccess,
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    await updateKeyStage({
      variables: {
        data: {
          id: keyStageId,
          name: values.name.trim(),
          description: values.description?.trim() || null,
        },
      },
    });
    reset(values);
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
          Update Key Stage
        </Button>
      </Stack>
    </Box>
  );
}

