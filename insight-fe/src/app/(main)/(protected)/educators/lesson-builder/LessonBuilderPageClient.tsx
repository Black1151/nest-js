"use client";

import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { useState, useRef } from "react";
import LessonEditor, { LessonEditorHandle } from "@/components/lesson/LessonEditor";
import YearGroupDropdown from "@/components/dropdowns/YearGroupDropdown";
import SubjectDropdown from "@/components/dropdowns/SubjectDropdown";
import SaveLessonModal from "@/components/lesson/SaveLessonModal";
import { useMutation } from "@apollo/client";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";

export const LessonBuilderPageClient = () => {
  const [yearGroupId, setYearGroupId] = useState<string | null>(null);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const editorRef = useRef<LessonEditorHandle>(null);

  const CREATE_LESSON = typedGql("mutation")({
    createLesson: [{ data: $("data", "CreateLessonInput!") }, { id: true }],
  } as const);

  const [createLesson, { loading: saving }] = useMutation(CREATE_LESSON, {
    onCompleted: () => setIsSaveOpen(false),
  });

  const handleSave = async ({ title, description }: { title: string; description: string }) => {
    if (!yearGroupId || !subjectId) return;
    const content = editorRef.current?.getContent() ?? { slides: [] };
    await createLesson({
      variables: {
        data: {
          title,
          description: description.length > 0 ? description : null,
          content,
          relationIds: [
            { relation: "recommendedYearGroups", ids: [Number(yearGroupId)] },
            { relation: "subject", ids: [Number(subjectId)] },
          ],
        },
      },
    });
  };

  return (
    <Flex direction="column" gap={4}>
      <Flex gap={8} alignItems="flex-end">
        <Box>
          <Text mb={2}>Year Group</Text>
          <YearGroupDropdown
            value={yearGroupId}
            onChange={(id) => {
              setYearGroupId(id);
              setSubjectId(null);
            }}
          />
        </Box>
        <Box>
          <Text mb={2}>Subject</Text>
          <SubjectDropdown
            yearGroupId={yearGroupId}
            value={subjectId}
            onChange={setSubjectId}
          />
        </Box>
        <Button
          onClick={() => setIsSaveOpen(true)}
          colorScheme="blue"
          isDisabled={!yearGroupId || !subjectId}
        >
          Save Lesson
        </Button>
      </Flex>

      <LessonEditor ref={editorRef} />
      <SaveLessonModal
        isOpen={isSaveOpen}
        onClose={() => setIsSaveOpen(false)}
        onSave={handleSave}
        isSaving={saving}
      />
    </Flex>
  );
};
