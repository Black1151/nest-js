"use client";

import { BaseModal } from "../modals/BaseModal";
import { Button, FormControl, FormLabel, HStack, Stack } from "@chakra-ui/react";
import { useState } from "react";
import YearGroupDropdown from "@/components/dropdowns/YearGroupDropdown";
import SubjectDropdown from "@/components/dropdowns/SubjectDropdown";
import TopicDropdown from "@/components/dropdowns/TopicDropdown";
import LessonDropdown from "@/components/dropdowns/LessonDropdown";

interface LoadLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (lessonId: string) => Promise<void>;
  isLoading?: boolean;
}

export default function LoadLessonModal({
  isOpen,
  onClose,
  onLoad,
  isLoading = false,
}: LoadLessonModalProps) {
  const [yearGroupId, setYearGroupId] = useState<string | null>(null);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [topicId, setTopicId] = useState<string | null>(null);
  const [lessonId, setLessonId] = useState<string | null>(null);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Load Lesson"
      footer={
        <HStack>
          <Button
            colorScheme="blue"
            onClick={() => lessonId && onLoad(lessonId)}
            isDisabled={!lessonId}
            isLoading={isLoading}
          >
            Load Lesson
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </HStack>
      }
    >
      <Stack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Year Group</FormLabel>
          <YearGroupDropdown
            value={yearGroupId}
            onChange={(id) => {
              setYearGroupId(id);
              setSubjectId(null);
              setTopicId(null);
              setLessonId(null);
            }}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Subject</FormLabel>
          <SubjectDropdown
            yearGroupId={yearGroupId}
            value={subjectId}
            onChange={(id) => {
              setSubjectId(id);
              setTopicId(null);
              setLessonId(null);
            }}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Topic</FormLabel>
          <TopicDropdown
            yearGroupId={yearGroupId}
            subjectId={subjectId}
            value={topicId}
            onChange={(id) => {
              setTopicId(id);
              setLessonId(null);
            }}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Lesson</FormLabel>
          <LessonDropdown
            topicId={topicId}
            value={lessonId}
            onChange={(id) => setLessonId(id)}
          />
        </FormControl>
      </Stack>
    </BaseModal>
  );
}
