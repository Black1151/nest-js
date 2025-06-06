"use client";

import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import EditQuizModal from "../EditQuizModal";
import { SlideElementDnDItemProps } from "@/components/DnD/cards/SlideElementDnDCard";

interface QuizAttributesProps {
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  questions: SlideElementDnDItemProps["questions"];
  setQuestions: React.Dispatch<React.SetStateAction<SlideElementDnDItemProps["questions"]>>;
}

export default function QuizAttributes({
  title,
  setTitle,
  description,
  setDescription,
  questions,
  setQuestions,
}: QuizAttributesProps) {
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  return (
    <AccordionItem borderWidth="1px" borderColor="purple.300" borderRadius="md" mb={2}>
      <h2>
        <AccordionButton>
          <Box flex="1" textAlign="left">Quiz</Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={2}>
        <Button size="sm" onClick={() => setIsQuizModalOpen(true)}>
          Edit Quiz
        </Button>
        <EditQuizModal
          isOpen={isQuizModalOpen}
          onClose={() => setIsQuizModalOpen(false)}
          title={title}
          onTitleChange={setTitle}
          description={description}
          onDescriptionChange={setDescription}
          questions={questions}
          setQuestions={setQuestions}
        />
      </AccordionPanel>
    </AccordionItem>
  );
}

