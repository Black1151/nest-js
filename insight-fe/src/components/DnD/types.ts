export type State =
  | { type: "idle" }
  | { type: "preview"; container: HTMLElement; rect: DOMRect }
  | { type: "dragging" };

export const idleState: State = { type: "idle" };
export const draggingState: State = { type: "dragging" };

export const getStateStyle = (state: State["type"]) => {
  switch (state) {
    case "idle":
      return {
        cursor: "grab",
        boxShadow: "md",
        opacity: 1,
      };
    case "dragging":
      return {
        opacity: 0.4,
        boxShadow: "md",
      };
    case "preview":
      // No shadow for preview, the browser drag image handles that.
      return {};
    default:
      return {};
  }
};
