import { Box, Center, Flex, Spinner, Text } from "@chakra-ui/react";
import { ContentCard } from "../layout/Card";

interface LoadingSpinnerCardProps {
  text: string;
}

export const LoadingSpinnerCard = ({ text }: LoadingSpinnerCardProps) => {
  return (
    <ContentCard>
      <Center flexDirection="column">
        <Flex alignItems="center" flexDirection="column" gap={4}>
          <Spinner size="xl" />
          <Text fontSize="2xl">{text}</Text>
        </Flex>
      </Center>
    </ContentCard>
  );
};
