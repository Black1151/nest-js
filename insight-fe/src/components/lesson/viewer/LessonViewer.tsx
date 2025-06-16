"use client";

import { VStack, HStack, Button, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Slide } from "@/components/lesson/slide/SlideSequencer";
import SlideRenderer from "./SlideRenderer";

export interface LessonViewerProps {
  slides: Slide[];
  title?: string;
}

export const LessonViewer = ({ slides, title }: LessonViewerProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [slides]);

  const prevSlide = () => setIndex((i) => Math.max(i - 1, 0));
  const nextSlide = () => setIndex((i) => Math.min(i + 1, slides.length - 1));

  const currentSlide = slides[index];

  return (
    <VStack w="100%" spacing={6} align="stretch">
      {title && (
        <Text fontSize="xl" fontWeight="bold">
          {title}
        </Text>
      )}
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

export default LessonViewer;
