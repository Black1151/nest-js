"use client";

import { Box, Input, List, ListItem, useOutsideClick } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

interface SearchInputProps<T> {
  fetchResults: (term: string) => Promise<T[]>;
  onSelect: (item: T) => void;
  renderItem: (item: T) => React.ReactNode;
  itemKey: (item: T) => string | number;
  placeholder?: string;
  delayMs?: number;
}

export default function SearchInput<T>({
  fetchResults,
  onSelect,
  renderItem,
  itemKey,
  placeholder = "Search...",
  delayMs = 300,
}: SearchInputProps<T>) {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<T[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick({ ref, handler: () => setOpen(false) });

  useEffect(() => {
    const handle = setTimeout(() => {
      if (term.length > 1) {
        fetchResults(term).then((res) => {
          setResults(res);
          setOpen(res.length > 0);
        });
      } else {
        setResults([]);
        setOpen(false);
      }
    }, delayMs);

    return () => clearTimeout(handle);
  }, [term, fetchResults, delayMs]);

  return (
    <Box position="relative" mb={4} ref={ref}>
      <Input
        placeholder={placeholder}
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      {open && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          borderWidth="1px"
          bg="white"
          zIndex={2}
        >
          <List spacing={0} m={0}>
            {results.map((item) => (
              <ListItem
                key={itemKey(item)}
                p={2}
                _hover={{ backgroundColor: "gray.100", cursor: "pointer" }}
                onClick={() => {
                  onSelect(item);
                  setTerm("");
                  setOpen(false);
                }}
              >
                {renderItem(item)}
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
}
