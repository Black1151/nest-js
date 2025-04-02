import { Grid, GridProps } from "@chakra-ui/react";
import React from "react";

interface ContentGridProps extends GridProps {
  children: React.ReactNode;
}

export const ContentGrid = ({ children, ...props }: ContentGridProps) => {
  return (
    <Grid
      templateColumns="200px 1fr"
      flex={1}
      width="100%"
      gap={4}
      overflow="hidden"
      {...props}
    >
      {children}
    </Grid>
  );
};
