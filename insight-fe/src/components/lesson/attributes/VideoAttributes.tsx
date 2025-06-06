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

interface VideoAttributesProps {
  url: string;
  setUrl: (val: string) => void;
}

export default function VideoAttributes({ url, setUrl }: VideoAttributesProps) {
  return (
    <AccordionItem borderWidth="1px" borderColor="purple.300" borderRadius="md" mb={2}>
      <h2>
        <AccordionButton>
          <Box flex="1" textAlign="left">Video</Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={2}>
        <Stack spacing={2}>
          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0" fontSize="sm" w="40%">
              URL
            </FormLabel>
            <Input size="sm" value={url} onChange={(e) => setUrl(e.target.value)} />
          </FormControl>
        </Stack>
      </AccordionPanel>
    </AccordionItem>
  );
}

