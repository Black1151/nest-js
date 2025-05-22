import { ContentCard } from "@/components/layout/Card";
import { Text } from "@chakra-ui/react";

export interface SlideElementDnDItemProps {
  id: string;
  type: string;
}

export const SlideElementDnDItem = ({
  item,
}: {
  item: SlideElementDnDItemProps;
}) => {
  return (
    <ContentCard id={item.id} key={item.id} cursor="grab">
      <Text fontSize={14} fontWeight="bold">
        {item.type}
      </Text>
    </ContentCard>
  );
};
