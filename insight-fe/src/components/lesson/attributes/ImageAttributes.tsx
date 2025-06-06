"use client";

import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";

interface ImageAttributesProps {
  src: string;
  setSrc: (val: string) => void;
}

export default function ImageAttributes({ src, setSrc }: ImageAttributesProps) {
  return (
    <AccordionItem borderWidth="1px" borderColor="purple.300" borderRadius="md" mb={2}>
      <h2>
        <AccordionButton>
          <Box flex="1" textAlign="left">Image</Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={2}>
        <Stack spacing={2}>
          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0" fontSize="sm" w="40%">
              Source
            </FormLabel>
            <Input size="sm" value={src} onChange={(e) => setSrc(e.target.value)} />
          </FormControl>
        </Stack>
      </AccordionPanel>
    </AccordionItem>
  );
}

