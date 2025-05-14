"use client";

import { Flex } from "@chakra-ui/react";
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
    <Flex gap={4} flexDir="column">
      <ContentCard>
        {/* ------------------- 1. key stage ------------------- */}
        <KeyStageDropdown
          value={keyStageId}
          onChange={(id: string | null) => {
            setKeyStageId(id);
            setYearGroupId(null);
            setSubjectId(null);
          }}
        />

        {/* ------------------- 2. year group ------------------ */}
        <YearDropdown
          keyStageId={keyStageId}
          value={yearGroupId}
          onChange={(id: string | null) => {
            setYearGroupId(id);
            setSubjectId(null);
          }}
        />

        {/* ------------------- 3. subjects ------------------ */}
        <SubjectDropdown
          yearGroupId={yearGroupId}
          value={subjectId}
          onChange={(id: string | null) => {
            setSubjectId(id);
          }}
        />
      </ContentCard>
    </Flex>
  );
}
