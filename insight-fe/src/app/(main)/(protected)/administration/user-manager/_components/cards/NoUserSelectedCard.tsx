import { ContentCard } from "@/components/layout/Card";
import { Center, Text } from "@chakra-ui/react";

export const NoUserSelectedCard = () => {
  return (
    <ContentCard height={700}>
      <Center flex={1}>
        <Text fontSize="2xl">No user selected</Text>
      </Center>
    </ContentCard>
  );
};
