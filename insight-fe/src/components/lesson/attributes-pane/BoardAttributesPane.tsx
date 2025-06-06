"use client";

import { Accordion } from "@chakra-ui/react";
import useStyleAttributes from "../hooks/useStyleAttributes";
import WrapperSettings from "../attributes/WrapperSettings";
import { BoardRow } from "../slide/SlideElementsContainer";

interface BoardAttributesPaneProps {
  board: BoardRow;
  onChange: (updated: BoardRow) => void;
  colorPalettes?: { id: number; name: string; colors: string[] }[];
  selectedPaletteId?: number | "";
}

export default function BoardAttributesPane({
  board,
  onChange,
  colorPalettes,
  selectedPaletteId,
}: BoardAttributesPaneProps) {
  const styleAttrs = useStyleAttributes({
    wrapperStyles: board.wrapperStyles,
    spacing: board.spacing,
    deps: [board.id],
    defaultBgOpacity: 1,
    onChange: ({ wrapperStyles, spacing }) =>
      onChange({ ...board, wrapperStyles, spacing }),
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
