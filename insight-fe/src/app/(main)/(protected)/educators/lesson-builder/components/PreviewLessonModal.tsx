"use client";

import { BaseModal } from "@/components/modals/BaseModal";
import { LessonViewer } from "@/components/lesson/viewer";
import { Slide } from "@/components/lesson/slide/SlideSequencer";

interface PreviewLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: Slide[];
  title?: string;
}

export default function PreviewLessonModal({
  isOpen,
  onClose,
  slides,
  title,
}: PreviewLessonModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size="full" title="Lesson Preview">
      <LessonViewer slides={slides} title={title} />
    </BaseModal>
  );
}
