"use client";

import React, { useEffect } from "react";
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
import { useQuery, useMutation } from "@apollo/client";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";

const GET_SUBJECT = typedGql("query")({
  getSubject: [
    { data: $("data", "IdInput!") },
    { id: true, name: true },
  ],
} as const);

const UPDATE_SUBJECT = typedGql("mutation")({
  updateSubject: [{ data: $("data", "UpdateSubjectInput!") }, { id: true }],
} as const);

type FormValues = { name: string };

interface UpdateSubjectFormProps {
  subjectId: string;
  onSuccess: () => void;
}

export default function UpdateSubjectForm({ subjectId, onSuccess }: UpdateSubjectFormProps) {
  const { data, loading: loadingSubject } = useQuery(GET_SUBJECT, {
    variables: { data: { id: Number(subjectId) } },
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (data?.getSubject) {
      reset({ name: data.getSubject.name ?? "" });
    }
  }, [data, reset]);

  const [updateSubject, { loading }] = useMutation(UPDATE_SUBJECT, {
    onCompleted: onSuccess,
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    await updateSubject({
      variables: { data: { id: Number(subjectId), name: values.name.trim() } },
    });
  };

  const isLoading = loadingSubject || loading;

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} p={4}>
      <Stack spacing={6}>
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>Subject name</FormLabel>
          <Input
            placeholder="Subject name"
            {...register("name", { required: "Name is required" })}
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>
        <Button
          type="submit"
          colorScheme="blue"
          isDisabled={isSubmitting || isLoading}
          leftIcon={isSubmitting || isLoading ? <Spinner size="sm" /> : undefined}
        >
          Update Subject
        </Button>
      </Stack>
    </Box>
  );
}

