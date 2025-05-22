// CreateLessonForm.tsx
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
  Textarea,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";

/* -------------------------------------------------------------------------- */
/* GraphQL document                                                            */
/* -------------------------------------------------------------------------- */
const CREATE_LESSON = typedGql("mutation")({
  createLesson: [{ data: $("data", "CreateLessonInput!") }, { id: true }],
} as const);

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */
type FormValues = { title: string; description: string };

interface CreateLessonFormProps {
  topicId: string;
  onSuccess: () => void;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
export default function CreateLessonForm({
  topicId,
  onSuccess,
}: CreateLessonFormProps) {
  /* ── RHF setup ─────────────────────────────────────────────────────── */
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { title: "", description: "" },
    mode: "onChange",
  });

  /* ── Mutation: createLesson ────────────────────────────────────────── */
  const [createLesson, { loading }] = useMutation(CREATE_LESSON, {
    onCompleted: onSuccess,
  });

  /* ── Submit handler ───────────────────────────────────────────────── */
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    await createLesson({
      variables: {
        data: {
          title: values.title.trim(),
          description:
            values.description.trim().length > 0
              ? values.description.trim()
              : null,

          relationIds: [{ relation: "topic", ids: [Number(topicId)] }],
        },
      },
    });
  };

  /* ── UI ──────────────────────────────────────────────────────────── */
  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} p={4}>
      <Stack spacing={6}>
        {/* Title -------------------------------------------------------- */}
        <FormControl isInvalid={!!errors.title}>
          <FormLabel>Lesson name</FormLabel>
          <Input
            placeholder="Lesson name"
            {...register("title", { required: "Name is required" })}
          />
          <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
        </FormControl>

        {/* Description -------------------------------------------------- */}
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea placeholder="Description" {...register("description")} />
        </FormControl>

        {/* Submit ------------------------------------------------------- */}
        <Button
          type="submit"
          colorScheme="blue"
          isDisabled={!isValid || isSubmitting || loading}
          leftIcon={isSubmitting || loading ? <Spinner size="sm" /> : undefined}
        >
          Create Lesson
        </Button>
      </Stack>
    </Box>
  );
}
