"use client";

import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  FormControl,
  FormLabel,
  Select,
  Stack,
  Input,
} from "@chakra-ui/react";

interface AnimationSettingsProps {
  enabled: boolean;
  setEnabled: (val: boolean) => void;
  direction: string;
  setDirection: (val: string) => void;
  delay: number;
  setDelay: (val: number) => void;
}

export default function AnimationSettings({
  enabled,
  setEnabled,
  direction,
  setDirection,
  delay,
  setDelay,
}: AnimationSettingsProps) {
  return (
    <AccordionItem borderWidth="1px" borderColor="orange.300" borderRadius="md" mb={2}>
      <h2>
        <AccordionButton>
          <Box flex="1" textAlign="left">Animation</Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={2}>
        <Stack spacing={2}>
          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0" fontSize="sm" w="40%">
              Enable
            </FormLabel>
            <Select
              size="sm"
              value={enabled ? "on" : "off"}
              onChange={(e) => setEnabled(e.target.value === "on")}
            >
              <option value="on">On</option>
              <option value="off">Off</option>
            </Select>
          </FormControl>
          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0" fontSize="sm" w="40%">
              Direction
            </FormLabel>
            <Select
              size="sm"
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
            </Select>
          </FormControl>
          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0" fontSize="sm" w="40%">
              Delay (ms)
            </FormLabel>
            <Input
              size="sm"
              type="number"
              w="60px"
              value={delay}
              onChange={(e) => setDelay(parseInt(e.target.value))}
            />
          </FormControl>
        </Stack>
      </AccordionPanel>
    </AccordionItem>
  );
}

