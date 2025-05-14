// CreateSubjectForm.tsx
import React, { useEffect, useState } from "react";
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
  VStack,
} from "@chakra-ui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  CreateSubjectInput,
  useLazyQuery,
  useMutation,
  useQuery,
} from "@/gqty";

type FormValues = {
  name: string;
  yearGroupIds: string[];
};

interface CreateSubjectFormProps {
  onSuccess: () => void;
}

export default function CreateSubjectForm({
  onSuccess,
}: CreateSubjectFormProps) {
  /* ── Form ─────────────────────────────────────────────────────────── */
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { name: "", yearGroupIds: [] },
    mode: "onChange",
  });

  const [loadData, { data, error, isCalled, isLoading: isFetchingYearGroups }] =
    useLazyQuery((query) => {
      const yearGroups = query.getAllYearGroup({ data: { all: true } });
      yearGroups.forEach((yg) => {
        yg.id;
        yg.year;
      });
      return { yearGroups };
    });

  // const getYearGroups  = async () => {
  //   const yearGroups = await loadData()
  //   return yearGroups
  // }

  // useEffect(() => {
  //   loadData();
  // }, []);

  /* ── Queries ──────────────────────────────────────────────────────── */
  // const query = useQuery({
  //   notifyOnNetworkStatusChange: true,
  //   suspense: false,
  // });
  // const yearGroups = query.getAllYearGroup({ data: { all: true } });
  // const isSelectOptiopnsLoading = query.$state.isLoading;

  // const yearGroupOptions = yearGroups.map((yg) => ({
  //   label: yg.year ?? `Year ${yg.id}`,
  //   value: String(yg.id),
  // }));

  /* ── Mutation ─────────────────────────────────────────────────────── */
  const [createSubject, { isLoading }] = useMutation(
    (m, data: CreateSubjectInput) => {
      const created = m.createSubject({ data });
      created.id; // keep selection for the cache
    },
    { onCompleted: onSuccess }
  );

  /* ── Submit handler ───────────────────────────────────────────────── */
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    await createSubject({
      args: {
        name: values.name,
        relationIds: [
          {
            relation: "yearGroups",
            ids: values.yearGroupIds.map(Number),
          },
        ],
      },
    });
  };

  /* ── Render ───────────────────────────────────────────────────────── */
  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} p={4}>
      {/* <Button onClick={() => executeGetYearGroups()}>Get year groups</Button> */}
      <Stack spacing={6}>
        {/* ── Subject name ──────────────────────────────────────────── */}
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>Subject name</FormLabel>
          <Input
            placeholder="e.g. Maths"
            {...register("name", { required: "Name is required" })}
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>

        {!isCalled && (
          <Button onClick={() => loadData()}>Get year groups</Button>
        )}

        {isFetchingYearGroups && <Spinner />}

        {/* ── Year-group multi-select ───────────────────────────────── */}
        <FormControl isInvalid={!!errors.yearGroupIds}>
          <FormLabel>Year groups that offer this subject</FormLabel>

          {data?.yearGroups?.length === 0 &&
            !isFetchingYearGroups &&
            !isLoading && <Text color="gray.500">No year groups found.</Text>}

          {data && isCalled && !isLoading && data.yearGroups.length > 0 && (
            <>
              <VStack>?.message</VStack>

              <Controller
                control={control}
                name="yearGroupIds"
                rules={{
                  validate: (v) =>
                    v.length > 0 || "Select at least one year group",
                }}
                render={({ field: { ref, onChange, value, ...rest } }) => (
                  <CheckboxGroup
                    value={value}
                    onChange={(arr) => onChange(arr as string[])}
                    {...rest}
                  >
                    <SimpleGrid columns={{ base: 2, md: 3 }} spacing={2}>
                      {data?.yearGroups?.map((yg) => {
                        console.log(yg.id);

                        if (!yg.id) return null;

                        return (
                          <VStack key={yg.id}>
                            <Text>{yg.id}</Text>
                            <Checkbox value={String(yg.id)} id={String(yg.id)}>
                              {yg.year}
                            </Checkbox>
                          </VStack>
                        );
                      })}
                    </SimpleGrid>
                  </CheckboxGroup>
                )}
              />
            </>
          )}

          <FormErrorMessage>{errors.yearGroupIds?.message}</FormErrorMessage>
        </FormControl>

        {/* ── Submit button ──────────────────────────────────────────── */}
        <Button
          type="submit"
          colorScheme="blue"
          isDisabled={!isValid || isSubmitting || isLoading}
          leftIcon={
            isSubmitting || isLoading ? <Spinner size="sm" /> : undefined
          }
        >
          Create subject
        </Button>
      </Stack>
    </Box>
  );
}
