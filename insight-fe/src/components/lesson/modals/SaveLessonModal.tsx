"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  HStack,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { useLessonFilters } from "@/hooks/useLessonFilters";
import YearGroupDropdown from "@/components/dropdowns/YearGroupDropdown";
import SubjectDropdown from "@/components/dropdowns/SubjectDropdown";
import TopicDropdown from "@/components/dropdowns/TopicDropdown";
import { BaseModal } from "@/components/modals/BaseModal";

interface FormValues {
  title: string;
  description: string;
  yearGroupId: string | null;
  subjectId: string | null;
  topicId: string | null;
}

interface SaveLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormValues) => Promise<void>;
  isSaving?: boolean;
}

export default function SaveLessonModal({
  isOpen,
  onClose,
  onSave,
  isSaving = false,
}: SaveLessonModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      yearGroupId: null,
      subjectId: null,
      topicId: null,
    },
    mode: "onChange",
  });

  const {
    yearGroupId,
    subjectId,
    topicId,
    setYearGroupId,
    setSubjectId,
    setTopicId,
  } = useLessonFilters();

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    await onSave({
      title: values.title.trim(),
      description: values.description.trim(),
      yearGroupId,
      subjectId,
      topicId,
    });
    reset();
    setYearGroupId(null);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Save Lesson"
      footer={
        <HStack>
          <Button
            colorScheme="blue"
            type="submit"
            form="save-lesson-form"
            isLoading={isSaving}
            isDisabled={!yearGroupId || !subjectId || !topicId}
          >
            Save Lesson
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </HStack>
      }
    >
      <Stack
        as="form"
        id="save-lesson-form"
        onSubmit={handleSubmit(onSubmit)}
        spacing={4}
      >
        <FormControl isRequired>
          <FormLabel>Year Group</FormLabel>
          <YearGroupDropdown
            value={yearGroupId}
            onChange={(id) => setYearGroupId(id)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Subject</FormLabel>
          <SubjectDropdown
            yearGroupId={yearGroupId}
            value={subjectId}
            onChange={(id) => setSubjectId(id)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Topic</FormLabel>
          <TopicDropdown
            yearGroupId={yearGroupId}
            subjectId={subjectId}
            value={topicId}
            onChange={(id) => setTopicId(id)}
          />
        </FormControl>
        <FormControl isInvalid={!!errors.title} isRequired>
          <FormLabel>Lesson name</FormLabel>
          <Input
            {...register("title", { required: "Lesson name is required" })}
          />
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
