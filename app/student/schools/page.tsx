"use client"
import { PageHeader, PageContent } from "@/components/common-page";
import DataTable from "components/ui/data-table";
import { useGetStudentSchoolsQuery } from "@/redux/services/student/studentApi";
import { useSession } from "next-auth/react";

export default function StudentConnection() {
  const { data } = useSession()
  const studentId = data?.user?.roleId
  const {data: {data: schoolData} = {}, isLoading, isFetching } = useGetStudentSchoolsQuery(studentId);

  const COLUMNS = [
    {
      title: "School Name",
      render: (row) => row.school?.name,
    },
    {
      title: "Location",
      render: (row) => row.school?.school_address?.state,
    },
    {
      title: "Applied",
      render: (row) => row.application_status ?? "-",
    },
    {
      title: "Status",
      render: (row) => row.applicant_status ?? "-",
    },
  ];

  return (
    <>
      <PageHeader title="Schools" />
      <PageContent>
        <DataTable
          title="Schools"
          columns={COLUMNS}
          data={schoolData}
          isLoading={isLoading || isFetching}
        />
      </PageContent>
    </>
  )
}