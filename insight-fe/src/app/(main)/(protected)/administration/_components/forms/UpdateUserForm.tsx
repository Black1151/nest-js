"use client";

import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Select,
  Button,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { UpdateUserDto, useMutation, useQuery, User } from "@/gqty";

interface UserFormProps {
  publicId: string;
}

export function UpdateUserForm({ publicId }: UserFormProps) {
  // getting exiting data
  const query = useQuery();

  const user: User | null = publicId
    ? query.getUserByPublicId({ publicId })
    : null;

  // submitting changes to user record
  const [updateUserByPublicId] = useMutation(
    (mutation, formSubmissionData: UpdateUserDto) => {
      const mutationReturn = mutation.updateUserByPublicId({
        data: formSubmissionData,
        publicId,
      });
      mutationReturn.id;
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateUserDto>({
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
    },
  });

  const submitHandler: SubmitHandler<UpdateUserDto> = async (data) => {
    const preparedData = {
      ...data,
      dateOfBirth: data.dateOfBirth || undefined,
    };

    await updateUserByPublicId({ args: preparedData });
    reset();
  };

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

      <Button type="submit" colorScheme="blue">
        Submit
      </Button>
    </form>
  );
}
