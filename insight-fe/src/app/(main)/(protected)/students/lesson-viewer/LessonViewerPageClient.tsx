"use client";

import { HStack, Text, Spinner } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_LESSON } from "@/graphql/lesson";
import { Slide } from "@/components/lesson/slide/SlideSequencer";
import { LessonViewer } from "@/components/lesson/viewer";

export const LessonViewerPageClient = () => {
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("lessonId") || searchParams.get("id");

  const { data, loading } = useQuery(GET_LESSON, {
    skip: !lessonId,
    variables: lessonId ? { data: { id: Number(lessonId) } } : undefined,
  });

  const slides: Slide[] = (data?.getLesson?.content?.slides ?? []) as Slide[];

  if (!lessonId) {
    return <Text>No lesson selected.</Text>;
  }

  if (loading) {
    return (
      <HStack w="100%" justify="center" mt={8}>
        <Spinner />
      </HStack>
    );
  }

  return (
    <LessonViewer slides={slides} title={data?.getLesson?.title || "Lesson"} />
  );
};
