// // UpdateSubjectForm.tsx
// "use client";

// import React, { useEffect } from "react";
// import {
//   Box,
//   Button,
//   Checkbox,
//   CheckboxGroup,
//   FormControl,
//   FormLabel,
//   Input,
//   SimpleGrid,
//   Spinner,
//   Stack,
//   FormErrorMessage,
// } from "@chakra-ui/react";
// import { Controller, useForm, SubmitHandler } from "react-hook-form";

// import { useQuery, useMutation } from "@apollo/client";
// import { typedGql } from "@/zeus/typedDocumentNode";
// import { $ } from "@/zeus";
// import { UpdateSubjectInput } from "@/__generated__/schema-types";

// /* -------------------------------------------------------------------------- */
// /* GraphQL documents                                                          */
// /* -------------------------------------------------------------------------- */

// const GET_SUBJECT = typedGql("query")({
//   getSubject: [
//     { data: $("data", "IdInput!") }, // { id, relations }
//     {
//       id: true,
//       name: true,
//       yearGroups: { id: true, year: true },
//     },
//   ],
// } as const);

// const GET_ALL_YEAR_GROUPS = typedGql("query")({
//   getAllYearGroup: [
//     { data: $("data", "IdRequestDto!") }, // { all: true }
//     { id: true, year: true },
//   ],
// } as const);

// const UPDATE_SUBJECT = typedGql("mutation")({
//   updateSubject: [{ data: $("data", "UpdateSubjectInput!") }, { id: true }],
// } as const);

// /* -------------------------------------------------------------------------- */
// /* Component                                                                  */
// /* -------------------------------------------------------------------------- */

// type FormValues = { name: string; yearGroupIds: string[] };

// interface UpdateSubjectFormProps {
//   subjectId: string; // GraphQL ID (string)
//   onSuccess: () => void; // callback after successful update
// }

// export default function UpdateSubjectForm({
//   subjectId,
//   onSuccess,
// }: UpdateSubjectFormProps) {
//   /* --------------------------- Queries --------------------------- */
//   const { data: subjectData, loading: loadingSubject } = useQuery(GET_SUBJECT, {
//     variables: {
//       data: { id: Number(subjectId), relations: ["yearGroups"] },
//     },
//   });

//   const { data: yearGroupsData, loading: loadingYGs } = useQuery(
//     GET_ALL_YEAR_GROUPS,
//     {
//       variables: { data: { id: Number(subjectId) } },
//     }
//   );

//   const subject = subjectData?.getSubject;
//   const yearGroups = yearGroupsData?.getAllYearGroup ?? [];

//   /* --------------------------- Form ------------------------------ */
//   const {
//     register,
//     handleSubmit,
//     control,
//     reset,
//     setError,
//     formState: { errors, isSubmitting },
//   } = useForm<FormValues>({
//     defaultValues: { name: "", yearGroupIds: [] },
//   });

//   /* Populate form once subject data arrives */
//   useEffect(() => {
//     if (subject) {
//       reset({
//         name: subject.name ?? "",
//         yearGroupIds: subject.yearGroups?.map((yg) => String(yg.id)) ?? [],
//       });
//     }
//   }, [subject, reset]);

//   /* ------------------------ Mutation ----------------------------- */
//   const [updateSubject, { loading: mutating }] = useMutation(UPDATE_SUBJECT);

//   const onSubmit: SubmitHandler<FormValues> = async (values) => {
//     try {
//       await updateSubject({
//         variables: {
//           data: {
//             id: subjectId,
//             name: values.name.trim(),
//             relationIds: [
//               { relation: "yearGroups", ids: values.yearGroupIds.map(Number) },
//             ],
//           } as UpdateSubjectInput,
//         },
//       });
//       onSuccess();
//     } catch (e) {
//       setError("root", { message: (e as Error).message });
//     }
//   };

//   const isLoading = loadingSubject || loadingYGs || mutating;

//   /* ------------------------ Render ------------------------------- */
//   if (loadingSubject) {
//     return (
//       <Box p={4}>
//         <Spinner size="lg" />
//       </Box>
//     );
//   }

//   return (
//     <Box as="form" onSubmit={handleSubmit(onSubmit)} p={4}>
//       <Stack spacing={6}>
//         {/* Name ------------------------------------------------------ */}
//         <FormControl isRequired isInvalid={!!errors.name}>
//           <FormLabel>Subject name</FormLabel>
//           <Input
//             placeholder="e.g. Maths"
//             {...register("name", { required: "Name is required" })}
//           />
//           <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
//         </FormControl>

//         {/* Year-groups ---------------------------------------------- */}
//         <FormControl isRequired isInvalid={!!errors.yearGroupIds}>
//           <FormLabel>Year groups that offer this subject</FormLabel>
//           <Controller
//             control={control}
//             name="yearGroupIds"
//             rules={{
//               validate: (v) => v.length > 0 || "Select at least one year group",
//             }}
//             render={({ field }) => (
//               <CheckboxGroup {...field}>
//                 <SimpleGrid columns={{ base: 2, md: 3 }} spacing={2}>
//                   {yearGroups.map((yg) => (
//                     <Checkbox key={String(yg.id)} value={String(yg.id)}>
//                       {yg.year}
//                     </Checkbox>
//                   ))}
//                 </SimpleGrid>
//               </CheckboxGroup>
//             )}
//           />
//           <FormErrorMessage>
//             {(errors.yearGroupIds as any)?.message}
//           </FormErrorMessage>
//         </FormControl>

//         {/* Submit ---------------------------------------------------- */}
//         <Button
//           type="submit"
//           colorScheme="blue"
//           isDisabled={isLoading}
//           leftIcon={isLoading ? <Spinner size="sm" /> : undefined}
//         >
//           Update subject
//         </Button>
//       </Stack>
//     </Box>
//   );
// }
