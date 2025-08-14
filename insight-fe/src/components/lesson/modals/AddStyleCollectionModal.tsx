import { useState, useEffect } from "react";
import { Button, HStack, Input } from "@chakra-ui/react";
import { BaseModal } from "@/components/modals/BaseModal";

interface AddStyleCollectionModalProps {
  isOpen: boolean;
  onSave: (name: string, tokens: string[]) => void;
  onClose: () => void;
  /** Pre-populated name when editing an existing collection */
  initialName?: string;
  /** Pre-populated tokens when editing */
  initialTokens?: string[];
  /** Modal title, defaults to "Add Style Collection" */
  title?: string;
  /** Text displayed on the confirmation button */
  confirmLabel?: string;
}

export default function AddStyleCollectionModal({
  isOpen,
  onSave,
  onClose,
  initialName = "",
  initialTokens = [],
  title = "Add Style Collection",
  confirmLabel = "Save",
}: AddStyleCollectionModalProps) {
  const [name, setName] = useState(initialName);
  const [tokens, setTokens] = useState<string[]>(initialTokens);
  const [loading, setLoading] = useState(false);

  const addToken = () => setTokens((ts) => [...ts, ""]);
  const updateToken = (idx: number, value: string) =>
    setTokens((ts) => ts.map((t, i) => (i === idx ? value : t)));
  const removeToken = (idx: number) =>
    setTokens((ts) => ts.filter((_, i) => i !== idx));

  // Reset name whenever the modal is opened or the initial value changes
  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setTokens(initialTokens);
    }
  }, [isOpen, initialName, initialTokens]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <HStack>
          <Button
            colorScheme="blue"
            isLoading={loading}
            onClick={async () => {
              setLoading(true);
              try {
                await onSave(name, tokens.filter((t) => t.trim() !== ""));
                if (initialName === "") {
                  setName("");
                  setTokens([]);
                }
                onClose();
              } finally {
                setLoading(false);
              }
            }}
          >
            {confirmLabel}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </HStack>
      }
    >
      <Input
        placeholder="Collection name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {tokens.map((t, idx) => (
        <HStack key={idx} mt={2}>
          <Input
            placeholder="Token name"
            value={t}
            onChange={(e) => updateToken(idx, e.target.value)}
          />
          <Button size="sm" onClick={() => removeToken(idx)}>
            Remove
          </Button>
        </HStack>
      ))}
      <Button size="sm" mt={2} onClick={addToken}>
        Add Token
      </Button>
    </BaseModal>
  );
}
