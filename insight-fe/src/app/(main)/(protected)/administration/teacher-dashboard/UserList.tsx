// UserList.tsx

import React from "react";
import { List, ListItem } from "@chakra-ui/react";

interface UserItem {
  id: string;
  firstName: string;
  lastName: string;
}

interface UserListProps {
  users: UserItem[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  return (
    <List mt={2}>
      {users.map((user) => (
        <ListItem key={user.id}>
          {user.firstName} {user.lastName}
        </ListItem>
      ))}
    </List>
  );
};

export default UserList;
