"use client"
import DataTable from "components/ui/data-table";
import { useGetStudentSchoolsQuery } from "@/redux/services/student/studentApi";
import { useSession } from "next-auth/react";

export default function SchoolsTable() {
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
    <DataTable
      title="Schools"
      columns={COLUMNS}
      data={schoolData}
      isLoading={isLoading || isFetching}
      />
  )
}