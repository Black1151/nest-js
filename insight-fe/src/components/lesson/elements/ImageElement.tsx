"use client";

import { Image } from "@chakra-ui/react";
import ElementWrapper, { ElementWrapperStyles } from "./ElementWrapper";

interface ImageElementProps {
  src: string;
  /** Accessible alternative text */
  alt?: string;
  wrapperStyles?: ElementWrapperStyles;
}

export default function ImageElement({
  src,
  alt,
  wrapperStyles,
}: ImageElementProps) {
  return (
    <ElementWrapper styles={wrapperStyles} data-testid="image-element">
      <Image
        src={src}
        alt={alt || "lesson image"}
        objectFit="contain"
        draggable={false}
      />
    </ElementWrapper>
  );
}
