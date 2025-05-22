"use client";

import { Box, Input, List, ListItem } from "@chakra-ui/react";
import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";

const SEARCH_EDUCATORS = typedGql("query")({
  searchUsers: [
    { data: $("data", "SearchInput!") },
    { id: true, firstName: true, lastName: true },
  ],
} as const);

interface EducatorSearchInputProps {
  onSelect: (id: string) => void;
}

export default function EducatorSearchInput({ onSelect }: EducatorSearchInputProps) {
  const [term, setTerm] = useState("");
  const [executeSearch, { data }] = useLazyQuery(SEARCH_EDUCATORS);

  useEffect(() => {
    const handle = setTimeout(() => {
      if (term.length > 1) {
        executeSearch({
          variables: {
            data: {
              search: term,
              columns: ["firstName", "lastName"],
              limit: 5,
              filters: [{ column: "userType", value: "educator" }],
            },
          },
        });
      }
    }, 300);
    return () => clearTimeout(handle);
  }, [term, executeSearch]);

  const results = data?.searchUsers ?? [];

  return (
    <Box position="relative" mb={4}>
      <Input
        placeholder="Search educators..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      {results.length > 0 && (
        <Box position="absolute" top="100%" left={0} right={0} borderWidth="1px" bg="white" zIndex={2}>
          <List spacing={0} m={0}>
            {results.map((e) => (
              <ListItem
                key={e.id}
                p={2}
                _hover={{ backgroundColor: "gray.100", cursor: "pointer" }}
                onClick={() => {
                  onSelect(String(e.id));
                  setTerm("");
                }}
              >{`${e.firstName} ${e.lastName}`}</ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
}

