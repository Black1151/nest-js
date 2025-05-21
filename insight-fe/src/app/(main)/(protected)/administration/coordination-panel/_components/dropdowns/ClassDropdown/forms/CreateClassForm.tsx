"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
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

interface CreateClassFormProps {
  yearGroupId: string;
  subjectId: string;
  onSuccess: () => void;
}

type FormValues = {
  name: string;
  educatorIds: string[];
  studentIds: string[];
};

const GET_YEAR = typedGql("query")({
  getYearGroup: [
    { data: $("data", "IdInput!") },
    { id: true, year: true },
  ],
} as const);

const GET_USERS = typedGql("query")({
  getAllUsers: [
    { data: { limit: 1000, offset: 0 } },
    {
      id: true,
      firstName: true,
      lastName: true,
      userType: true,
      studentProfile: { id: true, schoolYear: true },
      educatorProfile: { id: true },
    },
  ],
} as const);

const CREATE_CLASS = typedGql("mutation")({
  createClass: [{ data: $("data", "CreateClassInput!") }, { id: true }],
} as const);

export default function CreateClassForm({
  yearGroupId,
  subjectId,
  onSuccess,
}: CreateClassFormProps) {
  const { register, handleSubmit, control, formState } = useForm<FormValues>({
    defaultValues: { name: "", educatorIds: [], studentIds: [] },
    mode: "onChange",
  });

  const { data: ygData } = useQuery(GET_YEAR, {
    variables: { data: { id: Number(yearGroupId) } },
    skip: !yearGroupId,
  });

  const { data: usersData, loading: loadingUsers } = useQuery(GET_USERS);

  const [createClass, { loading: creating }] = useMutation(CREATE_CLASS, {
    onCompleted: onSuccess,
  });

  const yearNumber = useMemo(() => {
    const y = ygData?.getYearGroup?.year ?? "";
    const match = /\d+/.exec(y);
    return match ? Number(match[0]) : undefined;
  }, [ygData]);

  const students = useMemo(() => {
    if (!usersData) return [] as any[];
    return usersData.getAllUsers.filter(
      (u: any) =>
        u.userType === "student" &&
        u.studentProfile &&
        yearNumber === u.studentProfile.schoolYear
    );
  }, [usersData, yearNumber]);

  const educators = useMemo(() => {
    if (!usersData) return [] as any[];
    return usersData.getAllUsers.filter((u: any) => u.userType === "educator");
  }, [usersData]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    await createClass({
      variables: {
        data: {
          name: values.name.trim(),
          yearGroupId: Number(yearGroupId),
          subjectId: Number(subjectId),
          educatorIds: values.educatorIds.map(Number),
          studentIds: values.studentIds.map(Number),
        },
      },
    });
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} p={4}>
      <Stack spacing={6}>
        <FormControl isRequired>
          <FormLabel>Class name</FormLabel>
          <Input placeholder="e.g. 7A Maths" {...register("name", { required: true })} />
        </FormControl>

        <FormControl>
          <FormLabel>Educators</FormLabel>
          {loadingUsers && <Spinner />}
          {!loadingUsers && (
            <Controller
              control={control}
              name="educatorIds"
              render={({ field: { value, onChange } }) => (
                <CheckboxGroup value={value} onChange={onChange}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                    {educators.map((e) => (
                      <Checkbox key={e.id} value={String(e.educatorProfile.id)}>
                        {e.firstName} {e.lastName}
                      </Checkbox>
                    ))}
                  </SimpleGrid>
                </CheckboxGroup>
              )}
            />
          )}
        </FormControl>

        <FormControl>
          <FormLabel>Students</FormLabel>
          {loadingUsers && <Spinner />}
          {!loadingUsers && (
            <Controller
              control={control}
              name="studentIds"
              render={({ field: { value, onChange } }) => (
                <CheckboxGroup value={value} onChange={onChange}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                    {students.map((s) => (
                      <Checkbox key={s.id} value={String(s.studentProfile.id)}>
                        {s.firstName} {s.lastName}
                      </Checkbox>
                    ))}
                  </SimpleGrid>
                </CheckboxGroup>
              )}
            />
          )}
        </FormControl>

        <Button type="submit" colorScheme="blue" isDisabled={!formState.isValid || creating}>
          {creating ? <Spinner size="sm" /> : "Create class"}
        </Button>
      </Stack>
    </Box>
  );
}

