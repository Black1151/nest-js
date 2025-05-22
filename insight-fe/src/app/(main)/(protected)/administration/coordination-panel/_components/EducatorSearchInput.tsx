"use client";

import UserSearchInput from "@/components/forms/UserSearchInput";

interface EducatorSearchInputProps {
  onSelect: (id: string) => void;
}

export default function EducatorSearchInput({ onSelect }: EducatorSearchInputProps) {
  return (
    <UserSearchInput
      onSelect={onSelect}
      userTypeFilter="educator"
      placeholder="Search educators..."
      idField="id"
    />
  );
}

