import { useQuery } from "@/gqty";
import CrudDropdown from "../CrudDropdown";
import { ChangeEvent, useMemo } from "react";

export const KeyStageDropdown = ({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (id: string | null) => void;
}) => {
  const query = useQuery();

  /* ---------- list (fetched once, cached) ---------- */
  const keyStages = query.getAllKeyStage({ data: { all: true } });

  /* ---------- options ---------- */
  const options = useMemo(
    (): { label: string; value: string }[] =>
      keyStages.map((ks) => ({
        // `ks.name` might be null / undefined – coerce to string
        label: ks.name ?? "",
        value: ks.id, // ID comes back as string (GraphQL ID), which is fine
      })),
    [keyStages]
  );

  /* ---------- render ---------- */
  return (
    <CrudDropdown
      options={options}
      value={value ?? ""}
      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
        onChange(e.target.value ? e.target.value : null)
      }
      onCreate={() => {}}
      onUpdate={() => {}}
      onDelete={() => {}}
      isCreateDisabled
      isUpdateDisabled
      isDeleteDisabled
    />
  );
};
