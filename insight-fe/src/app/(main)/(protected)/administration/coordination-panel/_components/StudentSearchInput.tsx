"use client";

import UserSearchInput from "@/components/forms/UserSearchInput";

interface StudentSearchInputProps {
  onSelect: (id: string) => void;
}

export default function StudentSearchInput({ onSelect }: StudentSearchInputProps) {
  return (
    <UserSearchInput
      onSelect={onSelect}
      userTypeFilter="student"
      placeholder="Search students..."
      idField="id"
    />
  );
}

