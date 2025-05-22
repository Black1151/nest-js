"use client";

import { ChangeEvent, useMemo, useState } from "react";
import CrudDropdown from "../CrudDropdown";
import { BaseModal } from "@/components/modals/BaseModal";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import CreateTopicForm from "./forms/CreateTopicForm";
import UpdateTopicForm from "./forms/UpdateTopicForm";
import { gql, useQuery, useMutation } from "@apollo/client";

const GET_TOPICS_BY_YEAR_SUBJECT = gql`
  query TopicsByYearAndSubject($input: TopicByYearSubjectInput!) {
    topicsByYearAndSubject(input: $input) {
      id
      name
    }
  }
`;

const DELETE_TOPIC = gql`
  mutation DeleteTopic($data: IdInput!) {
    deleteTopic(data: $data)
  }
`;

interface TopicDropdownProps {
  yearGroupId: string | null;
  subjectId: string | null;
  value: string | null;
  onChange: (id: string | null) => void;
}

export function TopicDropdown({
  yearGroupId,
  subjectId,
  value,
  onChange,
}: TopicDropdownProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const variables = useMemo(
    () =>
      yearGroupId && subjectId
        ? { input: { yearGroupId, subjectId } }
        : undefined,
    [yearGroupId, subjectId]
  );

  const { data, loading, refetch } = useQuery(GET_TOPICS_BY_YEAR_SUBJECT, {
    variables,
    skip: !(yearGroupId && subjectId),
  });

  const [deleteTopic, { loading: deleting }] = useMutation(DELETE_TOPIC, {
    onCompleted: () => {
      setIsDeleteOpen(false);
      refetch();
      onChange(null);
    },
  });

  const topics = yearGroupId && subjectId ? data?.topicsByYearAndSubject ?? [] : [];
  const selectedTopic = topics.find((t: any) => String(t.id) === value);

  const options = useMemo(
    () => topics.map((t: any) => ({ label: t.name, value: String(t.id) })),
    [topics]
  );

  return (
    <>
      <CrudDropdown
        options={options}
        value={value ?? ""}
        isLoading={loading}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          onChange(e.target.value || null)
        }
        onCreate={() => setIsCreateOpen(true)}
        onUpdate={() => setIsUpdateOpen(true)}
        onDelete={() => setIsDeleteOpen(true)}
        isUpdateDisabled={!value}
        isDeleteDisabled={!value}
        isDisabled={!(yearGroupId && subjectId)}
      />

      <BaseModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Topic"
      >
        <CreateTopicForm
          yearGroupId={yearGroupId ?? ""}
          subjectId={subjectId ?? ""}
          onSuccess={() => {
            setIsCreateOpen(false);
            refetch();
          }}
        />
      </BaseModal>

      <BaseModal
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        title="Update Topic"
      >
        <UpdateTopicForm
          topicId={value ?? ""}
          initialName={selectedTopic?.name ?? ""}
          onSuccess={() => {
            setIsUpdateOpen(false);
            refetch();
          }}
        />
      </BaseModal>

      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        action="delete topic"
        bodyText="Are you sure you want to delete this topic?"
        onConfirm={() => {
          if (value) {
            deleteTopic({ variables: { data: { id: Number(value) } } });
          }
        }}
        isLoading={deleting}
      />
    </>
  );
}
