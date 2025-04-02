import { Box, Flex, FlexProps } from "@chakra-ui/react";

interface ContentCardProps extends FlexProps {
  children: React.ReactNode;
}

export const ContentCard = ({ children, ...props }: ContentCardProps) => {
  return (
    <Flex
      flexDirection="column"
      flex={1}
      dropShadow="2xl"
      bg="white"
      borderRadius="md"
      p={4}
      {...props}
    >
      {children}
    </Flex>
  );
};
