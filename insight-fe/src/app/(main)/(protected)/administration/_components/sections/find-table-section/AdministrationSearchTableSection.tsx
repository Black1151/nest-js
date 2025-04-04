"use client";

import { ContentCard } from "@/components/layout/Card";
import DataTable from "@/components/tables/DataTable";

interface AdministrationSearchTableSectionProps {
  dataTableProps: React.ComponentProps<typeof DataTable>;
}

export const AdministrationSearchTableSection = ({
  dataTableProps,
}: AdministrationSearchTableSectionProps) => {
  return (
    <ContentCard>
      <DataTable {...dataTableProps} />
    </ContentCard>
  );
};
