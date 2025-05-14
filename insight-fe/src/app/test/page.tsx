"use client";

import { Select, VStack } from "@chakra-ui/react";
import { useQuery } from "@/gqty";
import { useState, useMemo } from "react";

/** constant so we don’t create a brand-new object on every render */
const ALL = { data: { all: true } };

export default function TestPage() {
  /* controlled form state --------------------------------------- */
  const [selectedKeyStage, setSelectedKeyStage] = useState("");
  const [selectedYearGroup, setSelectedYearGroup] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  /* raw GQty data ------------------------------------------------ */
  const { getAllYearGroup, getAllKeyStage, getAllSubject } = useQuery({
    suspense: true,
  });
  const keyStages = getAllKeyStage(ALL);
  const yearGroups = getAllYearGroup(ALL);
  const subjects = getAllSubject(ALL);

  /* —— 1. derive plain arrays as soon as we read the query —— */
  const keyStageOpts = useMemo(
    () => keyStages.map((ks) => ({ value: ks.id, label: ks.name })),
    [keyStages.map((k) => k.id).join("," /* stable dep */)]
  );
  const yearGroupOpts = useMemo(
    () => yearGroups.map((yg) => ({ value: yg.id, label: yg.year })),
    [yearGroups.map((y) => y.id).join(",")]
  );
  const subjectOpts = useMemo(
    () => subjects.map((sb) => ({ value: sb.id, label: sb.name })),
    [subjects.map((s) => s.id).join(",")]
  );

  /* UI ----------------------------------------------------------- */
  return (
    <VStack width={800} gap={4}>
      <Select
        placeholder="Key stage"
        value={selectedKeyStage}
        onChange={(e) => setSelectedKeyStage(e.target.value)}
      >
        {keyStageOpts.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>

      <Select
        placeholder="Year group"
        value={selectedYearGroup}
        onChange={(e) => setSelectedYearGroup(e.target.value)}
      >
        {yearGroupOpts.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>

      <Select
        placeholder="Subject"
        value={selectedSubject}
        onChange={(e) => setSelectedSubject(e.target.value)}
      >
        {subjectOpts.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
    </VStack>
  );
}
