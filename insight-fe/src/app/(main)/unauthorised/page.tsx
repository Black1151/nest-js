import { Flex, Text } from "@chakra-ui/react";

export default function UnauthorisedPage() {
  return (
    <Flex justify="center" align="center" height="100vh">
      <Text>You are not authorised to access this page.</Text>
    </Flex>
  );
}
