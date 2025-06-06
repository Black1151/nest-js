import { RefObject, Dispatch, SetStateAction, useEffect } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

/**
 * Registers a board DOM node as a draggable and drop target.
 * Updates the provided closest edge state while dragging.
 *
 * @param boardRef - Ref pointing to the board element
 * @param dragHandleRef - Ref for the drag handle element
 * @param boardId - Identifier of the board
 * @param boardInstanceId - Symbol representing the board DnD scope
 * @param setClosestEdge - Setter to update the closest edge during drag
 */
export function useBoardDragDrop(
  boardRef: RefObject<HTMLDivElement>,
  dragHandleRef: RefObject<HTMLElement>,
  boardId: string,
  boardInstanceId: symbol,
  setClosestEdge: Dispatch<SetStateAction<Edge | null>>,
  setIsDragging?: Dispatch<SetStateAction<boolean>>
) {
  useEffect(() => {
    if (!boardRef.current || !dragHandleRef.current) return;
    const el = boardRef.current;
    return combine(
      draggable({
        element: el,
        dragHandle: dragHandleRef.current,
        getInitialData: () => ({
          type: "board",
          boardId,
          instanceId: boardInstanceId,
        }),
        onDragStart: () => setIsDragging?.(true),
        onDrop: () => setIsDragging?.(false),
      }),
      dropTargetForElements({
        element: el,
        canDrop: ({ source }) =>
          source.data.instanceId === boardInstanceId &&
          source.data.type === "board",
        getIsSticky: () => true,
        getData: ({ input, element }) =>
          attachClosestEdge(
            { type: "board", boardId },
            { input, element, allowedEdges: ["top", "bottom"] }
          ),
        onDragEnter: (args) => setClosestEdge(extractClosestEdge(args.self.data)),
        onDrag: (args) => setClosestEdge(extractClosestEdge(args.self.data)),
        onDragLeave: () => setClosestEdge(null),
        onDrop: () => setClosestEdge(null),
      })
    );
  }, [boardRef, dragHandleRef, boardInstanceId, boardId, setClosestEdge, setIsDragging]);
}
