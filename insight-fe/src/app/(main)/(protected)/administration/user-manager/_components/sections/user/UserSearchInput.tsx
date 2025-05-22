"use client";

import { Box, Input, List, ListItem } from "@chakra-ui/react";
import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";

/* -------------------------------------------------------------------------- */
/* GraphQL document                                                           */
/* -------------------------------------------------------------------------- */
export const SEARCH_USERS = typedGql("query")({
  searchUsers: [
    { data: $("data", "SearchInput!") },
    { publicId: true, firstName: true, lastName: true },
  ],
} as const);

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
interface UserSearchInputProps {
  onSelect: (publicId: string) => void;
}

export function UserSearchInput({ onSelect }: UserSearchInputProps) {
  const [term, setTerm] = useState("");
  const [executeSearch, { data }] = useLazyQuery(SEARCH_USERS);

  useEffect(() => {
    const handle = setTimeout(() => {
      if (term.length > 1) {
        executeSearch({
          variables: {
            data: { search: term, columns: ["firstName", "lastName"], limit: 5 },
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
        placeholder="Search users..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      {results.length > 0 && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          borderWidth="1px"
          bg="white"
          zIndex={2}
        >
          <List spacing={0} m={0}>
            {results.map((u) => (
              <ListItem
                key={u.publicId}
                p={2}
                _hover={{ backgroundColor: "gray.100", cursor: "pointer" }}
                onClick={() => {
                  onSelect(u.publicId);
                  setTerm("");
                }}
              >{`${u.firstName} ${u.lastName}`}</ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
}
