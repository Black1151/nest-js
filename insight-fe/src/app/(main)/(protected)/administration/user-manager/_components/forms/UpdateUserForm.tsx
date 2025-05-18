"use client";

import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Select,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { UpdateUserWithProfileInput } from "@/__generated__/schema-types";
// import { UpdateUserRequestDto, useMutation, useQuery, User } from "@/gqty";
import { $ } from "@/zeus";
import { typedGql } from "@/zeus/typedDocumentNode";

import { useQuery, useMutation } from "@apollo/client";
import { USER_LIST_TABLE_LOAD_USERS } from "../sections/user/UserListTable";
import { LoadingSpinnerCard } from "@/components/loading/LoadingSpinnerCard";
import { ContentCard } from "@/components/layout/Card";
import { USER_DETAILS_GET_USER_BY_PUBLIC_ID } from "../sections/user/user-details-section/UserDetailsDisplay";

export const UPDATE_USER_BY_PUBLIC_ID = typedGql("mutation")({
  updateUserByPublicId: [
    {
      publicId: $("publicId", "String!"),
      data: $("data", "UpdateUserWithProfileInput!"),
    },
    {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      updatedAt: true,
    },
  ],
});

interface UserFormProps {
  publicId: string;
  onClose: () => void;
}

export function UpdateUserForm({ publicId, onClose }: UserFormProps) {
  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery(USER_DETAILS_GET_USER_BY_PUBLIC_ID, {
    variables: { data: { publicId } },
  });

  const toast = useToast();

  const user = userData?.getUserByPublicId;

  const [updateUserByPublicId] = useMutation(UPDATE_USER_BY_PUBLIC_ID, {
    refetchQueries: [
      {
        query: USER_DETAILS_GET_USER_BY_PUBLIC_ID,
        variables: { data: { publicId } },
      },
      {
        query: USER_LIST_TABLE_LOAD_USERS,
        variables: { data: { limit: 10, offset: 0 } },
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast({
        title: "User updated",
        description: "User updated successfully",
        status: "success",
      });
      onClose();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateUserWithProfileInput>({
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
      addressLine1: user?.addressLine1,
      addressLine2: user?.addressLine2,
      city: user?.city,
      county: user?.county,
      postalCode: user?.postalCode,
      country: user?.country,
      dateOfBirth: user?.dateOfBirth,
      educatorProfile: user?.educatorProfile
        ? { staffId: user.educatorProfile.staffId }
        : undefined,
      studentProfile: user?.studentProfile
        ? {
            studentId: user.studentProfile.studentId,
            schoolYear: user.studentProfile.schoolYear,
          }
        : undefined,
    },
  });

  const submitHandler: SubmitHandler<UpdateUserWithProfileInput> = async (
    data
  ) => {
    const { studentProfile, educatorProfile, ...userFields } = data;
    const preparedData = {
      ...data,
      dateOfBirth: data.dateOfBirth || undefined,
    };
    await updateUserByPublicId({ variables: { data: preparedData, publicId } });

    reset();
    onClose();
  };

  if (userLoading) return <LoadingSpinnerCard text="Loading user..." />;
  if (userError)
    return <ContentCard>Error loading user: {userError.message}</ContentCard>;

  return (
    <form id="user-form" onSubmit={handleSubmit(submitHandler)}>
      {/* First Name */}
      <FormControl isRequired mb={4} isInvalid={!!errors.firstName}>
        <FormLabel>First Name</FormLabel>
        <Input
          type="text"
          {...register("firstName", {
            required: "First name is required",
          })}
        />
        <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
      </FormControl>

      {/* Last Name */}
      <FormControl isRequired mb={4} isInvalid={!!errors.lastName}>
        <FormLabel>Last Name</FormLabel>
        <Input
          type="text"
          {...register("lastName", {
            required: "Last name is required",
          })}
        />
        <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
      </FormControl>

      {/* Email */}
      <FormControl isRequired mb={4} isInvalid={!!errors.email}>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Please enter a valid email address",
            },
          })}
        />
        <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
      </FormControl>

      {/* Phone Number */}
      <FormControl mb={4} isInvalid={!!errors.phoneNumber}>
        <FormLabel>Phone Number</FormLabel>
        <Input
          type="tel"
          {...register("phoneNumber", {
            pattern: {
              value: /^[+0-9\s-]+$/,
              message: "Please enter a valid phone number",
            },
          })}
        />
        <FormErrorMessage>{errors.phoneNumber?.message}</FormErrorMessage>
      </FormControl>

      {/* Address Line 1 */}
      <FormControl mb={4}>
        <FormLabel>Address Line 1</FormLabel>
        <Input type="text" {...register("addressLine1")} />
      </FormControl>

      {/* Address Line 2 */}
      <FormControl mb={4}>
        <FormLabel>Address Line 2</FormLabel>
        <Input type="text" {...register("addressLine2")} />
      </FormControl>

      {/* City */}
      <FormControl mb={4}>
        <FormLabel>City</FormLabel>
        <Input type="text" {...register("city")} />
      </FormControl>

      {/* County */}
      <FormControl mb={4}>
        <FormLabel>County</FormLabel>
        <Input type="text" {...register("county")} />
      </FormControl>

      {/* Postal Code */}
      <FormControl mb={4}>
        <FormLabel>Postal Code</FormLabel>
        <Input type="text" {...register("postalCode")} />
      </FormControl>

      {/* Country */}
      <FormControl mb={4}>
        <FormLabel>Country</FormLabel>
        <Select placeholder="Select country" {...register("country")}>
          <option value="US">United States</option>
          <option value="GB">United Kingdom</option>
          <option value="CA">Canada</option>
        </Select>
      </FormControl>

      {/* Date of Birth */}
      <FormControl mb={4}>
        <FormLabel>Date of Birth</FormLabel>
        <Input type="date" {...register("dateOfBirth")} />
      </FormControl>

      {/* Conditionally show Student fields */}
      {user?.studentProfile && (
        <>
          <FormControl
            isRequired
            mb={4}
            isInvalid={!!errors.studentProfile?.studentId}
          >
            <FormLabel>Student ID</FormLabel>
            <Input
              type="number"
              {...register("studentProfile.studentId", {
                required: "Student ID is required",
                valueAsNumber: true,
              })}
            />
            <FormErrorMessage>
              {errors.studentProfile?.studentId?.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            mb={4}
            isInvalid={!!errors.studentProfile?.schoolYear}
          >
            <FormLabel>School Year</FormLabel>
            <Input
              type="number"
              {...register("studentProfile.schoolYear", {
                required: "School year is required",
                valueAsNumber: true,
              })}
            />
            <FormErrorMessage>
              {errors.studentProfile?.schoolYear?.message}
            </FormErrorMessage>
          </FormControl>
        </>
      )}

      {/* Conditionally show Educator fields */}
      {user?.educatorProfile && (
        <FormControl
          isRequired
          mb={4}
          isInvalid={!!errors.educatorProfile?.staffId}
        >
          <FormLabel>Staff ID</FormLabel>
          <Input
            type="number"
            {...register("educatorProfile.staffId", {
              required: "Staff ID is required",
              valueAsNumber: true,
            })}
          />
          <FormErrorMessage>
            {errors.educatorProfile?.staffId?.message}
          </FormErrorMessage>
        </FormControl>
      )}

      <Button type="submit" colorScheme="blue">
        Submit
      </Button>
    </form>
  );
}
