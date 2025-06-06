"use client";

import { useCallback, useState } from "react";

export function useLessonFilters() {
  const [yearGroupId, setYearGroupIdState] = useState<string | null>(null);
  const [subjectId, setSubjectIdState] = useState<string | null>(null);
  const [topicId, setTopicIdState] = useState<string | null>(null);

  const setYearGroupId = useCallback((id: string | null) => {
    setYearGroupIdState(id);
    setSubjectIdState(null);
    setTopicIdState(null);
  }, []);

  const setSubjectId = useCallback((id: string | null) => {
    setSubjectIdState(id);
    setTopicIdState(null);
  }, []);

  const setTopicId = useCallback((id: string | null) => {
    setTopicIdState(id);
  }, []);

  return {
    yearGroupId,
    subjectId,
    topicId,
    setYearGroupId,
    setSubjectId,
    setTopicId,
  };
}
