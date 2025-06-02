"use client";

import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { useState, useRef } from "react";
import LessonEditor, {
  LessonEditorHandle,
} from "@/components/lesson/LessonEditor";
import YearGroupDropdown from "@/components/dropdowns/YearGroupDropdown";
import SubjectDropdown from "@/components/dropdowns/SubjectDropdown";
import TopicDropdown from "@/components/dropdowns/TopicDropdown";
import SaveLessonModal from "@/components/lesson/SaveLessonModal";
import { useMutation } from "@apollo/client";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";

export const LessonBuilderPageClient = () => {
  const [yearGroupId, setYearGroupId] = useState<string | null>(null);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [topicId, setTopicId] = useState<string | null>(null);
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
  }: {
    title: string;
    description: string;
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
      <Flex gap={8} alignItems="flex-end">
        <Box>
          <Text mb={2}>Year Group</Text>
          <YearGroupDropdown
            value={yearGroupId}
            onChange={(id) => {
              setYearGroupId(id);
              setSubjectId(null);
              setTopicId(null);
            }}
          />
        </Box>
        <Box>
          <Text mb={2}>Subject</Text>
          <SubjectDropdown
            yearGroupId={yearGroupId}
            value={subjectId}
            onChange={(id) => {
              setSubjectId(id);
              setTopicId(null);
            }}
          />
        </Box>
        <Box>
          <Text mb={2}>Topic</Text>
          <TopicDropdown
            yearGroupId={yearGroupId}
            subjectId={subjectId}
            value={topicId}
            onChange={setTopicId}
          />
        </Box>
        <Button
          onClick={() => setIsSaveOpen(true)}
          colorScheme="blue"
          isDisabled={!yearGroupId || !subjectId || !topicId}
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
