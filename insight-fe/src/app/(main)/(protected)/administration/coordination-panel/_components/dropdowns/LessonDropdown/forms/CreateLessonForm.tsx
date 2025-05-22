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

const CREATE_LESSON = gql`
  mutation CreateLesson($data: CreateLessonInput!) {
    createLesson(data: $data) {
      id
    }
  }
`;

type FormValues = { title: string };

interface CreateLessonFormProps {
  topicId: string;
  onSuccess: () => void;
}

export default function CreateLessonForm({
  topicId,
  onSuccess,
}: CreateLessonFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { title: "" },
    mode: "onChange",
  });

  const [createLesson, { loading }] = useMutation(CREATE_LESSON, {
    onCompleted: onSuccess,
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    await createLesson({
      variables: {
        data: { title: values.title.trim(), topicId: Number(topicId) },
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
          isDisabled={!isValid || isSubmitting || loading}
          leftIcon={isSubmitting || loading ? <Spinner size="sm" /> : undefined}
        >
          Create Lesson
        </Button>
      </Stack>
    </Box>
  );
}
