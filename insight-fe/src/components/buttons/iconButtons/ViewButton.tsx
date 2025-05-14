import { IconButton } from "@chakra-ui/react";
import { Visibility } from "@mui/icons-material";

export const ViewButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <IconButton
      aria-label="View"
      icon={<Visibility />}
      onClick={onClick}
      size="sm"
      bgColor="seduloGreen"
      _hover={{
        transform: "scale(1.1)",
        transition: "all 0.2s ease-in-out",
      }}
    />
  );
};
