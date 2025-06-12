"use client";

import SlideSequencer, {
  type Slide,
  type SlideBoard,
  type SlideSequencerProps,
  createInitialBoard,
} from "../lesson/slide/SlideSequencer";

export type { Slide, SlideBoard, SlideSequencerProps };
export { createInitialBoard };

export default function ThemeSlideSequencer(props: SlideSequencerProps) {
  return <SlideSequencer {...props} />;
}
