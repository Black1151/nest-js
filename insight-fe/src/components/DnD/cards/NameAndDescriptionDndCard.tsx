import { ContentCard } from "@/components/layout/Card";
import { Flex, Text } from "@chakra-ui/react";

export interface NameAndDescriptionDnDItemProps {
  id: string;
  name: string;
  description: string;
}

export const NameAndDescriptionDnDItem = ({
  item,
}: {
  item: NameAndDescriptionDnDItemProps;
}) => {
  const { id, name, description } = item;

  return (
    <ContentCard id={id} key={id} cursor="grab">
      <Flex flexDirection="column" gap={2}>
        <Text fontSize={20} fontWeight="bold">
          {name}
        </Text>
        <Text fontSize={14}>{description}</Text>
      </Flex>
    </ContentCard>
  );
};
