"use client";

import { Flex, Text, VStack } from "@chakra-ui/react";
import { KeyStageDropdown } from "./_components/dropdowns/KeyStageDropdown/KeyStageDropdown";
import { YearDropdown } from "./_components/dropdowns/YearGroup/YearDropdown";
import { ContentCard } from "@/components/layout/Card";
import { useState } from "react";
import { SubjectDropdown } from "./_components/dropdowns/SubjectsDropdown/SubjectDropdown";

export default function CoordinationPanelClientInner() {
  const [keyStageId, setKeyStageId] = useState<string | null>(null);
  const [yearGroupId, setYearGroupId] = useState<string | null>(null);
  const [subjectId, setSubjectId] = useState<string | null>(null);

  console.log("PARENT RENDERING");

  return (
    <ContentCard>
      <Flex gap={8} flexDir="column">
        {/* ------------------- 1. key stage ------------------- */}
        <Flex flexDir="column" gap={2}>
          <Text>Key Stage</Text>
          <KeyStageDropdown
            value={keyStageId}
            onChange={(id: string | null) => {
              setKeyStageId(id);
              setYearGroupId(null);
              setSubjectId(null);
            }}
          />
        </Flex>

        {/* ------------------- 2. year group ------------------ */}
        <Flex flexDir="column" gap={2}>
          <Text>Year Group</Text>
          <YearDropdown
            keyStageId={keyStageId}
            value={yearGroupId}
            onChange={(id: string | null) => {
              setYearGroupId(id);
              setSubjectId(null);
            }}
          />
        </Flex>

        {/* ------------------- 3. subjects ------------------ */}
        <Flex flexDir="column" gap={2}>
          <Text>Subject</Text>
          <SubjectDropdown
            yearGroupId={yearGroupId}
            value={subjectId}
            onChange={(id: string | null) => {
              setSubjectId(id);
            }}
          />
        </Flex>
      </Flex>
    </ContentCard>
  );
}
