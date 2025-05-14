import { useQuery } from "@/gqty";
import CrudDropdown from "../CrudDropdown";
import { ChangeEvent, useEffect, useMemo } from "react";

export const YearDropdown = ({
  keyStageId,
  value,
  onChange,
}: {
  keyStageId: number | null; // selected KS id from parent dropdown
  value: number | null; // current YearGroup id
  onChange: (id: number | null) => void;
}) => {
  const query = useQuery();

  console.log("CLASS DROPDOWN RENDERING");

  /* ------------------------------------------------------------------ */
  /* 1. fetch – run *every render* when keyStageId changes              */
  /* ------------------------------------------------------------------ */
  const yearGroups =
    keyStageId !== null
      ? query.getAllYearGroup({
          data: {
            all: true,
            filters: [{ column: "keyStageId", value: String(keyStageId) }],
          },
        })
      : []; // no key-stage yet → empty list

  /* ------------------------------------------------------------------ */
  /* 2. transform to dropdown options                                   */
  /* ------------------------------------------------------------------ */
  const options = useMemo(
    () =>
      yearGroups.map((yg) => ({
        label: yg.year, // e.g. "7", "8", "9"
        value: yg.id, // GQty returns number for IDs here
      })),
    [yearGroups]
  );

  /* ------------------------------------------------------------------ */
  /* 3. if the selected YearGroup no longer exists in the new list,     */
  /*    clear the selection so the UI doesn’t show a mismatched value   */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (
      value !== null &&
      !options.some((o) => o.value.toString() === value.toString())
    ) {
      onChange(null);
    }
  }, [options, value, onChange]);

  /* ------------------------------------------------------------------ */
  /* 4. render                                                          */
  /* ------------------------------------------------------------------ */
  return (
    <CrudDropdown
      options={options}
      value={value ?? ""}
      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
        onChange(e.target.value ? Number(e.target.value) : null)
      }
      onCreate={() => {}}
      onUpdate={() => {}}
      onDelete={() => {}}
      isCreateDisabled
      isUpdateDisabled
      isDeleteDisabled
      /* Optional: grey-out the dropdown until a KS is chosen */
      isDisabled={keyStageId === null}
    />
  );
};
