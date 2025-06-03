"use client";

import { Box, Stack, Text } from "@chakra-ui/react";
import { BaseModal } from "../modals/BaseModal";
import SlidePreview from "./SlidePreview";
import { Slide } from "./SlideSequencer";

interface LessonPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: Slide[];
}

export default function LessonPreviewModal({
  isOpen,
  onClose,
  slides,
}: LessonPreviewModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size="6xl" title="Lesson Preview">
      <Stack spacing={6} py={2}>
        {slides.length === 0 && <Text>No slides available</Text>}
        {slides.map((slide) => (
          <Box key={slide.id}>
            <Text mb={2} fontWeight="bold">
              {slide.title}
            </Text>
            <SlidePreview columnMap={slide.columnMap} boards={slide.boards} />
          </Box>
        ))}
      </Stack>
    </BaseModal>
  );
}
