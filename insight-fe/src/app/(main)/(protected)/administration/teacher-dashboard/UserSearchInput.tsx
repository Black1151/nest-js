// UserSearchInput.tsx

import React, { useState, ChangeEvent } from "react";
import { Input, Spinner, List, ListItem } from "@chakra-ui/react";

interface UserItem {
  id: string;
  firstName: string;
  lastName: string;
  year?: string;
}

interface UserSearchInputProps {
  role: "student" | "teacher";
  onSelectUser: (user: UserItem) => void;
}

const UserSearchInput: React.FC<UserSearchInputProps> = ({
  role,
  onSelectUser,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearchChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/user/searchUser?q=${query}&role=${role}`
        );
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error(`Error searching ${role}s:`, error);
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <>
      <Input
        placeholder={`Search for ${role}s`}
        value={searchQuery}
        onChange={handleSearchChange}
        mt={4}
      />
      {loading ? (
        <Spinner mt={2} />
      ) : (
        <List mt={2}>
          {searchResults.map((user) => (
            <ListItem
              key={user.id}
              onClick={() => onSelectUser(user)}
              cursor="pointer"
            >
              {user.firstName} {user.lastName}{" "}
              {user.year ? `- ${user.year}` : ""}
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
};

export default UserSearchInput;
