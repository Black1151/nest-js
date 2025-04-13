import { Box, Spinner, Text } from "@chakra-ui/react";
import { ContentCard } from "../layout/Card";

interface LoadingSpinnerCardProps {
  text: string;
}

export const LoadingSpinnerCard = ({ text }: LoadingSpinnerCardProps) => {
  return (
    <ContentCard>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Spinner />
        <Text>{text}</Text>
      </Box>
    </ContentCard>
  );
};
