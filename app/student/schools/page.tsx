import { PageHeader, PageContent } from "@/components/common-page";
import SchoolsTable from "./schools-table";
import { Metadata } from "@/types/metadata.d"

export const metadata: Metadata = {
  title: 'My Schools',
  bodyClassName: 'bg-red-200',
};

export default function StudentConnection() {
  return (
    <>
      <PageHeader title="Schools" />
      <PageContent>
        <SchoolsTable />
      </PageContent>
    </>
  )
}