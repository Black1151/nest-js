// src/app/(main)/[protected]/administration/coordination-panel/_components/dropdowns/SubjectsDropdown/forms/CreateSubjectForm.tsx
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
import { Controller, useForm } from "react-hook-form";
import { CreateSubjectInput, useMutation, useQuery } from "@/gqty";

/* -------------------------------------------------------------------------- */
/* Types */
/* -------------------------------------------------------------------------- */

type FormValues = {
  name: string;
  yearGroupIds: string[];
};

/* -------------------------------------------------------------------------- */
/* Component */
/* -------------------------------------------------------------------------- */

export default function CreateSubjectForm({
  onSuccess,
}: {
  /** Called once the subject has been created successfully */
  onSuccess: (data: { name: string }) => void;
}) {
  /* ── React Hook Form --------------------------------------------------- */
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { name: "", yearGroupIds: [] },
    mode: "onChange",
  });

  /* ── Queries ----------------------------------------------------------- */
  const query = useQuery({ notifyOnNetworkStatusChange: false });
  const allYgArgs = React.useMemo(() => ({ data: { all: true } }), []);

  /**
   * <Stale‑while‑revalidate cache>
   */
  const [displayGroups, setDisplayGroups] = React.useState<
    ReturnType<typeof query.getAllYearGroup>
  >([]);
  const [hasFetchedOnce, setHasFetchedOnce] = React.useState(false);

  /**
   * Keep the last *valid* list while a background refetch is in flight.  We
   * only promote `fresh` when the network request has finished *and* the list
   * is either genuinely empty or contains at least one fully‑hydrated item
   * (`id` defined). This prevents the brief placeholder array (all ids
   * undefined) from replacing the real data and triggering the “no year groups
   * found” message.
   */
  React.useEffect(() => {
    if (query.$state.isLoading) return; // still fetching → keep stale data

    setHasFetchedOnce(true);

    const fresh = query.getAllYearGroup(allYgArgs) ?? [];
    const hasRealRows = fresh.some((yg) => yg?.id !== undefined);

    // Accept the update when it is either:
    //   a) truly empty (the server says there are zero year groups), or
    //   b) contains at least one real row (id defined).
    if (fresh.length === 0 || hasRealRows) {
      setDisplayGroups((prev) => {
        if (
          prev.length === fresh.length &&
          prev.every((p, i) => p?.id === fresh[i]?.id)
        ) {
          return prev; // unchanged
        }
        return fresh;
      });
    }
  }, [query.$state.isLoading, allYgArgs, query]);

  /**
   * Loading / empty flags
   */
  const isInitialLoadingYG = !hasFetchedOnce;

  const yearGroupOptions = React.useMemo(() => {
    return displayGroups
      .filter((yg): yg is NonNullable<typeof yg> => yg?.id !== undefined)
      .map((yg) => ({
        label: yg.year ?? `Year ${yg.id}`,
        value: String(yg.id),
      }));
  }, [displayGroups]);

  const showNoData = hasFetchedOnce && !query.$state.isLoading && yearGroupOptions.length === 0;

  /* ── Mutation ---------------------------------------------------------- */
  const [createSubject, { isLoading }] = useMutation((m, data: CreateSubjectInput) => {
    const created = m.createSubject({ data });
    created.id;
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createSubject({
        args: {
          name: values.name.trim(),
          relationIds: [
            { relation: "yearGroups", ids: values.yearGroupIds.map(Number) },
          ],
        },
      });
      onSuccess({ name: values.name.trim() });
    } catch (e) {
      setError("root", { message: (e as Error).message });
    }
  };

  /* ── Render ------------------------------------------------------------ */
  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} p={4}>
      <Stack spacing={6}>
        {/* ── Subject name ────────────────────────────────────────────── */}
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>Subject name</FormLabel>
          <Input
            placeholder="e.g. Maths"
            {...register("name", { required: "Name is required" })}
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>

        {/* ── Year‑group multi‑select ─────────────────────────────────── */}
        <FormControl isInvalid={!!errors.yearGroupIds}>
          <FormLabel>Year groups that offer this subject</FormLabel>

          {isInitialLoadingYG ? (
            <Spinner size="md" />
          ) : showNoData ? (
            <Text color="gray.500">No year groups found.</Text>
          ) : (
            <Controller
              control={control}
              name="yearGroupIds"
              rules={{
                validate: (v) =>
                  v.length > 0 || "Select at least one year group",
              }}
              render={({ field }) => (
                <CheckboxGroup
                  {...field}
                  onChange={(arr) => field.onChange(arr as string[])}
                >
                  <SimpleGrid columns={{ base: 2, md: 3 }} spacing={2}>
                    {yearGroupOptions.map((yg) => (
                      <Checkbox key={yg.value} value={yg.value} id={`yg-${yg.value}`}>
                        {yg.label}
                      </Checkbox>
                    ))}
                  </SimpleGrid>
                </CheckboxGroup>
              )}
            />
          )}
          <FormErrorMessage>{errors.yearGroupIds?.message}</FormErrorMessage>
        </FormControl>

        {/* ── Submit button ────────────────────────────────────────────── */}
        <Button
          type="submit"
          colorScheme="blue"
          isDisabled={!isValid || isSubmitting || isLoading}
          leftIcon={isSubmitting || isLoading ? <Spinner size="sm" /> : undefined}
        >
          {query.$state.isLoading && hasFetchedOnce && <Spinner size="xs" mr={2} />}
          Create subject
        </Button>

        {/* ── Root‑level error (e.g. server failure) ──────────────────── */}
        {errors.root && (
          <Text color="red.500" fontSize="sm">
            {errors.root.message}
          </Text>
        )}
      </Stack>
    </Box>
  );
}
