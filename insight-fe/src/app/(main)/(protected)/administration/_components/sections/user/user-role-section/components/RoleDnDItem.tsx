import { ContentCard } from "@/components/layout/Card";
import { Role } from "@/gqty";
import { Flex, Text } from "@chakra-ui/react";

export interface RoleDnDItemProps {
  id: string;
  name: string;
  description: string;
  bgColor: string;
}

export const RoleDnDItem = ({
  id,
  name,
  description,
  bgColor,
}: RoleDnDItemProps) => {
  return (
    <ContentCard id={id} key={id} bg={bgColor} cursor="grab">
      <Flex flexDirection="column" gap={2}>
        <Text fontSize={20} fontWeight="bold">
          {name}
        </Text>
        <Text fontSize={14}>{description}</Text>
      </Flex>
    </ContentCard>
  );
};
