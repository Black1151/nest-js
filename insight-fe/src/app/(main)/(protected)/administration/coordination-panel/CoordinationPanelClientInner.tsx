"use client";

import { Flex, Grid, Text } from "@chakra-ui/react";
import { KeyStageDropdown } from "./_components/dropdowns/KeyStageDropdown/KeyStageDropdown";
import { YearDropdown } from "./_components/dropdowns/YearGroup/YearDropdown";
import { ContentCard } from "@/components/layout/Card";
import { useState } from "react";
import { SubjectDropdown } from "./_components/dropdowns/SubjectsDropdown/SubjectDropdown";
import { ClassDropdown } from "./_components/dropdowns/ClassDropdown/ClassDropdown";
import { ContentGrid } from "@/components/ContentGrid";
import ClassMembersPane from "./_components/ClassMembersPane";
import TopicPane from "./_components/TopicPane";

export default function CoordinationPanelClientInner() {
  const [keyStageId, setKeyStageId] = useState<string | null>(null);
  const [yearGroupId, setYearGroupId] = useState<string | null>(null);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [classId, setClassId] = useState<string | null>(null);

  console.log("PARENT RENDERING");

  return (
    <Grid templateColumns="1fr 1fr" gap={4}>
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
                setClassId(null);
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
                setClassId(null);
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
                setClassId(null);
              }}
            />
          </Flex>

          {/* ------------------- 4. class ------------------ */}
        </Flex>
      </ContentCard>
      <ClassMembersPane
        yearGroupId={yearGroupId}
        subjectId={subjectId}
        classId={classId}
        setClassId={setClassId}
      />
      <TopicPane yearGroupId={yearGroupId} subjectId={subjectId} />
    </Grid>
  );
}
