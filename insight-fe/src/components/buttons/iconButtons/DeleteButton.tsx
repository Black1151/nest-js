import { DeleteIcon, IconButton } from "@chakra-ui/icons";

export default function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <IconButton
      aria-label="Delete"
      icon={<DeleteIcon />}
      onClick={onClick}
      size="sm"
      bgColor="seduloRed"
      color="white"
      _hover={{
        transform: "scale(1.1)",
        transition: "all 0.2s ease-in-out",
      }}
    />
  );
}
