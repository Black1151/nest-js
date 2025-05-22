"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";

import { BaseModal } from "@/components/modals/BaseModal";
import CrudDropdown from "../CrudDropdown";
import CreateClassForm from "./forms/CreateClassForm";

/* -------------------------------------------------------------------------- */
/* GraphQL document                                                           */
/* -------------------------------------------------------------------------- */
const GET_CLASSES_BY_YEAR_SUBJECT = typedGql("query")({
  classesByYearAndSubject: [
    { input: $("input", "ClassByYearSubjectInput!") },
    { id: true, name: true },
  ],
} as const);

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
interface ClassDropdownProps {
  yearGroupId: string | null;
  subjectId: string | null;
  value: string | null;
  onChange: (id: string | null) => void;
}

export function ClassDropdown({
  yearGroupId,
  subjectId,
  value,
  onChange,
}: ClassDropdownProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* ------------------------------ variables ------------------------------ */
  const variables = useMemo(
    () =>
      yearGroupId && subjectId
        ? {
            input: {
              yearGroupId,
              subjectId,
              withEducators: false,
              withStudents: false,
            },
          }
        : undefined,
    [yearGroupId, subjectId]
  );

  /* ------------------------------- query --------------------------------- */
  const { data, loading, refetch } = useQuery(GET_CLASSES_BY_YEAR_SUBJECT, {
    variables,
    skip: !(yearGroupId && subjectId),
  });

  const classes =
    yearGroupId && subjectId ? data?.classesByYearAndSubject ?? [] : [];

  const options = useMemo(
    () => classes.map((c) => ({ label: c.name, value: String(c.id) })),
    [classes]
  );

  /* ----------------------------- render ---------------------------------- */
  return (
    <>
      <CrudDropdown
        options={options}
        value={value ?? ""}
        isLoading={loading}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          onChange(e.target.value || null)
        }
        onCreate={() => setIsModalOpen(true)}
        onUpdate={() => {}}
        onDelete={() => {}}
        isUpdateDisabled
        isDeleteDisabled
        isDisabled={!(yearGroupId && subjectId)}
      />

      <BaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Class"
      >
        <CreateClassForm
          yearGroupId={yearGroupId ?? ""}
          subjectId={subjectId ?? ""}
          onSuccess={() => {
            setIsModalOpen(false);
            refetch();
          }}
        />
      </BaseModal>
    </>
  );
}
