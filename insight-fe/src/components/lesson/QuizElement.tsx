import { Box, Text, Stack, RadioGroup, Radio, Button } from "@chakra-ui/react";
import { useState } from "react";
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
  const [current, setCurrent] = useState(0);
  const [choice, setChoice] = useState("");
  const [results, setResults] = useState<{ id: string; correct: boolean }[]>([]);
  const [showFeedback, setShowFeedback] = useState<null | boolean>(null);

  const currentQuestion = questions[current];

  const submitAnswer = () => {
    if (!currentQuestion) return;
    const correct = choice === currentQuestion.correctAnswer;
    setResults([...results, { id: currentQuestion.id, correct }]);
    setShowFeedback(correct);
  };

  const nextQuestion = () => {
    setShowFeedback(null);
    setChoice("");
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    }
  };

  const finished = results.length === questions.length;

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
        {!finished && currentQuestion && (
          <Box>
            <Text mb={2}>{currentQuestion.text}</Text>
            <RadioGroup onChange={setChoice} value={choice}>
              <Stack spacing={1} pl={4}>
                {currentQuestion.options.map((opt, idx) => (
                  <Radio key={idx} value={String.fromCharCode(97 + idx)}>
                    {opt}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
            {showFeedback === null ? (
              <Button mt={2} size="sm" onClick={submitAnswer} isDisabled={!choice}>
                Submit
              </Button>
            ) : (
              <Box mt={2}>
                <Text color={showFeedback ? "green.600" : "red.600"} mb={1}>
                  {showFeedback ? "Correct!" : "Incorrect"}
                </Text>
                <Button size="sm" onClick={nextQuestion}>
                  {current + 1 < questions.length ? "Next" : "Finish"}
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
            <Stack pl={4} spacing={1}>
              {results.map((r, idx) => (
                <Text key={r.id} color={r.correct ? "green.600" : "red.600"}>
                  Question {idx + 1}: {r.correct ? "Correct" : "Incorrect"}
                </Text>
              ))}
            </Stack>
          </Box>
        )}
      </Stack>
    </ElementWrapper>
  );
}
