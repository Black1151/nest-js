"use client";

import { Box, Stack, Text, ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BaseModal } from "../../modals/BaseModal";
import SlidePreview from "../slide/SlidePreview";
import { Slide } from "../slide/SlideSequencer";
import { useQuery } from "@apollo/client";
import { GET_THEME, GET_COLOR_PALETTE } from "@/graphql/lesson";
import { ComponentVariant, SemanticTokens, ColorPalette } from "@/theme/helpers";
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

  const palette: ColorPalette | undefined = paletteData?.getColorPalette;

  const theme = themeData?.getTheme;
  const variants: ComponentVariant[] | undefined = theme?.componentVariants;

  const foundation = theme ? { ...(theme.foundationTokens as any) } : undefined;
  if (foundation?.colors && palette) {
    const paletteMap = palette.colors.reduce(
      (acc: Record<string, string>, cur: { name: string; value: string }) => {
        acc[cur.name] = cur.value;
        return acc;
      },
      {},
    );
    const merged: Record<string, string> = {};
    Object.entries(foundation.colors).forEach(([k, val]) => {
      merged[k] = paletteMap[k] ?? (val as string);
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
