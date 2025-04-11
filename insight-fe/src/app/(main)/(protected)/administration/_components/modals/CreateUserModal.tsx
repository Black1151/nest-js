"use client";

import React, { useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Select,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { CreateUserDto, useMutation } from "@/gqty";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  const [createUser, { data, error, isLoading }] = useMutation(
    (mutation, args: { data: CreateUserDto }) => {
      const user = mutation.createUser({
        data: {
          ...args.data,
        },
      });
      user.id;
      return user;
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateUserDto>();

  const onSubmit = async (formData: CreateUserDto) => {
    try {
      const preparedData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth || undefined,
      };
      await createUser({ args: { data: preparedData } });
      reset();
      onClose();
    } catch (e) {
      console.error("Error creating user:", e);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New User</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form id="create-user-form" onSubmit={handleSubmit(onSubmit)}>
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

            {/* Password */}
            <FormControl isRequired mb={4} isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 12,
                    message: "Password must be at least 12 characters long",
                  },
                  validate: (value: string) => {
                    const hasUpperCase = /[A-Z]/.test(value);
                    const hasLowerCase = /[a-z]/.test(value);
                    const hasNumber = /[0-9]/.test(value);
                    const hasSymbol = /[^A-Za-z0-9]/.test(value);
                    if (!hasUpperCase) {
                      return "Password must contain at least one uppercase letter";
                    }
                    if (!hasLowerCase) {
                      return "Password must contain at least one lowercase letter";
                    }
                    if (!hasNumber) {
                      return "Password must contain at least one number";
                    }
                    if (!hasSymbol) {
                      return "Password must contain at least one symbol";
                    }
                    return true;
                  },
                })}
              />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose} mr={3}>
            Cancel
          </Button>
          <Button
            form="create-user-form"
            type="submit"
            colorScheme="blue"
            isLoading={isSubmitting}
          >
            Create User
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
