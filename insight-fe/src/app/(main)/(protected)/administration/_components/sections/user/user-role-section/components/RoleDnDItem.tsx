import { ContentCard } from "@/components/layout/Card";
import { Role } from "@/gqty";
import { Flex, Text } from "@chakra-ui/react";

interface RoleDnDItemProps {
  role: Role;
}

export const RoleDnDItem = ({ role }: RoleDnDItemProps) => {
  return (
    <ContentCard>
      <Flex>
        <Text>Role</Text>
      </Flex>
    </ContentCard>
  );
};
