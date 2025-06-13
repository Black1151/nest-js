"use client";

import { Text } from "@chakra-ui/react";

export interface BaseElementDnDItemProps {
  id: string;
  type: string;
}

export function BaseElementDnDItem({ item }: { item: BaseElementDnDItemProps }) {
  return <Text>{item.type}</Text>;
}

export default BaseElementDnDItem;
