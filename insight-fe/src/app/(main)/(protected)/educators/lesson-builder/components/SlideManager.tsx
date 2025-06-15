"use client";

import SlideSequencer, { Slide } from "@/components/lesson/slide/SlideSequencer";

interface SlideManagerProps {
  slides: Slide[];
  setSlides: React.Dispatch<React.SetStateAction<Slide[]>>;
  selectedSlideId: string | null;
  onSelectSlide: (id: string) => void;
}

export default function SlideManager({
  slides,
  setSlides,
  selectedSlideId,
  onSelectSlide,
}: SlideManagerProps) {
  const handleDelete = (id: string) => {
    setSlides((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <SlideSequencer
      slides={slides}
      setSlides={setSlides}
      selectedSlideId={selectedSlideId}
      onSelect={onSelectSlide}
      onDelete={handleDelete}
      orientation="horizontal"
    />
  );
}

