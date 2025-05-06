import { ContentCard } from "@/components/layout/Card";
import { useQuery, User } from "@/gqty";
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

export const prepareUser = (user: User) => {
  // Basic user fields
  user.firstName;
  user.lastName;
  user.email;
  user.phoneNumber;
  user.dateOfBirth;
  user.addressLine1;
  user.addressLine2;
  user.city;
  user.county;
  user.country;
  user.postalCode;
  user.id;
  user.publicId;
  user.createdAt;
  user.updatedAt;
  user.userType;

  /* profile fragments */
  if (user.studentProfile) {
    user.studentProfile.studentId;
    user.studentProfile.schoolYear;
  }
  if (user.educatorProfile) {
    user.educatorProfile.staffId;
  }

  // // Student profile (if any)
  // // Access any fields you might need
  // user.studentProfile?.id;
  // user.studentProfile?.studentId;
  // user.studentProfile?.schoolYear;

  // // Educator profile (if any)
  // user.educatorProfile?.id;
  // user.educatorProfile?.staffId;
};

interface Props {
  publicId: string;
}

export const UserDetailsDisplay = ({ publicId }: Props) => {
  const query = useQuery({
    prepare({ query: { getUserByPublicId } }) {
      if (publicId) prepareUser(getUserByPublicId({ data: { publicId } }));
    },
  });

  const user = publicId
    ? query.getUserByPublicId({ data: { publicId } })
    : null;
  if (!user) return null;

  const created = new Date(user.createdAt).toLocaleString();
  const updated = new Date(user.updatedAt).toLocaleString();

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
        <strong>ID:</strong> {user.id}
      </Text>
      <Text>
        <strong>Public ID:</strong> {user.publicId}
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
