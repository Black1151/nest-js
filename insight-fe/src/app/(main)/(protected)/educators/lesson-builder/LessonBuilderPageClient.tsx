"use client";

import { Flex, Button } from "@chakra-ui/react";
import { useState, useRef } from "react";
import LessonEditor, { LessonEditorHandle } from "@/components/lesson/LessonEditor";
import SaveLessonModal from "@/components/lesson/SaveLessonModal";
import { useMutation } from "@apollo/client";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";

export const LessonBuilderPageClient = () => {
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const editorRef = useRef<LessonEditorHandle>(null);

  const CREATE_LESSON = typedGql("mutation")({
    createLesson: [{ data: $("data", "CreateLessonInput!") }, { id: true }],
  } as const);

  const [createLesson, { loading: saving }] = useMutation(CREATE_LESSON, {
    onCompleted: () => setIsSaveOpen(false),
  });

  const handleSave = async ({
    title,
    description,
    yearGroupId,
    subjectId,
    topicId,
  }: {
    title: string;
    description: string;
    yearGroupId: string | null;
    subjectId: string | null;
    topicId: string | null;
  }) => {
    if (!yearGroupId || !subjectId || !topicId) return;
    const content = editorRef.current?.getContent() ?? { slides: [] };
    await createLesson({
      variables: {
        data: {
          title,
          description: description.length > 0 ? description : null,
          content,
          recommendedYearGroupIds: [Number(yearGroupId)],
          relationIds: [
            { relation: "subject", ids: [Number(subjectId)] },
            { relation: "topic", ids: [Number(topicId)] },
          ],
        },
      },
    });
  };

  return (
    <Flex direction="column" gap={4}>
      <Flex justifyContent="flex-end">
        <Button onClick={() => setIsSaveOpen(true)} colorScheme="blue">
          Save Lesson
        </Button>
      </Flex>

      <LessonEditor ref={editorRef} />
      {isSaveOpen && (
        <SaveLessonModal
          isOpen={isSaveOpen}
          onClose={() => setIsSaveOpen(false)}
          onSave={handleSave}
          isSaving={saving}
        />
      )}
    </Flex>
  );
};
