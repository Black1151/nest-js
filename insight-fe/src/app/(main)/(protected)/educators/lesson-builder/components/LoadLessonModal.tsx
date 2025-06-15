"use client";

import { useState, useEffect } from "react";
import { Button, Stack, FormControl, FormLabel } from "@chakra-ui/react";
import { BaseModal } from "@/components/modals/BaseModal";
import YearGroupDropdown from "@/components/dropdowns/YearGroupDropdown";
import SubjectDropdown from "@/components/dropdowns/SubjectDropdown";
import TopicDropdown from "@/components/dropdowns/TopicDropdown";
import LessonDropdown from "@/components/dropdowns/LessonDropdown";

interface LoadLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (lessonId: string) => void;
}

export default function LoadLessonModal({
  isOpen,
  onClose,
  onLoad,
}: LoadLessonModalProps) {
  const [yearGroupId, setYearGroupId] = useState<string | null>(null);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [topicId, setTopicId] = useState<string | null>(null);
  const [lessonId, setLessonId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setYearGroupId(null);
      setSubjectId(null);
      setTopicId(null);
      setLessonId(null);
    }
  }, [isOpen]);

  const isValid = !!lessonId;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Load Lesson">
      <Stack spacing={4}>
        <FormControl>
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
        <FormControl>
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
        <FormControl>
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
        <FormControl>
          <FormLabel>Lesson</FormLabel>
          <LessonDropdown
            topicId={topicId}
            value={lessonId}
            onChange={setLessonId}
          />
        </FormControl>
        <Button
          colorScheme="blue"
          isDisabled={!isValid}
          onClick={() => {
            if (lessonId) {
              onLoad(lessonId);
            }
          }}
        >
          Load
        </Button>
      </Stack>
    </BaseModal>
  );
}
