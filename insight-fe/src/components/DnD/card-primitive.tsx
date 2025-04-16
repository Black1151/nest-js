import React, { forwardRef, type Ref } from "react";

import {
  Avatar,
  Box,
  Grid,
  Heading,
  Menu,
  IconButton,
  MenuButton,
  Text,
  VStack,
} from "@chakra-ui/react";

// You can replace the below icons with whatever best suits your needs.
// For a "more" icon, you might use the HamburgerIcon or any other from @chakra-ui/icons.
// import { HamburgerIcon } from "@chakra-ui/icons";

import { type Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import { Person } from "./data/people";
import { Menu as MenuIcon } from "lucide-react";
import { getStateStyle, State } from "./Card";

type CardPrimitiveProps = {
  closestEdge: Edge | null;
  item: Person;
  state: State;
  actionMenuTriggerRef?: Ref<HTMLButtonElement>;
};

export const CardPrimitive = forwardRef<HTMLDivElement, CardPrimitiveProps>(
  function CardPrimitive(
    { closestEdge, item, state, actionMenuTriggerRef },
    ref
  ) {
    const { avatarUrl, name, role, userId } = item;
    const stateStyleProps = getStateStyle(state.type);

    return (
      <Grid
        ref={ref}
        data-testid={`item-${userId}`}
        templateColumns="auto 1fr auto"
        alignItems="center"
        gap={4}
        bg="white"
        p={4}
        borderRadius="md"
        position="relative"
        _hover={{ bg: "gray.100" }}
        {...stateStyleProps}
      >
        {/* Avatar */}
        <Box pointerEvents="none">
          <Avatar size="lg" name={name} src={avatarUrl} />
        </Box>

        {/* Name and role */}
        <VStack spacing={1} align="start">
          <Heading as="span" size="xs">
            {name}
          </Heading>
          <Text fontSize="sm" m={0}>
            {role}
          </Text>
        </VStack>

        {/* Menu button */}
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<MenuIcon />}
            aria-label={`Move ${name}`}
            variant="ghost"
            size="sm"
            ref={actionMenuTriggerRef}
          />
        </Menu>

        {/* Drop indicator if needed */}
        {closestEdge && <DropIndicator edge={closestEdge} gap="0.5rem" />}
      </Grid>
    );
  }
);
