"use client";

import { Box, Stack, Text } from "@chakra-ui/react";
import { BaseModal } from "../../modals/BaseModal";
import SlidePreview from "../slide/SlidePreview";
import { Slide } from "../slide/SlideSequencer";
import { useQuery } from "@apollo/client";
import { GET_THEME } from "@/graphql/lesson";
import { ComponentVariant, SemanticTokens } from "@/theme/helpers";

interface LessonPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: Slide[];
  themeId?: number;
}

export default function LessonPreviewModal({
  isOpen,
  onClose,
  slides,
  themeId,
}: LessonPreviewModalProps) {
  const { data: themeData } = useQuery(GET_THEME, {
    variables: { id: String(themeId) },
    skip: !themeId || !isOpen,
  });

  const theme = themeData?.getTheme;
  const tokens: SemanticTokens | undefined = theme?.semanticTokens;
  const variants: ComponentVariant[] | undefined = theme?.componentVariants;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      title="Lesson Preview"
    >
      <Stack spacing={6} py={2}>
        {slides.length === 0 && <Text>No slides available</Text>}
        {slides.map((slide) => (
          <Box key={slide.id}>
            <Text mb={2} fontWeight="bold">
              {slide.title}
            </Text>
            <SlidePreview
              columnMap={slide.columnMap}
              boards={slide.boards}
              tokens={tokens}
              variants={variants}
            />
          </Box>
        ))}
      </Stack>
    </BaseModal>
  );
}
