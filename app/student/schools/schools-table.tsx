"use client"
import DataTable from "components/ui/data-table";
import { useGetStudentSchoolsQuery } from "@/redux/services/student/studentApi";
import { useSession } from "next-auth/react";
import Link from "next/link";

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
    {
      title: "Action",
      className: "w-40",
      render: (row) => (
        <Link
          href={`?id=${row.school.id}`}
          className="border border-primary p-1.5 px-4 rounded-sm text-primary cursor-pointer text-sm hover:bg-primary hover:text-white">
          View
        </Link>
      ),
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