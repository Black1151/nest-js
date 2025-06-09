"use client";

import { Flex, Button } from "@chakra-ui/react";
import { useState, useRef } from "react";
import LessonEditor from "@/components/lesson/LessonEditor";
import LessonPreviewModal from "@/components/lesson/modals/LessonPreviewModal";
import LoadLessonModal from "@/components/lesson/modals/LoadLessonModal";
import { useMutation, useLazyQuery } from "@apollo/client";
import { CREATE_LESSON, GET_LESSON } from "@/graphql/lesson";
import { LessonEditorHandle } from "@/components/lesson/hooks/useLessonEditorState";
import { Slide } from "@/components/lesson/slide/SlideSequencer";
import SaveLessonModal from "@/components/lesson/modals/SaveLessonModal";

export const LessonBuilderPageClient = () => {
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isLoadOpen, setIsLoadOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewSlides, setPreviewSlides] = useState<Slide[]>([]);
  const editorRef = useRef<LessonEditorHandle>(null);

  const [createLesson, { loading: saving }] = useMutation(CREATE_LESSON, {
    onCompleted: () => setIsSaveOpen(false),
  });

  const [fetchLesson, { loading: loadingLesson }] = useLazyQuery(GET_LESSON);

  const openPreview = () => {
    const slides = editorRef.current?.getContent().slides ?? [];
    setPreviewSlides(slides);
    setIsPreviewOpen(true);
  };

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
    const themeId = editorRef.current?.getThemeId() ?? null;
    await createLesson({
      variables: {
        data: {
          title,
          description: description.length > 0 ? description : null,
          content,
          themeId: themeId ? Number(themeId) : undefined,
          recommendedYearGroupIds: [Number(yearGroupId)],
          relationIds: [
            { relation: "subject", ids: [Number(subjectId)] },
            { relation: "topic", ids: [Number(topicId)] },
          ],
        },
      },
    });
  };

  const handleLoad = async (lessonId: string) => {
    const { data } = await fetchLesson({
      variables: { data: { id: Number(lessonId) } },
    });
    const slides = data?.getLesson?.content?.slides ?? [];
    editorRef.current?.setContent(slides);
    setIsLoadOpen(false);
  };

  return (
    <Flex direction="column" gap={4}>
      <Flex justifyContent="flex-end" gap={2}>
        <Button onClick={openPreview}>Show Preview</Button>
        <Button onClick={() => setIsLoadOpen(true)}>Load Lesson</Button>
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
      {isLoadOpen && (
        <LoadLessonModal
          isOpen={isLoadOpen}
          onClose={() => setIsLoadOpen(false)}
          onLoad={handleLoad}
          isLoading={loadingLesson}
        />
      )}
      {isPreviewOpen && (
        <LessonPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          slides={previewSlides}
        />
      )}
    </Flex>
  );
};
