// CreateSubjectForm.tsx
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

/* -------------------------------------------------------------------------- */
/* GraphQL documents                                                          */
/* -------------------------------------------------------------------------- */

const CREATE_CLASS = typedGql("mutation")({
  createClass: [{ data: $("data", "CreateClassInput!") }, { id: true }],
} as const);

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */
type FormValues = { name: string };
interface CreateSubjectFormProps {
  yearGroupId: string;
  subjectId: string;
  onSuccess: () => void;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
export default function CreateSubjectForm({
  yearGroupId,
  subjectId,
  onSuccess,
}: CreateSubjectFormProps) {
  /* ── RHF setup ─────────────────────────────────────────────────────── */
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { name: "" },
    mode: "onChange",
  });

  /* ── Mutation: createSubject ──────────────────────────────────────── */
  const [createClass, { loading: creating }] = useMutation(CREATE_CLASS, {
    onCompleted: onSuccess,
  });

  /* ── Submit handler ──────────────────────────────────────────────── */
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    await createClass({
      variables: {
        data: {
          name: values.name.trim(),
          relationIds: [
            { relation: "yearGroup", ids: [yearGroupId] },
            { relation: "subject", ids: [subjectId] },
          ],
        },
      },
    });
  };

  /* ── UI ──────────────────────────────────────────────────────────── */
  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} p={4}>
      <Stack spacing={6}>
        {/* Subject name ------------------------------------------------ */}
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>Class name</FormLabel>
          <Input
            placeholder="Class name"
            {...register("name", { required: "Name is required" })}
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>

        {/* Submit ------------------------------------------------------- */}
        <Button
          type="submit"
          colorScheme="blue"
          isDisabled={!isValid || isSubmitting || creating}
          leftIcon={
            isSubmitting || creating ? <Spinner size="sm" /> : undefined
          }
        >
          Create Class
        </Button>
      </Stack>
    </Box>
  );
}
