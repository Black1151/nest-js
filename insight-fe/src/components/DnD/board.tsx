import React, { forwardRef, memo, type ReactNode, useEffect } from "react";
import { autoScrollWindowForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { Box } from "@chakra-ui/react";
import { useBoardContext } from "./BoardContext";

type BoardProps = {
  children: ReactNode;
  spacing?: number;
};

const Board = forwardRef<HTMLDivElement, BoardProps>(
  ({ children, spacing = 0 }: BoardProps, ref) => {
    const { instanceId } = useBoardContext();

    useEffect(() => {
      return autoScrollWindowForElements({
        canScroll: ({ source }) => source.data.instanceId === instanceId,
      });
    }, [instanceId]);

    return (
      <Box
        display="flex"
        justifyContent="center"
        flexDirection="row"
        ref={ref}
        gap={spacing}
        flex={1}
      >
        {children}
      </Box>
    );
  }
);

export default memo(Board);
