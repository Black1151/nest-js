"use client";

import { Accordion } from "@chakra-ui/react";

import { ColumnType } from "@/components/DnD/types";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";
import WrapperSettings from "../attributes/WrapperSettings";
import useStyleAttributes from "../hooks/useStyleAttributes";

interface ColumnAttributesPaneProps {
  column: ColumnType<SlideElementDnDItemProps>;
  onChange: (updated: ColumnType<SlideElementDnDItemProps>) => void;
}

export default function ColumnAttributesPane({
  column,
  onChange,
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
      <WrapperSettings attrs={styleAttrs} />
    </Accordion>
  );
}
