// src/app/(main)/[protected]/administration/coordination-panel/_components/dropdowns/SubjectsDropdown/SubjectDropdown.tsx
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { CreateSubjectInput, UpdateSubjectInput, useQuery } from "@/gqty";
import { Text } from "@chakra-ui/react";
import CrudDropdown from "../CrudDropdown";
import { BaseModal } from "@/components/modals/BaseModal";
import CreateSubjectForm from "./forms/CreateSubjectForm";
import UpdateSubjectForm from "./forms/UpdateSubjectForm";

export const SubjectDropdown = ({
  yearGroupId,
  value,
  onChange,
}: {
  yearGroupId: string | null;
  value: string | null;
  onChange: (id: string | null) => void;
}) => {
  const query = useQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "update" | "delete">(
    "create"
  );

  console.log("SUBJECT DROPDOWN RENDERING");

  /* ───────────── subject list for the chosen YearGroup ───────────── */
  const subjects =
    yearGroupId !== null
      ? query.getYearGroup({
          data: { id: Number(yearGroupId), relations: ["subjects"] },
        })?.subjects ?? []
      : [];

  const options = useMemo(
    () => subjects.map((s) => ({ label: s.name, value: s.id })),
    [subjects]
  );

  // /* ───────────── keep selected value valid ───────────── */
  // useEffect(() => {
  //   if (value !== null && !options.some((o) => o?.value === value)) {
  //     onChange(null);
  //   }
  // }, [options, value, onChange]);

  /* ───────────── handlers called by each form ───────────── */
  const handleSubjectCreated = () => {
    setIsModalOpen(false);
  };
  const handleSubjectUpdated = () => {
    setIsModalOpen(false);
    query.$refetch();
  };

  return (
    <>
      <CrudDropdown
        options={options}
        value={value ?? ""}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          onChange(e.target.value ? e.target.value : null)
        }
        onCreate={() => {
          setModalType("create");
          setIsModalOpen(true);
        }}
        onUpdate={() => {
          setModalType("update");
          setIsModalOpen(true);
        }}
        onDelete={() => {}}
        isUpdateDisabled={value === null}
        isDeleteDisabled
        // isDisabled={yearGroupId === null}
      />

      <BaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === "create" ? "Create Subject" : "Update Subject"}
      >
        <Text>Test</Text>
        {modalType == "create" && (
          <CreateSubjectForm onSuccess={handleSubjectCreated} />
        )}
      </BaseModal>
    </>
  );
};
