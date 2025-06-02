"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import LessonEditor from "@/components/lesson/LessonEditor";
import YearGroupDropdown from "@/components/dropdowns/YearGroupDropdown";
import SubjectDropdown from "@/components/dropdowns/SubjectDropdown";

export const LessonBuilderPageClient = () => {
  const [yearGroupId, setYearGroupId] = useState<string | null>(null);
  const [subjectId, setSubjectId] = useState<string | null>(null);

  return (
    <Flex direction="column" gap={4}>
      <Flex gap={8}>
        <Box>
          <Text mb={2}>Year Group</Text>
          <YearGroupDropdown
            value={yearGroupId}
            onChange={(id) => {
              setYearGroupId(id);
              setSubjectId(null);
            }}
          />
        </Box>
        <Box>
          <Text mb={2}>Subject</Text>
          <SubjectDropdown
            yearGroupId={yearGroupId}
            value={subjectId}
            onChange={setSubjectId}
          />
        </Box>
      </Flex>

      <LessonEditor />
    </Flex>
  );
};
