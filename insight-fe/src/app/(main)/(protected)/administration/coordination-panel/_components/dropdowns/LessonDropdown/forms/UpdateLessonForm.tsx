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
import { gql, useMutation } from "@apollo/client";

const UPDATE_LESSON = gql`
  mutation UpdateLesson($data: UpdateLessonInput!) {
    updateLesson(data: $data) {
      id
    }
  }
`;

type FormValues = { title: string };

interface UpdateLessonFormProps {
  lessonId: string;
  initialTitle: string;
  onSuccess: () => void;
}

export default function UpdateLessonForm({
  lessonId,
  initialTitle,
  onSuccess,
}: UpdateLessonFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { title: initialTitle },
    mode: "onChange",
  });

  const [updateLesson, { loading }] = useMutation(UPDATE_LESSON, {
    onCompleted: onSuccess,
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    await updateLesson({
      variables: {
        data: { id: Number(lessonId), title: values.title.trim() },
      },
    });
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} p={4}>
      <Stack spacing={6}>
        <FormControl isInvalid={!!errors.title}>
          <FormLabel>Lesson title</FormLabel>
          <Input
            placeholder="Lesson title"
            {...register("title", { required: "Title is required" })}
          />
          <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
        </FormControl>
        <Button
          type="submit"
          colorScheme="blue"
          isDisabled={isSubmitting || loading}
          leftIcon={isSubmitting || loading ? <Spinner size="sm" /> : undefined}
        >
          Update Lesson
        </Button>
      </Stack>
    </Box>
  );
}
