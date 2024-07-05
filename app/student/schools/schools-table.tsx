"use client"
import { useState } from "react";
import DataTable from "components/ui/data-table";
import { useGetStudentSchoolsQuery } from "@/redux/services/student/studentApi";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUpdateRecruitMutation } from "@/redux/services/student/studentApi";
import { ApplicationStatus } from "@/app/enums/application-status";
import { ApplicantStatus } from "@/app/enums/applicant-status";

export default function SchoolsTable() {
  const { data } = useSession()
  const studentId = data?.user?.roleId
  const {data: {data: schoolData} = {}, isLoading, isFetching } = useGetStudentSchoolsQuery(studentId, {skip: !studentId});
  const [updateRecruit, { isLoading: isSending }] = useUpdateRecruitMutation();
  const buttonClass = "border border-primary p-1.5 px-4 rounded-sm text-primary cursor-pointer text-sm hover:bg-primary hover:text-white";
  const [updatingSchoolId, setUpdatingSchoolId] = useState(null);

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
      render: (row) => row.application_status === ApplicationStatus.SUBMITTED ? "Yes" : (<Button
            type='submit'
            variant="outline"
            className={buttonClass}
            loading={isSending && row.school.id === updatingSchoolId}
            disabled={isSending && row.school.id === updatingSchoolId}
            loadingText={"Sending..."}
            onClick={() => {setUpdatingSchoolId(row.school.id); updateRecruit({
              studentId,
              data: {
                student_id: studentId,
                school_id: row.school.id,
                application_status: ApplicationStatus.SUBMITTED,
                applicant_status: ApplicantStatus.APPLIED,
              },
            })}}
        >
          Mark as Applied
        </Button>),
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
          className={buttonClass}>
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