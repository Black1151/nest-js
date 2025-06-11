"use client";

import { Flex, Button } from "@chakra-ui/react";
import { useState, useRef } from "react";
import LessonEditor from "@/components/lesson/LessonEditor";
import LessonPreviewModal from "@/components/lesson/modals/LessonPreviewModal";
import LoadLessonModal from "@/components/lesson/modals/LoadLessonModal";
import { useMutation, useLazyQuery } from "@apollo/client";
import { CREATE_LESSON, GET_LESSON, GET_THEME } from "@/graphql/lesson";
import { LessonEditorHandle } from "@/components/lesson/hooks/useLessonEditorState";
import { Slide } from "@/components/lesson/slide/SlideSequencer";
import SaveLessonModal from "@/components/lesson/modals/SaveLessonModal";

export const LessonBuilderPageClient = () => {
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isLoadOpen, setIsLoadOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewSlides, setPreviewSlides] = useState<Slide[]>([]);
  const [previewThemeId, setPreviewThemeId] = useState<number | undefined>();
  const editorRef = useRef<LessonEditorHandle>(null);

  const [createLesson, { loading: saving }] = useMutation(CREATE_LESSON, {
    onCompleted: () => setIsSaveOpen(false),
  });

  const [fetchLesson, { loading: loadingLesson }] = useLazyQuery(GET_LESSON);
  const [fetchTheme] = useLazyQuery(GET_THEME);

  const openPreview = () => {
    const slides = editorRef.current?.getContent().slides ?? [];
    setPreviewSlides(slides);
    const themeId = editorRef.current?.getThemeId();
    setPreviewThemeId(themeId === "" ? undefined : (themeId as number));
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
    const paletteId = editorRef.current?.getPaletteId?.() ?? null;
    await createLesson({
      variables: {
        data: {
          title,
          description: description.length > 0 ? description : null,
          content,
          themeId: themeId ? Number(themeId) : undefined,
          paletteId: paletteId ? Number(paletteId) : undefined,
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
    const lesson = data?.getLesson;
    const slides = lesson?.content?.slides ?? [];
    editorRef.current?.setContent(slides);

    const themeId = lesson?.themeId;
    if (themeId) {
      const themeRes = await fetchTheme({ variables: { id: String(themeId) } });
      const theme = themeRes.data?.getTheme;
      if (theme) {
        editorRef.current?.setTheme?.({
          id: theme.id,
          styleCollectionId: theme.styleCollectionId,
          defaultPaletteId: theme.defaultPaletteId,
        });
      }
    }
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
          themeId={previewThemeId}
        />
      )}
    </Flex>
  );
};
