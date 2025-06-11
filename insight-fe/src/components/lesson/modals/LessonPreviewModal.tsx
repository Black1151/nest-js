"use client";

import { Box, Stack, Text } from "@chakra-ui/react";
import { BaseModal } from "../../modals/BaseModal";
import SlidePreview from "../slide/SlidePreview";
import { Slide } from "../slide/SlideSequencer";
import { useQuery } from "@apollo/client";
import {
  GET_COLOR_PALETTE,
  GET_COMPONENT_VARIANTS,
  GET_THEME,
} from "@/graphql/lesson";
import { ColorPalette, ComponentVariant } from "@/theme/helpers";

interface LessonPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: Slide[];
  paletteId?: number;
  themeId?: number;
}

export default function LessonPreviewModal({
  isOpen,
  onClose,
  slides,
  paletteId,
  themeId,
}: LessonPreviewModalProps) {
  const { data: themeData } = useQuery(GET_THEME, {
    variables: { id: String(themeId) },
    skip: !themeId || !isOpen,
  });

  const paletteIdToUse = paletteId ?? themeData?.getTheme?.defaultPaletteId;

  const { data: paletteData } = useQuery(GET_COLOR_PALETTE, {
    variables: { id: String(paletteIdToUse) },
    skip: !paletteIdToUse || !isOpen,
  });

  const { data: variantData } = useQuery(GET_COMPONENT_VARIANTS, {
    variables: { themeId: String(themeId) },
    skip: !themeId || !isOpen,
  });

  const palette: ColorPalette | undefined = paletteData?.getColorPalette;
  const variants: ComponentVariant[] | undefined = variantData?.getAllComponentVariant;

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
              palette={palette}
              variants={variants}
            />
          </Box>
        ))}
      </Stack>
    </BaseModal>
  );
}
