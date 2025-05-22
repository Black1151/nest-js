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
import { gql, useMutation } from "@apollo/client";

const CREATE_LESSON = gql`
  mutation CreateLesson($data: CreateLessonInput!) {
    createLesson(data: $data) {
      id
    }
  }
`;

type FormValues = { title: string; description: string };

interface CreateLessonFormProps {
  topicId: string;
  onSuccess: () => void;
}

export default function CreateLessonForm({ topicId, onSuccess }: CreateLessonFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { title: "", description: "" },
    mode: "onChange",
  });

  const [createLesson, { loading }] = useMutation(CREATE_LESSON, {
    onCompleted: onSuccess,
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    await createLesson({
      variables: {
        data: {
          title: values.title.trim(),
          description:
            values.description.trim().length > 0
              ? values.description.trim()
              : null,
          topicId: Number(topicId),
        },
      },
    });
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} p={4}>
      <Stack spacing={6}>
        <FormControl isInvalid={!!errors.title}>
          <FormLabel>Lesson name</FormLabel>
          <Input
            placeholder="Lesson name"
            {...register("title", { required: "Name is required" })}
          />
          <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea placeholder="Description" {...register("description")} />
        </FormControl>

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
