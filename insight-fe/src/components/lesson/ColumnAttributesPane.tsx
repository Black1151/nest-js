"use client";

import { Accordion } from "@chakra-ui/react";
import useStyleAttributes from "./hooks/useStyleAttributes";
import WrapperSettings from "./attributes/WrapperSettings";
import { ColumnType } from "@/components/DnD/types";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";

interface ColumnAttributesPaneProps {
  column: ColumnType<SlideElementDnDItemProps>;
  onChange: (updated: ColumnType<SlideElementDnDItemProps>) => void;
}

export default function ColumnAttributesPane({ column, onChange }: ColumnAttributesPaneProps) {
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
