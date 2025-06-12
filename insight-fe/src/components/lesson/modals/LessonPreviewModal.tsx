"use client";

import { Box, Stack, Text, ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BaseModal } from "../../modals/BaseModal";
import SlidePreview from "../slide/SlidePreview";
import { Slide } from "../slide/SlideSequencer";
import { useQuery } from "@apollo/client";
import { GET_THEME, GET_COLOR_PALETTE } from "@/graphql/lesson";
import { ComponentVariant, SemanticTokens } from "@/theme/helpers";
import baseTheme from "@/theme/theme";

interface LessonPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: Slide[];
  themeId?: number;
  paletteId?: number;
}

export default function LessonPreviewModal({
  isOpen,
  onClose,
  slides,
  themeId,
  paletteId,
}: LessonPreviewModalProps) {
  const { data: themeData } = useQuery(GET_THEME, {
    variables: { id: String(themeId) },
    skip: !themeId || !isOpen,
  });

  const { data: paletteData } = useQuery(GET_COLOR_PALETTE, {
    variables: { id: String(paletteId) },
    skip: !paletteId || !isOpen,
  });

  const theme = themeData?.getTheme;
  const variants: ComponentVariant[] | undefined = theme?.componentVariants;

  const foundation = theme ? { ...(theme.foundationTokens as any) } : undefined;
  if (foundation?.colors && paletteData?.getColorPalette?.colors) {
    const keys = Object.keys(foundation.colors);
    const merged: Record<string, string> = {};
    keys.forEach((k) => {
      const found = paletteData.getColorPalette.colors.find(
        (c: { name: string; value: string }) => c.name === k,
      );
      merged[k] = found?.value ?? foundation.colors[k];
    });
    foundation.colors = merged;
  }
  const chakraTheme = theme
    ? extendTheme(baseTheme, {
        ...(foundation || {}),
        semanticTokens: theme.semanticTokens,
      })
    : baseTheme;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      title="Lesson Preview"
    >
      <ChakraProvider theme={chakraTheme}>
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
              tokens={chakraTheme}
              variants={variants}
            />
          </Box>
        ))}
        </Stack>
      </ChakraProvider>
    </BaseModal>
  );
}
