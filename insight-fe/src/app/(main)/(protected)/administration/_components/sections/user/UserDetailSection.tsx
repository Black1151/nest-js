import { useQuery } from "@/gqty";
import { Card, VStack, Text, Heading, Divider } from "@chakra-ui/react";
import { useEffect } from "react";

interface UserDetailSectionProps {
  publicId: string | null;
}

export const UserDetailSection = ({ publicId }: UserDetailSectionProps) => {
  const query = useQuery();

  console.log("USER DETAILS SECTION RENDER");

  const selectedUser = publicId ? query.getUserByPublicId({ publicId }) : null;

  if (!selectedUser) {
    return (
      <Card p={4}>
        <Text>No user selected.</Text>
      </Card>
    );
  }

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
          <strong>Roles:</strong>{" "}
          {selectedUser.roles?.map((role: any) => role.name).join(", ")}
        </Text>
        <Text>
          <strong>User ID:</strong> {selectedUser.id}
        </Text>
        <Text>
          <strong>Public ID:</strong> {selectedUser.publicId}
        </Text>
        <Text>
          <strong>Created At:</strong>{" "}
          {new Date(selectedUser.createdAt).toLocaleString()}
        </Text>
        <Text>
          <strong>Updated At:</strong>{" "}
          {new Date(selectedUser.updatedAt).toLocaleString()}
        </Text>
      </VStack>
    </Card>
  );
};
