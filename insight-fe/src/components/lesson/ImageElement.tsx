"use client";

import { Image } from "@chakra-ui/react";
import ElementWrapper, { ElementWrapperStyles } from "./ElementWrapper";

interface ImageElementProps {
  src: string;
  wrapperStyles?: ElementWrapperStyles;
}

export default function ImageElement({ src, wrapperStyles }: ImageElementProps) {
  return (
    <ElementWrapper styles={wrapperStyles} data-testid="image-element">
      <Image src={src} alt="lesson image" objectFit="contain" />
    </ElementWrapper>
  );
}
