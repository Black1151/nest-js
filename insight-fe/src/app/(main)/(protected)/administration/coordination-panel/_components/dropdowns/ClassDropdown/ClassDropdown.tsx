"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { typedGql } from "@/zeus/typedDocumentNode";
import { $ } from "@/zeus";

import { BaseModal } from "@/components/modals/BaseModal";
import CrudDropdown from "../CrudDropdown";
import CreateClassForm from "./forms/CreateClassForm";
import UpdateClassForm from "./forms/UpdateClassForm";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";

/* -------------------------------------------------------------------------- */
/* GraphQL document                                                           */
/* -------------------------------------------------------------------------- */
const GET_CLASSES_BY_YEAR_SUBJECT = typedGql("query")({
  classesByYearAndSubject: [
    { input: $("input", "ClassByYearSubjectInput!") },
    { id: true, name: true },
  ],
} as const);

const DELETE_CLASS = gql`
  mutation DeleteClass($data: IdInput!) {
    deleteClass(data: $data)
  }
`;

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
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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

  const [deleteClass, { loading: deleting }] = useMutation(DELETE_CLASS, {
    onCompleted: () => {
      setIsDeleteOpen(false);
      onChange(null);
      refetch();
    },
  });

  const classes =
    yearGroupId && subjectId ? data?.classesByYearAndSubject ?? [] : [];

  const selectedClass = classes.find((c) => String(c.id) === value);

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
        onUpdate={() => setIsUpdateOpen(true)}
        onDelete={() => setIsDeleteOpen(true)}
        isUpdateDisabled={!value}
        isDeleteDisabled={!value}
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

      <BaseModal
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        title="Update Class"
      >
        <UpdateClassForm
          classId={value ?? ""}
          initialName={selectedClass?.name ?? ""}
          onSuccess={() => {
            setIsUpdateOpen(false);
            refetch();
          }}
        />
      </BaseModal>

      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        action="delete class"
        bodyText="Are you sure you want to delete this class?"
        onConfirm={() => {
          if (value) {
            deleteClass({ variables: { data: { id: Number(value) } } });
          }
        }}
        isLoading={deleting}
      />
    </>
  );
}
