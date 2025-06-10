"use client";

import { Box, Stack, Text, HStack, Select } from "@chakra-ui/react";
import { useState } from "react";
import { BaseModal } from "../../modals/BaseModal";
import SlidePreview from "../slide/SlidePreview";
import { Slide } from "../slide/SlideSequencer";

const aspectOptions = [
  { label: "Mobile Portrait", value: "mobile-portrait", width: 375, height: 667 },
  { label: "Mobile Landscape", value: "mobile-landscape", width: 667, height: 375 },
  { label: "Tablet Portrait", value: "tablet-portrait", width: 768, height: 1024 },
  { label: "Tablet Landscape", value: "tablet-landscape", width: 1024, height: 768 },
  { label: "Desktop 1920", value: "desktop-1920", width: 1920, height: 1080 },
  { label: "Desktop 1440", value: "desktop-1440", width: 1440, height: 900 },
] as const;

interface LessonPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: Slide[];
}

export default function LessonPreviewModal({
  isOpen,
  onClose,
  slides,
}: LessonPreviewModalProps) {
  const [ratio, setRatio] = useState<(typeof aspectOptions)[number]["value"]>(
    "desktop-1920"
  );

  const current = aspectOptions.find((o) => o.value === ratio) ?? aspectOptions[0];
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      title="Lesson Preview"
    >
      <Stack spacing={6} py={2}>
        <HStack>
          <Text fontWeight="bold" minW="120px">
            Aspect Ratio
          </Text>
          <Select
            value={ratio}
            onChange={(e) => setRatio(e.target.value as (typeof aspectOptions)[number]["value"])}
            maxW="200px"
          >
            {aspectOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </HStack>
        {slides.length === 0 && <Text>No slides available</Text>}
        {slides.map((slide) => (
          <Box key={slide.id}>
            <Text mb={2} fontWeight="bold">
              {slide.title}
            </Text>
            <Box
              borderWidth="1px"
              borderColor="gray.200"
              overflow="auto"
              width={`${current.width}px`}
              height={`${current.height}px`}
              mx="auto"
            >
              <SlidePreview columnMap={slide.columnMap} boards={slide.boards} />
            </Box>
          </Box>
        ))}
      </Stack>
    </BaseModal>
  );
}
