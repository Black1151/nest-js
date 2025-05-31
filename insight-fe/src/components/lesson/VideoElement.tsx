import { Box, Button, Input } from "@chakra-ui/react";
import ElementWrapper, { ElementWrapperStyles } from "./ElementWrapper";
import { useRef } from "react";

interface VideoElementProps {
  url: string;
  wrapperStyles?: ElementWrapperStyles;
  isSelected?: boolean;
  onSelect?: () => void;
  onChange?: (url: string) => void;
}

export default function VideoElement({
  url,
  wrapperStyles,
  isSelected,
  onSelect,
  onChange,
}: VideoElementProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      onChange?.(videoUrl);
    }
  };

  return (
    <ElementWrapper
      styles={wrapperStyles}
      position="relative"
      borderColor={isSelected ? "blue.300" : undefined}
      borderWidth={isSelected ? 2 : undefined}
      onClick={onSelect}
    >
      <Box as="video" src={url} controls width="100%" />
      {isSelected && (
        <Box position="absolute" top={1} right={1}>
          <Button size="xs" onClick={() => inputRef.current?.click()}>Change</Button>
          <Input
            ref={inputRef}
            type="file"
            accept="video/*"
            display="none"
            onChange={handleChange}
          />
        </Box>
      )}
    </ElementWrapper>
  );
}
