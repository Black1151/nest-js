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

const CREATE_TOPIC = gql`
  mutation CreateTopic($data: CreateTopicInput!) {
    createTopic(data: $data) {
      id
    }
  }
`;

type FormValues = { name: string };

interface CreateTopicFormProps {
  yearGroupId: string;
  subjectId: string;
  onSuccess: () => void;
}

export default function CreateTopicForm({
  yearGroupId,
  subjectId,
  onSuccess,
}: CreateTopicFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { name: "" },
    mode: "onChange",
  });

  const [createTopic, { loading }] = useMutation(CREATE_TOPIC, {
    onCompleted: onSuccess,
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    await createTopic({
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

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} p={4}>
      <Stack spacing={6}>
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>Topic name</FormLabel>
          <Input
            placeholder="Topic name"
            {...register("name", { required: "Name is required" })}
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>
        <Button
          type="submit"
          colorScheme="blue"
          isDisabled={!isValid || isSubmitting || loading}
          leftIcon={isSubmitting || loading ? <Spinner size="sm" /> : undefined}
        >
          Create Topic
        </Button>
      </Stack>
    </Box>
  );
}
