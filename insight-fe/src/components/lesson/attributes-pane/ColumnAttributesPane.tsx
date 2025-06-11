"use client";

import { Accordion } from "@chakra-ui/react";

import { ColumnType } from "@/components/DnD/types";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";
import WrapperSettings from "../attributes/WrapperSettings";
import useStyleAttributes from "../hooks/useStyleAttributes";
import { SemanticTokens, ThemeTokens } from "@/theme/helpers";

interface ColumnAttributesPaneProps {
  column: ColumnType<SlideElementDnDItemProps>;
  onChange: (updated: ColumnType<SlideElementDnDItemProps>) => void;
  tokens?: ThemeTokens;
}

export default function ColumnAttributesPane({
  column,
  onChange,
  tokens,
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
      <WrapperSettings attrs={styleAttrs} tokens={tokens} />
    </Accordion>
  );
}
