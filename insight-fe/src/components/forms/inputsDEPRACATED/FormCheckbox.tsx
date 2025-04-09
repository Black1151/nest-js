import React from "react";
import {
  FormControl,
  FormLabel,
  Checkbox,
  FormErrorMessage,
  FormControlProps,
} from "@chakra-ui/react";
import { useFormContext, RegisterOptions } from "react-hook-form";

interface FormCheckboxProps extends FormControlProps {
  name: string;
  label: string;
  rules?: RegisterOptions;
  isRequired?: boolean;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({
  name,
  label,
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
      display="flex"
      alignItems="center"
      mb={4}
      isRequired={isRequired}
      isInvalid={!!error}
      {...formControlProps}
    >
      <Checkbox id={name} {...register(name, rules)}>
        {label}
      </Checkbox>
      <FormErrorMessage>
        {error && (error.message as React.ReactNode)}
      </FormErrorMessage>
    </FormControl>
  );
};
