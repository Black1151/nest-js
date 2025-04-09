import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  FormControlProps,
} from "@chakra-ui/react";
import { useFormContext, RegisterOptions } from "react-hook-form";

interface FormPasswordInputProps extends FormControlProps {
  name: string;
  label: string;
  placeholder?: string;
  rules?: RegisterOptions;
  isRequired?: boolean;
}

export const FormPasswordInput: React.FC<FormPasswordInputProps> = ({
  name,
  label,
  placeholder = "••••••••••••",
  rules,
  isRequired,
  ...formControlProps
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <FormControl
      isRequired={isRequired}
      isInvalid={!!error}
      mb={4}
      {...formControlProps}
    >
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input
        id={name}
        type="password"
        placeholder={placeholder}
        {...register(name, rules)}
      />
      <FormErrorMessage>
        {error && (error.message as React.ReactNode)}
      </FormErrorMessage>
    </FormControl>
  );
};
