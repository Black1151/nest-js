"use client";

import { ContentGrid } from "@/components/ContentGrid";
import { useState } from "react";
import ClassListTable from "./_components/sections/ClassListTable";
import { ContentCard } from "@/components/layout/Card";
import { Center, Text } from "@chakra-ui/react";

export function ClassManagerPageClient() {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  return (
    <ContentGrid gridTemplateColumns="1fr 1fr">
      <ClassListTable setSelectedClassId={setSelectedClassId} />
      <ContentCard>
        {selectedClassId ? (
          <Text>Selected Class ID: {selectedClassId}</Text>
        ) : (
          <Center flex={1}>
            <Text fontSize="2xl">No class selected</Text>
          </Center>
        )}
      </ContentCard>
    </ContentGrid>
  );
}
