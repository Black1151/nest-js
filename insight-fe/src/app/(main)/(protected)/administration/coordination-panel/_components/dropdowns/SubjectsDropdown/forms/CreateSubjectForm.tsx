// CreateSubjectForm.tsx
"use client";

import React from "react";
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Controller, useForm, SubmitHandler } from "react-hook-form";

import { useQuery, useMutation } from "@apollo/client";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";

/* -------------------------------------------------------------------------- */
/* GraphQL documents                                                          */
/* -------------------------------------------------------------------------- */

const GET_ALL_YEAR_GROUPS = typedGql("query")({
  getAllYearGroup: [
    { data: $("data", "FindAllInput!") }, // { all: true }
    { id: true, year: true },
  ],
} as const);

const CREATE_SUBJECT = typedGql("mutation")({
  createTest: [{ data: $("data", "CreateSubjectInput!") }, { id: true }],
} as const);

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */
type FormValues = { name: string; yearGroupIds: string[] };

interface CreateSubjectFormProps {
  onSuccess: () => void;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
export default function CreateSubjectForm({
  onSuccess,
}: CreateSubjectFormProps) {
  /* ── RHF setup ─────────────────────────────────────────────────────── */
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { name: "", yearGroupIds: [] },
    mode: "onChange",
  });

  /* ── Query: all year groups (auto on mount) ───────────────────────── */
  const {
    data: ygData,
    loading: loadingYGs,
    error: ygError,
  } = useQuery(GET_ALL_YEAR_GROUPS, { variables: { data: { all: true } } });
  const yearGroups = ygData?.getAllYearGroup ?? [];

  /* ── Mutation: createSubject ──────────────────────────────────────── */
  const [createSubject, { loading: creating }] = useMutation(CREATE_SUBJECT, {
    onCompleted: onSuccess,
  });

  /* ── Submit handler ──────────────────────────────────────────────── */
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    console.log(values.yearGroupIds);

    await createSubject({
      variables: {
        data: {
          name: values.name.trim(),
          relationIds: [{ relation: "yearGroup", ids: values.yearGroupIds }],
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
          <FormLabel>Subject name</FormLabel>
          <Input
            placeholder="e.g. Maths"
            {...register("name", { required: "Name is required" })}
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>

        {/* Year-groups -------------------------------------------------- */}
        <FormControl isInvalid={!!errors.yearGroupIds}>
          <FormLabel>Year groups that offer this subject</FormLabel>

          {/* Loading / error / empty states */}
          {loadingYGs && <Spinner />}
          {ygError && <Text color="red.500">Failed to load year groups.</Text>}
          {!loadingYGs && !ygError && yearGroups.length === 0 && (
            <Text color="gray.500">No year groups found.</Text>
          )}

          {/* Checkbox grid */}
          {yearGroups.length > 0 && (
            <Controller
              control={control}
              name="yearGroupIds"
              defaultValue={[]}
              rules={{
                validate: (v) =>
                  v.length > 0 || "Select at least one year group",
              }}
              render={({ field: { value, onChange } }) => (
                <CheckboxGroup value={value} onChange={onChange}>
                  <SimpleGrid columns={{ base: 2, md: 3 }} spacing={2}>
                    {yearGroups.map((yg) => (
                      <Checkbox
                        key={String(yg.id)}
                        value={String(yg.id)}
                        id={`yeargroup-${yg.id}`}
                      >
                        {yg.year}
                      </Checkbox>
                    ))}
                  </SimpleGrid>
                </CheckboxGroup>
              )}
            />
          )}

          <FormErrorMessage>{errors.yearGroupIds?.message}</FormErrorMessage>
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
          Create subject
        </Button>
      </Stack>
    </Box>
  );
}
