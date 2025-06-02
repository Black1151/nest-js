"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import LessonEditor from "@/components/lesson/LessonEditor";
import YearGroupDropdown from "./YearGroupDropdown";

export const LessonBuilderPageClient = () => {
  const [yearGroupId, setYearGroupId] = useState<string | null>(null);

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <Flex alignItems="center" gap={2}>
        <Text>Year Group</Text>
        <YearGroupDropdown value={yearGroupId} onChange={setYearGroupId} />
      </Flex>
      <LessonEditor />
    </Box>
  );
};
