import React from "react";
import { Button, useBreakpointValue, Box } from "@chakra-ui/react";
import AddIcon from "@mui/icons-material/Add";

interface AddButtonProps {
  label: string;
  onClick: () => void;
}

const AddButton: React.FC<AddButtonProps> = ({ label, onClick }) => {
  const showLabel = useBreakpointValue({ base: false, sm: true });

  return (
    <Button
      onClick={onClick}
      backgroundColor="lightGreen"
      color="white"
      _hover={{ backgroundColor: "seduloGreen" }}
      p={showLabel ? undefined : 0}
      minW={showLabel ? undefined : "40px"}
      h={showLabel ? undefined : "40px"}
    >
      {showLabel ? (
        <>
          <AddIcon style={{ marginRight: "8px" }} />
          {label}
        </>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          w="100%"
          h="100%"
        >
          <AddIcon />
        </Box>
      )}
    </Button>
  );
};

export default AddButton;
