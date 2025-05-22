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

const UPDATE_TOPIC = gql`
  mutation UpdateTopic($data: UpdateTopicInput!) {
    updateTopic(data: $data) {
      id
    }
  }
`;

type FormValues = { name: string };

interface UpdateTopicFormProps {
  topicId: string;
  initialName: string;
  onSuccess: () => void;
}

export default function UpdateTopicForm({
  topicId,
  initialName,
  onSuccess,
}: UpdateTopicFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { name: initialName },
    mode: "onChange",
  });

  const [updateTopic, { loading }] = useMutation(UPDATE_TOPIC, {
    onCompleted: onSuccess,
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    await updateTopic({
      variables: {
        data: { id: topicId, name: values.name.trim() },
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
          isDisabled={isSubmitting || loading}
          leftIcon={isSubmitting || loading ? <Spinner size="sm" /> : undefined}
        >
          Update Topic
        </Button>
      </Stack>
    </Box>
  );
}
