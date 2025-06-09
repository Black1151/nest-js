"use client";

import { Accordion } from "@chakra-ui/react";
import useStyleAttributes from "../hooks/useStyleAttributes";
import WrapperSettings from "../attributes/WrapperSettings";
import { Slide } from "../slide/SlideSequencer";

interface SlideAttributesPaneProps {
  slide: Slide;
  onChange: (updated: Slide) => void;
  colorPalettes?: { id: number; name: string; colors: string[] }[];
  selectedPaletteId?: number | "";
}

export default function SlideAttributesPane({
  slide,
  onChange,
  colorPalettes,
  selectedPaletteId,
}: SlideAttributesPaneProps) {
  const styleAttrs = useStyleAttributes({
    wrapperStyles: slide.wrapperStyles,
    spacing: slide.spacing,
    deps: [slide.id],
    defaultBgOpacity: 1,
    onChange: ({ wrapperStyles, spacing }) =>
      onChange({ ...slide, wrapperStyles, spacing }),
  });

  return (
    <Accordion allowMultiple>
      <WrapperSettings
        attrs={styleAttrs}
        colorPalettes={colorPalettes}
        selectedPaletteId={selectedPaletteId}
      />
    </Accordion>
  );
}
