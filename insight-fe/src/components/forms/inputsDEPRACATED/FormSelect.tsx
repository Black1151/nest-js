import React from "react";
import {
  FormControl,
  FormLabel,
  Select,
  FormErrorMessage,
  FormControlProps,
} from "@chakra-ui/react";
import { useFormContext, RegisterOptions } from "react-hook-form";

interface FormSelectProps extends FormControlProps {
  name: string;
  label: string;
  placeholder?: string;
  children?: React.ReactNode; // Typically <option> elements
  rules?: RegisterOptions;
  isRequired?: boolean;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  placeholder,
  children,
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
      <Select id={name} placeholder={placeholder} {...register(name, rules)}>
        {children}
      </Select>
      <FormErrorMessage>
        {error && (error.message as React.ReactNode)}
      </FormErrorMessage>
    </FormControl>
  );
};
