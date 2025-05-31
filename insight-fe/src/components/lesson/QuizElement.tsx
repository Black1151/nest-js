import { Box, Text, Stack, RadioGroup, Radio } from "@chakra-ui/react";
import ElementWrapper, { ElementWrapperStyles } from "./ElementWrapper";

export interface MultipleChoiceQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

interface QuizElementProps {
  title: string;
  description?: string;
  questions: MultipleChoiceQuestion[];
  wrapperStyles?: ElementWrapperStyles;
}

export default function QuizElement({
  title,
  description,
  questions,
  wrapperStyles,
}: QuizElementProps) {
  return (
    <ElementWrapper styles={wrapperStyles} data-testid="quiz-element">
      <Stack spacing={4}>
        <Box>
          <Text fontWeight="bold">{title}</Text>
          {description && (
            <Text fontSize="sm" color="gray.600">
              {description}
            </Text>
          )}
        </Box>
        {questions.map((q) => (
          <Box key={q.id} mb={4}>
            <Text mb={2}>{q.text}</Text>
            <RadioGroup>
              <Stack spacing={1} pl={4}>
                {q.options.map((opt, idx) => (
                  <Radio key={idx} value={opt} isChecked={opt === q.correctAnswer}>
                    {opt}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </Box>
        ))}
      </Stack>
    </ElementWrapper>
  );
}
