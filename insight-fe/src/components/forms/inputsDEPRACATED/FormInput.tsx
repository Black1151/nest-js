import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useFormContext, RegisterOptions } from "react-hook-form";

interface FormInputProps {
  name: string;
  label: string;
  isRequired?: boolean;
  rules?: RegisterOptions; // From react-hook-form
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  isRequired,
  rules,
  type = "text",
  placeholder,
  ...rest
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <FormControl isRequired={isRequired} isInvalid={!!error} mb={4}>
      <FormLabel>{label}</FormLabel>
      <Input
        type={type}
        placeholder={placeholder}
        {...register(name, rules)}
        {...rest}
      />
      <FormErrorMessage>
        {error && (error.message as React.ReactNode)}
      </FormErrorMessage>
    </FormControl>
  );
};
