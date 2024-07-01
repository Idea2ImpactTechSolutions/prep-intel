import { PageHeader, PageContent } from "@/components/common-page";
import SchoolsTable from "./schools-table";
import { Metadata } from "@/types/metadata.d"
import SchoolView from "../_components/school-view";

export const metadata: Metadata = {
  title: 'My Schools',
};

export default function StudentConnection({searchParams}) {
  const schoolId = searchParams.id as string;

  if (schoolId) {
    return <SchoolView schoolId={schoolId} headerTitle="Connections" />
  }

  return (
    <>
      <PageHeader title="Schools" />
      <PageContent>
        <SchoolsTable />
      </PageContent>
    </>
  )
}