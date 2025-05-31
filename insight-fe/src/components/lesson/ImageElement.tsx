"use client";

import { Image } from "@chakra-ui/react";
import ElementWrapper, { ElementWrapperStyles } from "./ElementWrapper";

import { Box, Button, Input } from "@chakra-ui/react";
import { useRef } from "react";

interface ImageElementProps {
  src: string;
  wrapperStyles?: ElementWrapperStyles;
  isSelected?: boolean;
  onSelect?: () => void;
  onChange?: (src: string) => void;
}

export default function ImageElement({
  src,
  wrapperStyles,
  isSelected,
  onSelect,
  onChange,
}: ImageElementProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onChange?.(url);
    }
  };

  return (
    <ElementWrapper
      styles={wrapperStyles}
      data-testid="image-element"
      position="relative"
      borderColor={isSelected ? "blue.300" : undefined}
      borderWidth={isSelected ? 2 : undefined}
      onClick={onSelect}
    >
      <Image src={src} alt="lesson image" objectFit="contain" draggable={false} />
      {isSelected && (
        <Box position="absolute" top={1} right={1}>
          <Button size="xs" onClick={() => inputRef.current?.click()}>Change</Button>
          <Input
            ref={inputRef}
            type="file"
            accept="image/*"
            display="none"
            onChange={handleChange}
          />
        </Box>
      )}
    </ElementWrapper>
  );
}
