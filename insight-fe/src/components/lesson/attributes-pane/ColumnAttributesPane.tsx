"use client";

import { Accordion } from "@chakra-ui/react";

import { ColumnType } from "@/components/DnD/types";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";
import WrapperSettings from "../attributes/WrapperSettings";
import useStyleAttributes from "../hooks/useStyleAttributes";

interface ColumnAttributesPaneProps {
  column: ColumnType<SlideElementDnDItemProps>;
  onChange: (updated: ColumnType<SlideElementDnDItemProps>) => void;
  colorPalettes?: { id: number; name: string; colors: string[] }[];
  selectedPaletteId?: number | "";
}

export default function ColumnAttributesPane({
  column,
  onChange,
  colorPalettes,
  selectedPaletteId,
}: ColumnAttributesPaneProps) {
  const styleAttrs = useStyleAttributes({
    wrapperStyles: column.wrapperStyles,
    spacing: column.spacing,
    deps: [column.columnId],
    onChange: ({ wrapperStyles, spacing }) =>
      onChange({ ...column, wrapperStyles, spacing }),
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
