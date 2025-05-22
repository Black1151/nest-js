"use client";

import { Flex, Text } from "@chakra-ui/react";
import { ContentCard } from "@/components/layout/Card";
import { TopicDropdown } from "./dropdowns/TopicDropdown/TopicDropdown";
import { LessonDropdown } from "./dropdowns/LessonDropdown/LessonDropdown";
import { useState } from "react";

interface TopicPaneProps {
  yearGroupId: string | null;
  subjectId: string | null;
}

export default function TopicPane({ yearGroupId, subjectId }: TopicPaneProps) {
  const [topicId, setTopicId] = useState<string | null>(null);
  const [lessonId, setLessonId] = useState<string | null>(null);

  return (
    <ContentCard gridColumn="1 / span 2">
      <Flex flexDir="column" gap={2}>
        <Text>Topic</Text>
        <TopicDropdown
          yearGroupId={yearGroupId}
          subjectId={subjectId}
          value={topicId}
          onChange={(id) => {
            setTopicId(id);
            setLessonId(null);
          }}
        />

        <Text>Lesson</Text>
        <LessonDropdown
          topicId={topicId}
          value={lessonId}
          onChange={setLessonId}
        />
      </Flex>
    </ContentCard>
  );
}
