import React from "react";
import {
  Box,
  Text,
  Stack,
  RadioGroup,
  Radio,
  Button,
} from "@chakra-ui/react";
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
  const [index, setIndex] = React.useState(0);
  const [selected, setSelected] = React.useState<string>("");
  const [results, setResults] = React.useState<Record<string, boolean>>({});
  const [showFeedback, setShowFeedback] = React.useState(false);

  if (questions.length === 0) {
    return (
      <ElementWrapper styles={wrapperStyles} data-testid="quiz-element">
        <Text>No questions</Text>
      </ElementWrapper>
    );
  }

  const current = questions[index];
  const handleSubmit = () => {
    const correct = selected === current.correctAnswer;
    setResults({ ...results, [current.id]: correct });
    setShowFeedback(true);
  };

  const handleNext = () => {
    setSelected("");
    setShowFeedback(false);
    setIndex(index + 1);
  };

  const finished = index >= questions.length;

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
        {!finished && (
          <Box>
            <Text mb={2}>{current.text}</Text>
            <RadioGroup
              onChange={setSelected}
              value={selected}
              name={current.id}
            >
              <Stack spacing={1} pl={4}>
                {current.options.map((opt, idx) => (
                  <Radio key={idx} value={opt}>
                    {opt}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
            {!showFeedback ? (
              <Button
                size="sm"
                mt={2}
                onClick={handleSubmit}
                isDisabled={selected === ""}
              >
                Submit
              </Button>
            ) : (
              <Box mt={2}>
                <Text color={selected === current.correctAnswer ? "green.600" : "red.600"}>
                  {selected === current.correctAnswer ? "Correct!" : `Incorrect. The correct answer is ${current.correctAnswer}.`}
                </Text>
                <Button size="sm" mt={2} onClick={handleNext}>
                  {index + 1 === questions.length ? "Finish" : "Next"}
                </Button>
              </Box>
            )}
          </Box>
        )}
        {finished && (
          <Box>
            <Text fontWeight="bold" mb={2}>
              Results
            </Text>
            <Stack spacing={2} pl={4}>
              {questions.map((q) => (
                <Text key={q.id} color={results[q.id] ? "green.600" : "red.600"}>
                  {q.text} - {results[q.id] ? "Correct" : "Incorrect"}
                </Text>
              ))}
            </Stack>
          </Box>
        )}
      </Stack>
    </ElementWrapper>
  );
}
