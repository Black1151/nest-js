import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useFormContext, RegisterOptions } from "react-hook-form";

interface FormEmailInputProps {
  name: string;
  label: string;
  placeholder?: string;
  rules?: RegisterOptions;
  isRequired?: boolean;
}

interface MyFormValues {
  email: string;
  [key: string]: any;
}

export const FormEmailInput: React.FC<FormEmailInputProps> = ({
  name,
  label,
  placeholder = "example@domain.com",
  rules,
  isRequired,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<MyFormValues>();

  const error = errors[name];

  const defaultEmailRules: RegisterOptions<MyFormValues, string> = {
    pattern: {
      value: /^\S+@\S+$/i,
      message: "Please enter a valid email address",
    },
  };

  const mergedRules = {
    ...defaultEmailRules,
    ...rules,
  } as RegisterOptions<MyFormValues, string>;

  return (
    <FormControl isInvalid={!!error} isRequired={isRequired} mb={4}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input
        id={name}
        type="email"
        placeholder={placeholder}
        {...register(name, mergedRules)}
      />
      <FormErrorMessage>
        {error && (error.message as React.ReactNode)}
      </FormErrorMessage>
    </FormControl>
  );
};
