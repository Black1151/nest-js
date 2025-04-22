import React, { forwardRef, memo, type ReactNode, useEffect } from "react";
import { autoScrollWindowForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { Box } from "@chakra-ui/react";
import { useBoardContext } from "./BoardContext";

type BoardProps = {
  children: ReactNode;
};

const Board = forwardRef<HTMLDivElement, BoardProps>(
  ({ children }: BoardProps, ref) => {
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
        // height="480px"
        ref={ref}
        gap={2}
        flex={1}
        // overflowY="auto"
        bg="blue"
      >
        {children}
      </Box>
    );
  }
);

export default memo(Board);
