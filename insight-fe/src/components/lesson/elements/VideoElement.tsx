import { Box } from "@chakra-ui/react";
import ElementWrapper, { ElementWrapperStyles } from "./ElementWrapper";

interface VideoElementProps {
  url: string;
  wrapperStyles?: ElementWrapperStyles;
}

export default function VideoElement({
  url,
  wrapperStyles,
}: VideoElementProps) {
  return (
    <ElementWrapper styles={wrapperStyles}>
      <Box as="video" src={url} controls width="100%" />
    </ElementWrapper>
  );
}
