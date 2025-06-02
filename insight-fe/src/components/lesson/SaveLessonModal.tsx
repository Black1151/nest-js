import { BaseModal } from "../modals/BaseModal";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, FormControl, FormLabel, Input, FormErrorMessage, HStack, Stack, Textarea } from "@chakra-ui/react";

interface FormValues {
  title: string;
  description: string;
}

interface SaveLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormValues) => Promise<void>;
  isSaving?: boolean;
}

export default function SaveLessonModal({ isOpen, onClose, onSave, isSaving = false }: SaveLessonModalProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    defaultValues: { title: "", description: "" },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    await onSave({
      title: values.title.trim(),
      description: values.description.trim(),
    });
    reset();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Save Lesson"
      footer={
        <HStack>
          <Button colorScheme="blue" type="submit" form="save-lesson-form" isLoading={isSaving}>
            Save Lesson
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </HStack>
      }
    >
      <Stack as="form" id="save-lesson-form" onSubmit={handleSubmit(onSubmit)} spacing={4}>
        <FormControl isInvalid={!!errors.title} isRequired>
          <FormLabel>Lesson name</FormLabel>
          <Input {...register("title", { required: "Lesson name is required" })} />
          <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea {...register("description")} />
        </FormControl>
      </Stack>
    </BaseModal>
  );
}
