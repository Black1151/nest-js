"use client";

import { useState } from "react";
import { Box, Button, Stack, Textarea } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";
import LessonEditor from "@/components/lesson/LessonEditor";

const GENERATE_LESSON = typedGql("mutation")({
  generateLessonFromPrompt: [
    { prompt: $("prompt", "String!") },
    { title: true, description: true, content: true },
  ],
} as const);

export const LessonBuilderPageClient = () => {
  const [prompt, setPrompt] = useState("");
  const [slides, setSlides] = useState<any>(null);

  const [generate, { loading }] = useMutation(GENERATE_LESSON, {
    onCompleted: (data) => {
      setSlides(data.generateLessonFromPrompt.content?.slides || null);
    },
  });

  return (
    <Box p={4}>
      <Stack spacing={4} maxW="600px" mb={4}>
        <Textarea
          placeholder="Give the AI commands to modify the lesson"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Button
          colorScheme="blue"
          onClick={() => generate({ variables: { prompt } })}
          isLoading={loading}
        >
          Run Prompt
        </Button>
      </Stack>
      <LessonEditor initialSlides={slides} />
    </Box>
  );
};
