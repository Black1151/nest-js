import { useQuery, YearGroupEntity } from "@/gqty";
import CrudDropdown from "../CrudDropdown";
import { ChangeEvent, useEffect, useMemo } from "react";

export const YearDropdown = ({
  keyStageId,
  value,
  onChange,
}: {
  keyStageId: string | null;
  value: string | null;
  onChange: (id: string | null) => void;
}) => {
  const query = useQuery();

  console.log("YEAR DROPDOWN RENDERING");

  /* -------- fetch -------- */
  const yearGroups: YearGroupEntity[] =
    keyStageId !== null
      ? query.getKeyStage({
          data: {
            id: Number(keyStageId),
            relations: ["yearGroups"],
          },
        })?.yearGroups ?? []
      : [];

  /* -------- options -------- */
  const options = useMemo(
    () =>
      yearGroups.map((yg) => ({
        label: yg.year,
        value: yg.id,
      })),
    [yearGroups]
  );

  /* -------- clear invalid selection -------- */
  // useEffect(() => {
  //   ``;
  //   if (value !== null && !options.some((o) => o.value === value)) {
  //     onChange(null);
  //   }
  // }, [options, value, onChange]);

  /* -------- render -------- */
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
      isDisabled={keyStageId === null}
    />
  );
};
