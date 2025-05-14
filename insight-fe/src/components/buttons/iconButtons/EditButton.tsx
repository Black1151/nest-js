import { EditIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";

export const EditButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <IconButton
      aria-label="Edit"
      icon={<EditIcon />}
      onClick={onClick}
      size="sm"
      bgColor="yellow"
      _hover={{
        transform: "scale(1.1)",
        transition: "all 0.2s ease-in-out",
      }}
    />
  );
};
