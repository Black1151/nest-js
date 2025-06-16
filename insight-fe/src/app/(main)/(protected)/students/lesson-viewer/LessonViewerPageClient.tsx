"use client";

import { VStack, HStack, Button, Text, Spinner } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_LESSON } from "@/graphql/lesson";
import { Slide } from "@/components/lesson/slide/SlideSequencer";
import { SlideRenderer } from "@/components/lesson/viewer";

export const LessonViewerPageClient = () => {
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("lessonId") || searchParams.get("id");

  const { data, loading } = useQuery(GET_LESSON, {
    skip: !lessonId,
    variables: lessonId ? { data: { id: Number(lessonId) } } : undefined,
  });

  const slides: Slide[] = (data?.getLesson?.content?.slides ?? []) as Slide[];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length) {
      setIndex(0);
    }
  }, [slides]);

  const prevSlide = () => setIndex((i) => Math.max(i - 1, 0));
  const nextSlide = () => setIndex((i) => Math.min(i + 1, slides.length - 1));

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

  const currentSlide = slides[index];

  return (
    <VStack w="100%" spacing={6} align="stretch">
      <Text fontSize="xl" fontWeight="bold">
        {data?.getLesson?.title || "Lesson"}
      </Text>
      {currentSlide ? (
        <SlideRenderer slide={currentSlide} />
      ) : (
        <Text>No slides in this lesson.</Text>
      )}
      <HStack justify="space-between">
        <Button onClick={prevSlide} isDisabled={index === 0}>
          Previous
        </Button>
        <Text>
          {slides.length > 0 ? index + 1 : 0} / {slides.length}
        </Text>
        <Button onClick={nextSlide} isDisabled={index + 1 >= slides.length}>
          Next
        </Button>
      </HStack>
    </VStack>
  );
};
