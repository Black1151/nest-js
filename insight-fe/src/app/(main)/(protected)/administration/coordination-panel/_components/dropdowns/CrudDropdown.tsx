import React from "react";
import {
  HStack,
  Select,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { Plus, Edit2, Trash2 } from "lucide-react";

export interface CrudDropdownProps {
  options: { label: string; value: string }[];
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onCreate: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  isDisabled?: boolean;
  isCreateDisabled?: boolean;
  isUpdateDisabled?: boolean;
  isDeleteDisabled?: boolean;
}

const CrudDropdown: React.FC<CrudDropdownProps> = ({
  options,
  value,
  onChange,
  onCreate,
  onUpdate,
  onDelete,
  isDisabled = false,
  isCreateDisabled = false,
  isUpdateDisabled = false,
  isDeleteDisabled = false,
}) => {
  const createDisabled = isDisabled || isCreateDisabled;
  const updateDisabled = isDisabled || isUpdateDisabled;
  const deleteDisabled = isDisabled || isDeleteDisabled;

  /* ---------- ensure every option has a unique, defined key ---------- */
  const dedupedOptions = React.useMemo(() => {
    const seen = new Set<string | number>();
    return options.filter((o) => {
      if (o.value === undefined || seen.has(o.value)) return false;
      seen.add(o.value);
      return true;
    });
  }, [options]);

  return (
    <HStack spacing={2} w="full">
      <Select
        flex={1}
        value={value}
        onChange={onChange}
        isDisabled={isDisabled}
        bg={useColorModeValue("white", "gray.800")}
        _hover={{ shadow: "sm" }}
        _focus={{ shadow: "outline" }}
      >
        <option key="__empty" value="">
          ─ select ─
        </option>
        {dedupedOptions.map((opt) => (
          <option key={String(opt.value)} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>

      <IconButton
        aria-label="Create"
        icon={<Plus />}
        onClick={onCreate}
        colorScheme="green"
        isDisabled={createDisabled}
        _focus={{ shadow: "outline" }}
      />

      <IconButton
        aria-label="Update"
        icon={<Edit2 />}
        onClick={onUpdate}
        colorScheme="blue"
        isDisabled={updateDisabled}
        _focus={{ shadow: "outline" }}
      />

      <IconButton
        aria-label="Delete"
        icon={<Trash2 />}
        onClick={onDelete}
        colorScheme="red"
        isDisabled={deleteDisabled}
        _focus={{ shadow: "outline" }}
      />
    </HStack>
  );
};

export default CrudDropdown;
