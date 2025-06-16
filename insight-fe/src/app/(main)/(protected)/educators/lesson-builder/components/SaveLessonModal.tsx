"use client";
import { useState, useEffect } from "react";
import { Button, Stack, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { BaseModal } from "@/components/modals/BaseModal";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import YearGroupDropdown from "@/components/dropdowns/YearGroupDropdown";
import SubjectDropdown from "@/components/dropdowns/SubjectDropdown";
import TopicDropdown from "@/components/dropdowns/TopicDropdown";

interface SaveLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    yearGroupId?: string;
    subjectId?: string;
    topicId?: string;
  }) => void;
  initialName?: string;
  /**
   * When true, the modal acts as a simple confirmation dialog
   * for updating an existing lesson instead of collecting
   * creation details.
   */
  isExisting?: boolean;
}

export default function SaveLessonModal({
  isOpen,
  onClose,
  onSave,
  initialName,
  isExisting = false,
}: SaveLessonModalProps) {
  const [name, setName] = useState("");
  const [yearGroupId, setYearGroupId] = useState<string | null>(null);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [topicId, setTopicId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setName(initialName ?? "");
    setYearGroupId(null);
    setSubjectId(null);
    setTopicId(null);
  }, [isOpen, initialName]);

  const isValid = !!name && !!yearGroupId && !!subjectId && !!topicId;

  if (isExisting) {
    return (
      <ConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        action="update lesson"
        bodyText="Are you sure you want to update this lesson?"
        onConfirm={() => onSave({ name })}
      />
    );
  }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Save Lesson">
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>Lesson Name</FormLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Year Group</FormLabel>
          <YearGroupDropdown
            value={yearGroupId}
            onChange={(id) => {
              setYearGroupId(id);
              setSubjectId(null);
              setTopicId(null);
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Subject</FormLabel>
          <SubjectDropdown
            yearGroupId={yearGroupId}
            value={subjectId}
            onChange={(id) => {
              setSubjectId(id);
              setTopicId(null);
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Topic</FormLabel>
          <TopicDropdown
            yearGroupId={yearGroupId}
            subjectId={subjectId}
            value={topicId}
            onChange={setTopicId}
          />
        </FormControl>
        <Button
          colorScheme="blue"
          isDisabled={!isValid}
          onClick={() => {
            if (yearGroupId && subjectId && topicId) {
              onSave({ name, yearGroupId, subjectId, topicId });
            }
          }}
        >
          Save
        </Button>
      </Stack>
    </BaseModal>
  );
}
