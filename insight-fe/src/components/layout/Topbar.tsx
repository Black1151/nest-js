import { HStack } from "@chakra-ui/react";

interface TopbarProps {
  children: React.ReactNode;
}

export const Topbar = ({ children }: TopbarProps) => {
  return (
    <HStack maxHeight="5vh" flex={1} bg="gray.400" width="100%">
      {children}
    </HStack>
  );
};
