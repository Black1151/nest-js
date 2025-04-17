"use client";

// MyPage.tsx
import { DnDBoardMain } from "@/components/DnD/DnDBoardMain";
import { ColumnType } from "@/components/DnD/types";
import {
  Avatar,
  Box,
  Grid,
  Heading,
  VStack,
  Text,
  HStack,
} from "@chakra-ui/react";
import React from "react";

interface TestInterface extends BaseCardDnD {
  name: string;
  role: string;
  avatarUrl: string;
}

interface BaseCardDnD {
  id: string;
}

const columnMap = {
  confluence: {
    title: "Confluence",
    columnId: "confluence",
    styles: {
      container: { border: "3px dashed orange", width: "300px" },
      header: { bg: "orange.500", color: "white" },
      card: { bg: "orange.200", _hover: { bg: "orange.300" } },
      // cardList: {  },
    },
    items: [
      {
        id: "1",
        name: "John",
        role: "Doe",
        avatarUrl: "https://via.placeholder.com/150",
      },
      {
        id: "2",
        name: "Jane",
        role: "Doe",
        avatarUrl: "https://via.placeholder.com/150",
      },
      {
        id: "3",
        name: "John",
        role: "Doe",
        avatarUrl: "https://via.placeholder.com/150",
      },
      {
        id: "4",
        name: "Jane",
        role: "Doe",
        avatarUrl: "https://via.placeholder.com/150",
      },
      {
        id: "5",
        name: "John",
        role: "Doe",
        avatarUrl: "https://via.placeholder.com/150",
      },
      {
        id: "6",
        name: "Jane",
        role: "Doe",
        avatarUrl: "https://via.placeholder.com/150",
      },
    ],
  },
  jira: {
    title: "Jira",
    columnId: "jira",
    styles: {
      container: {
        width: "300px",
        border: "3px dashed purple",
      },
      header: { bg: "purple.700", color: "white" },
      card: { bg: "purple.200", _hover: { bg: "purple.300" } },
    },
    items: [
      {
        id: "7",
        name: "John",
        role: "Doe",
        avatarUrl: "https://via.placeholder.com/150",
      },
      {
        id: "8",
        name: "Jane",
        role: "Doe",
        avatarUrl: "https://via.placeholder.com/150",
      },
      {
        id: "9",
        name: "John",
        role: "Doe",
        avatarUrl: "https://via.placeholder.com/150",
      },
      {
        id: "10",
        name: "Jane",
        role: "Doe",
        avatarUrl: "https://via.placeholder.com/150",
      },
      {
        id: "11",
        name: "John",
        role: "Doe",
        avatarUrl: "https://via.placeholder.com/150",
      },
    ],
  },
} satisfies Record<string, ColumnType<TestInterface>>;

const orderedColumnIds = ["confluence", "jira"];

const MyCustomCard: React.FC<{ item: TestInterface }> = ({ item }) => {
  const { name, role, avatarUrl } = item;

  return (
    <Grid
      templateColumns="auto 1fr auto"
      alignItems="center"
      gap={4}
      p={4}
      borderRadius="md"
      position="relative"
    >
      <Box pointerEvents="none">
        <Avatar size="lg" name={name} src={avatarUrl} />
      </Box>
      <HStack spacing={1} align="start">
        <Heading as="span" size="xs">
          {name} {role}
        </Heading>
      </HStack>
    </Grid>
  );
};

export default function MyPage() {
  return (
    <div>
      <h1>My Custom Board</h1>
      <DnDBoardMain<TestInterface>
        columnMap={columnMap}
        orderedColumnIds={orderedColumnIds}
        CardComponent={MyCustomCard}
        enableColumnReorder={true}
      />
    </div>
  );
}
