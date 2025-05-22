"use client";

import { useLazyQuery } from "@apollo/client";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";
import SearchInput from "./SearchInput";

const SEARCH_USERS = typedGql("query")({
  searchUsers: [
    { data: $("data", "SearchInput!") },
    { id: true, publicId: true, firstName: true, lastName: true },
  ],
} as const);

interface User {
  id: number;
  publicId: string;
  firstName: string;
  lastName: string;
}

interface UserSearchInputProps {
  onSelect: (id: string) => void;
  placeholder?: string;
  userTypeFilter?: string;
  idField?: "id" | "publicId";
}

export default function UserSearchInput({
  onSelect,
  placeholder = "Search users...",
  userTypeFilter,
  idField = "id",
}: UserSearchInputProps) {
  const [executeSearch] = useLazyQuery(SEARCH_USERS);

  const fetchResults = async (term: string): Promise<User[]> => {
    const { data } = await executeSearch({
      variables: {
        data: {
          search: term,
          columns: ["firstName", "lastName"],
          limit: 5,
          ...(userTypeFilter
            ? { filters: [{ column: "userType", value: userTypeFilter }] }
            : {}),
        },
      },
    });
    return data?.searchUsers ?? [];
  };

  return (
    <SearchInput
      placeholder={placeholder}
      fetchResults={fetchResults}
      onSelect={(u) => onSelect(String(u[idField]))}
      renderItem={(u) => `${u.firstName} ${u.lastName}`}
      itemKey={(u) => String(u[idField])}
    />
  );
}
