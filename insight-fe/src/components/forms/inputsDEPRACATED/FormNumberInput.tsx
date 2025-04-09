import React from "react";
import {
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  FormErrorMessage,
  FormControlProps,
} from "@chakra-ui/react";
import { useFormContext, RegisterOptions } from "react-hook-form";

interface FormNumberInputProps extends FormControlProps {
  name: string;
  label: string;
  placeholder?: string;
  rules?: RegisterOptions;
  isRequired?: boolean;
  min?: number;
  max?: number;
}

export const FormNumberInput: React.FC<FormNumberInputProps> = ({
  name,
  label,
  placeholder,
  rules,
  isRequired,
  min,
  max,
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
      <NumberInput min={min} max={max}>
        <NumberInputField
          id={name}
          placeholder={placeholder}
          {...register(name, rules)}
        />
      </NumberInput>
      <FormErrorMessage>
        {error && (error.message as React.ReactNode)}
      </FormErrorMessage>
    </FormControl>
  );
};
