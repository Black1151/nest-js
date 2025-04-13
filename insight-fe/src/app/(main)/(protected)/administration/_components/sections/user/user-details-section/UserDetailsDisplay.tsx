import { User } from "@/gqty";
import { VStack, Heading, Divider, Text } from "@chakra-ui/react";

interface UserDetailsDisplayProps {
  user: User | null;
}

export const UserDetailsDisplay = ({ user }: UserDetailsDisplayProps) => {
  if (!user) {
    return;
  }

  const createdAtFormatted = new Date(user.createdAt).toLocaleString();
  const updatedAtFormatted = new Date(user.updatedAt).toLocaleString();
  return (
    <VStack spacing={3} align="start">
      <Heading size="md">User Details</Heading>
      <Divider />
      <Text>
        <strong>First Name:</strong> {user.firstName}
      </Text>
      <Text>
        <strong>Last Name:</strong> {user.lastName}
      </Text>
      <Text>
        <strong>Email:</strong> {user.email}
      </Text>
      <Text>
        <strong>Phone:</strong> {user.phoneNumber}
      </Text>
      <Text>
        <strong>Date of Birth:</strong> {user.dateOfBirth}
      </Text>
      <Divider />
      <Text>
        <strong>Address Line 1:</strong> {user.addressLine1}
      </Text>
      <Text>
        <strong>Address Line 2:</strong> {user.addressLine2}
      </Text>
      <Text>
        <strong>City:</strong> {user.city}
      </Text>
      <Text>
        <strong>County:</strong> {user.county}
      </Text>
      <Text>
        <strong>Country:</strong> {user.country}
      </Text>
      <Text>
        <strong>Postal Code:</strong> {user.postalCode}
      </Text>
      l
      <Divider />
      <Text>
        <strong>User ID:</strong> {user.id}
      </Text>
      <Text>
        <strong>Public ID:</strong> {user.publicId}
      </Text>
      <Text>
        <strong>Created At:</strong> {createdAtFormatted}
      </Text>
      <Text>
        <strong>Updated At:</strong> {updatedAtFormatted}
      </Text>
    </VStack>
  );
};
