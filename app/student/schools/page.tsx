"use client"
import PageTitleContainer from "@/components/page-title";
import DataTable from "components/ui/data-table";
import { useGetStudentSchoolsQuery } from "@/redux/services/student/studentApi";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/loading-spinner";

export default function StudentConnection() {
  const { data } = useSession()
  const studentId = data?.user?.roleId
  const {data: response, isLoading, isFetching } = useGetStudentSchoolsQuery(studentId)
  const schoolData = response?.data;

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

  if (isLoading || isFetching) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageTitleContainer title="Schools" />
      <section className="pi-container">
        <DataTable
          title="Schools"
          columns={COLUMNS}
          data={schoolData}
          isLoading={false}
        />
      </section>
    </>
  )
}