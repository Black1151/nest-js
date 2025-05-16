"use client";

import { useQuery } from "@apollo/client";
import { VStack, Select } from "@chakra-ui/react";
import { useState } from "react";
import { typedGql } from "zeus/typedDocumentNode";

const LoadFilters = typedGql("query")({
  getAllKeyStage: [
    { data: { all: true } },
    { id: true, name: true, krull: true },
  ],
  getAllYearGroup: [{ data: { all: true } }, { id: true, year: true }],
  getAllSubject: [{ data: { all: true } }, { id: true, name: true }],
} as const);

export default function ZeusTestPage() {
  const [selectedKeyStage, setKS] = useState("");
  const [selectedYearGroup, setYG] = useState("");
  const [selectedSubject, setSubj] = useState("");

  const { data, loading, error } = useQuery(LoadFilters);

  if (loading) return <>Loading…</>;
  if (error || !data) return <>Error: {error?.message}</>;

  return (
    <VStack w={800} gap={4}>
      <Select
        placeholder="Key stage"
        value={selectedKeyStage}
        onChange={(e) => setKS(e.target.value)}
      >
        {data.getAllKeyStage.map((o) => (
          <option key={String(o.id)} value={String(o.id)}>
            {o.name}
          </option>
        ))}
      </Select>

      <Select
        placeholder="Year group"
        value={selectedYearGroup}
        onChange={(e) => setYG(e.target.value)}
      >
        {data.getAllYearGroup.map((o) => (
          <option key={String(o.id)} value={String(o.id)}>
            {o.year}
          </option>
        ))}
      </Select>

      <Select
        placeholder="Subject"
        value={selectedSubject}
        onChange={(e) => setSubj(e.target.value)}
      >
        {data.getAllSubject.map((o) => (
          <option key={String(o.id)} value={String(o.id)}>
            {o.name}
          </option>
        ))}
      </Select>
    </VStack>
  );
}
