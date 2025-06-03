"use client";

import { BaseModal } from "../modals/BaseModal";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";

interface EditQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onTitleChange: (val: string) => void;
  description: string;
  onDescriptionChange: (val: string) => void;
  questions: SlideElementDnDItemProps["questions"];
  setQuestions: React.Dispatch<
    React.SetStateAction<SlideElementDnDItemProps["questions"]>
  >;
}

export default function EditQuizModal({
  isOpen,
  onClose,
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  questions = [],
  setQuestions,
}: EditQuizModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size="4xl" title="Edit Quiz">
      <Stack spacing={3}>
        <FormControl display="flex" alignItems="center">
          <FormLabel mb="0" fontSize="sm" w="40%">
            Title
          </FormLabel>
          <Input
            size="sm"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </FormControl>
        <FormControl display="flex" alignItems="center">
          <FormLabel mb="0" fontSize="sm" w="40%">
            Description
          </FormLabel>
          <Input
            size="sm"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
          />
        </FormControl>
        <Box>
          <Text fontSize="sm" mb={2} fontWeight="bold">
            Questions
          </Text>
          <Stack spacing={3}>
            {questions.map((q, qIdx) => (
              <Box key={q.id} p={2} borderWidth="1px" borderRadius="md">
                <FormControl mb={2}>
                  <FormLabel fontSize="sm">Question</FormLabel>
                  <Input
                    size="sm"
                    value={q.text}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[qIdx] = { ...q, text: e.target.value };
                      setQuestions(updated);
                    }}
                  />
                </FormControl>
                <Stack spacing={2} mb={2} pl={2}>
                  {q.options.map((opt, oIdx) => (
                    <HStack key={oIdx} align="center">
                      <Text w="20px">{String.fromCharCode(65 + oIdx)}</Text>
                      <Input
                        size="sm"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...questions];
                          const opts = [...updated[qIdx].options];
                          opts[oIdx] = e.target.value;
                          updated[qIdx] = { ...updated[qIdx], options: opts };
                          setQuestions(updated);
                        }}
                      />
                      <Button
                        size="xs"
                        colorScheme="red"
                        onClick={() => {
                          const updated = [...questions];
                          updated[qIdx] = {
                            ...updated[qIdx],
                            options: updated[qIdx].options.filter((_, i) => i !== oIdx),
                          };
                          setQuestions(updated);
                        }}
                      >
                        X
                      </Button>
                    </HStack>
                  ))}
                  <Button
                    size="xs"
                    onClick={() => {
                      const updated = [...questions];
                      updated[qIdx] = {
                        ...updated[qIdx],
                        options: [...updated[qIdx].options, ""],
                      };
                      setQuestions(updated);
                    }}
                  >
                    Add Option
                  </Button>
                </Stack>
                <FormControl>
                  <FormLabel fontSize="sm">Correct Answer</FormLabel>
                  <Select
                    size="sm"
                    value={q.correctAnswer}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[qIdx] = { ...q, correctAnswer: e.target.value };
                      setQuestions(updated);
                    }}
                  >
                    {q.options.map((_, oIdx) => (
                      <option key={oIdx} value={String.fromCharCode(97 + oIdx)}>
                        {String.fromCharCode(65 + oIdx)}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  mt={2}
                  size="xs"
                  colorScheme="red"
                  onClick={() => {
                    setQuestions(questions.filter((_, i) => i !== qIdx));
                  }}
                >
                  Delete Question
                </Button>
              </Box>
            ))}
            <Button
              size="sm"
              onClick={() =>
                setQuestions([
                  ...questions,
                  {
                    id: crypto.randomUUID(),
                    text: "",
                    options: ["", ""],
                    correctAnswer: "a",
                  },
                ])
              }
            >
              Add Question
            </Button>
          </Stack>
        </Box>
      </Stack>
    </BaseModal>
  );
}
