// src/app/(main)/[protected]/administration/coordination-panel/_components/dropdowns/SubjectsDropdown/forms/UpdateSubjectForm.tsx
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
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";

import { UpdateSubjectInput, useMutation, useQuery } from "@/gqty";

type FormValues = { name: string; yearGroupIds: string[] };

export default function UpdateSubjectForm({
  subjectId,
  handleSubmit: handleSubmitProp,
}: {
  subjectId: number;
  handleSubmit: (data: UpdateSubjectInput) => void;
}) {
  const query = useQuery();

  /* preload current data */
  const subject = query.getSubject({
    data: { id: subjectId, relations: ["yearGroups"] },
  });

  const yearGroups = query.getAllYearGroup({ data: { all: true } }) ?? [];

  const {
    register,
    handleSubmit: rhfSubmit,
    control,
    setError,
  } = useForm<FormValues>({
    defaultValues: {
      name: subject?.name ?? "",
      yearGroupIds: subject?.yearGroups?.map((yg) => yg.id.toString()) ?? [],
    },
  });

  const [updateSubject, { isLoading }] = useMutation(
    (m, data: UpdateSubjectInput) => {
      const ret = m.updateSubject({ data });
      ret.id;
    }
  );

  const onSubmit = async (values: FormValues) => {
    try {
      await updateSubject({
        args: {
          id: subjectId.toString(),
          name: values.name.trim(),
          relationIds: [
            {
              relation: "yearGroups",
              ids: values.yearGroupIds.map(Number),
            },
          ],
        },
      });
      handleSubmitProp({ id: subjectId.toString(), name: values.name });
    } catch (e) {
      setError("root", { message: (e as Error).message });
    }
  };

  return (
    <Box as="form" onSubmit={rhfSubmit(onSubmit)} p={4}>
      <Stack spacing={6}>
        <FormControl isRequired>
          <FormLabel>Subject name</FormLabel>
          <Input
            placeholder="e.g. Maths"
            {...register("name", { required: true })}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Year groups that offer this subject</FormLabel>
          <Controller
            control={control}
            name="yearGroupIds"
            rules={{
              validate: (v) => v.length > 0 || "Select at least one year group",
            }}
            render={({ field }) => (
              <CheckboxGroup {...field}>
                <SimpleGrid columns={{ base: 2, md: 3 }} spacing={2}>
                  {yearGroups.map((yg) => (
                    <Checkbox key={yg.id} value={yg.id.toString()}>
                      {yg.year}
                    </Checkbox>
                  ))}
                </SimpleGrid>
              </CheckboxGroup>
            )}
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          isDisabled={isLoading}
          leftIcon={isLoading ? <Spinner size="sm" /> : undefined}
        >
          Update subject
        </Button>
      </Stack>
    </Box>
  );
}
