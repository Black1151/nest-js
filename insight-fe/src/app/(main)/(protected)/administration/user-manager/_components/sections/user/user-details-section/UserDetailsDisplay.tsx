import { User } from "@/__generated__/schema-types";
import { ContentCard } from "@/components/layout/Card";
import { LoadingSpinnerCard } from "@/components/loading/LoadingSpinnerCard";
import { $ } from "@/zeus";
import { typedGql } from "@/zeus/typedDocumentNode";
import { useQuery } from "@apollo/client";

import {
  VStack,
  Heading,
  Divider,
  Text,
  Center,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

export const USER_DETAILS_GET_USER_BY_PUBLIC_ID = typedGql("query")({
  getUserByPublicId: [
    { data: $(`data`, "PublicIdRequestDto!") },
    {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      addressLine1: true,
      addressLine2: true,
      city: true,
      county: true,
      country: true,
      postalCode: true,
      createdAt: true,
      updatedAt: true,
      userType: true,
      publicId: true,
      dateOfBirth: true,
      studentProfile: {
        studentId: true,
        schoolYear: true,
      },
      educatorProfile: {
        staffId: true,
      },
    },
  ],
});

interface Props {
  publicId: string;
}

export const UserDetailsDisplay = ({ publicId }: Props) => {
  const { data, loading, error } = useQuery(
    USER_DETAILS_GET_USER_BY_PUBLIC_ID,
    {
      variables: { data: { publicId } },
    }
  );

  if (loading) return <LoadingSpinnerCard text="Loading..." />;
  if (error) return <ContentCard>Error: {error.message}</ContentCard>;

  const user = data?.getUserByPublicId;

  if (!user) return null;

  const created = new Date(
    String(data?.getUserByPublicId?.createdAt)
  ).toLocaleString();
  const updated = new Date(
    String(data?.getUserByPublicId?.updatedAt)
  ).toLocaleString();

  /* panels --------------------------------------------------------------- */
  const accountPanel = (
    <VStack spacing={3} align="start">
      <Heading size="md">Account</Heading>
      <Divider />
      <Text>
        <strong>Name:</strong> {user.firstName} {user.lastName}
      </Text>
      <Text>
        <strong>Email:</strong> {user.email}
      </Text>
      <Text>
        <strong>Phone:</strong> {user.phoneNumber ?? "—"}
      </Text>
      <Divider />
      <Text>
        <strong>Address 1:</strong> {user.addressLine1 ?? "—"}
      </Text>
      <Text>
        <strong>Address 2:</strong> {user.addressLine2 ?? "—"}
      </Text>
      <Text>
        <strong>City:</strong> {user.city ?? "—"}
      </Text>
      <Text>
        <strong>County:</strong> {user.county ?? "—"}
      </Text>
      <Text>
        <strong>Country:</strong> {user.country ?? "—"}
      </Text>
      <Text>
        <strong>Postal Code:</strong> {user.postalCode ?? "—"}
      </Text>
      <Divider />
      <Text>
        <strong>ID:</strong> {String(user.id)}
      </Text>
      <Text>
        <strong>Public ID:</strong> {String(user.publicId)}
      </Text>
      <Text>
        <strong>Created:</strong> {created}
      </Text>
      <Text>
        <strong>Updated:</strong> {updated}
      </Text>
    </VStack>
  );

  const studentPanel = user.studentProfile && (
    <VStack spacing={3} align="start">
      <Heading size="md">Student Profile</Heading>
      <Divider />
      <Text>
        <strong>Student ID:</strong> {user.studentProfile.studentId}
      </Text>
      <Text>
        <strong>School Year:</strong> {user.studentProfile.schoolYear}
      </Text>
    </VStack>
  );

  const educatorPanel = user.educatorProfile && (
    <VStack spacing={3} align="start">
      <Heading size="md">Educator Profile</Heading>
      <Divider />
      <Text>
        <strong>Staff ID:</strong> {user.educatorProfile.staffId}
      </Text>
    </VStack>
  );

  type TabSpec = { label: string; content: JSX.Element };

  const tabs: TabSpec[] = [
    { label: "Account", content: accountPanel },
    ...(user.studentProfile
      ? [{ label: "Student Profile", content: studentPanel! }]
      : []),
    ...(user.educatorProfile
      ? [{ label: "Educator Profile", content: educatorPanel! }]
      : []),
  ];

  return (
    <Tabs isLazy>
      <TabList>
        {tabs.map((t) => (
          <Tab key={t.label}>{t.label}</Tab>
        ))}
      </TabList>

      <TabPanels>
        {tabs.map((t) => (
          <TabPanel key={t.label}>{t.content}</TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};
