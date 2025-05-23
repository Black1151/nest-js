"use client";

import {
  Box,
  Stack,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";
import { useEffect, useState } from "react";

interface ElementAttributesPaneProps {
  element: SlideElementDnDItemProps;
  onChange: (updated: SlideElementDnDItemProps) => void;
}

export default function ElementAttributesPane({ element, onChange }: ElementAttributesPaneProps) {
  const [color, setColor] = useState(element.styles?.color || "#000000");
  const [fontSize, setFontSize] = useState(element.styles?.fontSize || "16px");
  const [src, setSrc] = useState(element.attributes?.src || "");
  const [code, setCode] = useState(element.attributes?.code || "");
  const [question, setQuestion] = useState(element.attributes?.question || "");

  useEffect(() => {
    setColor(element.styles?.color || "#000000");
    setFontSize(element.styles?.fontSize || "16px");
    setSrc(element.attributes?.src || "");
    setCode(element.attributes?.code || "");
    setQuestion(element.attributes?.question || "");
  }, [element]);

  useEffect(() => {
    if (element.type === "text") {
      onChange({
        ...element,
        styles: { ...element.styles, color, fontSize },
      });
    }
  }, [color, fontSize]);

  useEffect(() => {
    if (["image", "video", "audio"].includes(element.type)) {
      onChange({
        ...element,
        attributes: { ...element.attributes, src },
      });
    }
  }, [src]);

  useEffect(() => {
    if (element.type === "code") {
      onChange({
        ...element,
        attributes: { ...element.attributes, code },
      });
    }
  }, [code]);

  useEffect(() => {
    if (element.type === "quiz") {
      onChange({
        ...element,
        attributes: { ...element.attributes, question },
      });
    }
  }, [question]);

  if (element.type === "text") {
    return (
      <Stack>
        <FormControl>
          <FormLabel>Color</FormLabel>
          <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Font Size (px)</FormLabel>
          <Input
            type="number"
            value={parseInt(fontSize)}
            onChange={(e) => setFontSize(e.target.value + "px")}
          />
        </FormControl>
      </Stack>
    );
  }

  if (["image", "video", "audio"].includes(element.type)) {
    return (
      <Stack>
        <FormControl>
          <FormLabel>Source</FormLabel>
          <Input value={src} onChange={(e) => setSrc(e.target.value)} placeholder="path or URL" />
        </FormControl>
      </Stack>
    );
  }

  if (element.type === "code") {
    return (
      <Stack>
        <FormControl>
          <FormLabel>Code</FormLabel>
          <Textarea value={code} onChange={(e) => setCode(e.target.value)} />
        </FormControl>
      </Stack>
    );
  }

  if (element.type === "quiz") {
    return (
      <Stack>
        <FormControl>
          <FormLabel>Question</FormLabel>
          <Input value={question} onChange={(e) => setQuestion(e.target.value)} />
        </FormControl>
      </Stack>
    );
  }

  return (
    <Box>
      <Text>No editable attributes</Text>
    </Box>
  );

}
