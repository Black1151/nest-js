import { useQuery } from "@/gqty";
import { Card, VStack, Text, Heading, Divider } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";

interface UserDetailSectionProps {
  publicId: string | null;
}

export const UserDetailSection = ({ publicId }: UserDetailSectionProps) => {
  const query = useQuery();

  const selectedUser = useMemo(() => {
    return publicId ? query.getUserByPublicId({ publicId }) : null;
  }, [publicId, query]);

  const emptyStateCard = useMemo(() => {
    return (
      <Card p={4}>
        <Text>No user selected.</Text>
      </Card>
    );
  }, []);

  if (!selectedUser) {
    return emptyStateCard;
  }

  const createdAtFormatted = new Date(selectedUser.createdAt).toLocaleString();
  const updatedAtFormatted = new Date(selectedUser.updatedAt).toLocaleString();

  // Format roles once during render
  const rolesFormatted = selectedUser.roles
    ?.map((role: any) => role.name)
    .join(", ");

  return (
    <Card p={6}>
      <VStack spacing={3} align="start">
        <Heading size="md">User Details</Heading>
        <Divider />
        <Text>
          <strong>First Name:</strong> {selectedUser.firstName}
        </Text>
        <Text>
          <strong>Last Name:</strong> {selectedUser.lastName}
        </Text>
        <Text>
          <strong>Email:</strong> {selectedUser.email}
        </Text>
        <Text>
          <strong>Phone:</strong> {selectedUser.phoneNumber}
        </Text>
        <Text>
          <strong>Date of Birth:</strong> {selectedUser.dateOfBirth}
        </Text>

        <Divider />

        <Text>
          <strong>Address Line 1:</strong> {selectedUser.addressLine1}
        </Text>
        <Text>
          <strong>Address Line 2:</strong> {selectedUser.addressLine2}
        </Text>
        <Text>
          <strong>City:</strong> {selectedUser.city}
        </Text>
        <Text>
          <strong>County:</strong> {selectedUser.county}
        </Text>
        <Text>
          <strong>Country:</strong> {selectedUser.country}
        </Text>
        <Text>
          <strong>Postal Code:</strong> {selectedUser.postalCode}
        </Text>

        <Divider />

        <Text>
          <strong>Roles:</strong> {rolesFormatted}
        </Text>
        <Text>
          <strong>User ID:</strong> {selectedUser.id}
        </Text>
        <Text>
          <strong>Public ID:</strong> {selectedUser.publicId}
        </Text>
        <Text>
          <strong>Created At:</strong> {createdAtFormatted}
        </Text>
        <Text>
          <strong>Updated At:</strong> {updatedAtFormatted}
        </Text>
      </VStack>
    </Card>
  );
};
