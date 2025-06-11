"use client";

import { Accordion } from "@chakra-ui/react";
import useStyleAttributes from "../hooks/useStyleAttributes";
import WrapperSettings from "../attributes/WrapperSettings";
import { BoardRow } from "../slide/SlideElementsContainer";
import { SemanticTokens, ThemeTokens } from "@/theme/helpers";

interface BoardAttributesPaneProps {
  board: BoardRow;
  onChange: (updated: BoardRow) => void;
  tokens?: ThemeTokens;
}

export default function BoardAttributesPane({
  board,
  onChange,
  tokens,
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
      <WrapperSettings attrs={styleAttrs} tokens={tokens} />
    </Accordion>
  );
}
