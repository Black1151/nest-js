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
  const [initial, setInitial] = useState<any>(null);

  const [generate, { loading }] = useMutation(GENERATE_LESSON, {
    onCompleted: (data) => {
      setInitial(data.generateLessonFromPrompt.content?.slides || null);
    },
  });

  if (!initial) {
    return (
      <Box p={4} maxW="600px">
        <Stack spacing={4}>
          <Textarea
            placeholder="Describe your lesson"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button
            colorScheme="blue"
            onClick={() => generate({ variables: { prompt } })}
            isLoading={loading}
          >
            Generate Lesson
          </Button>
        </Stack>
      </Box>
    );
  }

  return <LessonEditor initialSlides={initial} />;
};
