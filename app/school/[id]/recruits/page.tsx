"use client";
import { useState, useEffect } from "react";
import { PageHeader, PageContent } from "@/components/common-page";
import { useParams } from "next/navigation";
import { useLazyGetRecruitsQuery } from "@/redux/services/school/managerApi";
import DataTable from "components/ui/data-table";

const RECRUITER_COLUMNS = [
  {
    title: "Name",
    render: (row) => `${row.student.user.first_name} ${row.student.user.last_name}`,
  },
  {
    title: "High School",
    render: (row) => `${row.student.high_school}`,
  },
  {
    title: "Application Status",
    render: (row) =>
      row.applicant_status ? row.applicant_status :
      row.application_status ? row.application_status :
      "Not Applied",
  },
  {
    title: "Application Date",
    render: (row) => row.application_date ? row.application_date : 'N/A',
  },
  {
    title: "Recruiter Name",
    render: (row) => {
      const recruiterName = row.recruiter.user.first_name ? `${row.recruiter.user.first_name} ${row.recruiter.user.last_name}` : 'N/A';
      return row.recruiter.user.first_name ? recruiterName : <strong>{recruiterName}</strong>;
    }
  },
  {
    title: "Program of Interest",
    render: (row) => row.student.majors ? row.student.majors.join(', ') : 'N/A',
  },
];

export default function Page() {
  const [recruits, setRecruits] = useState<any[]>([]);
  const [getRecruits, { isLoading }] = useLazyGetRecruitsQuery();
  const pageParams = useParams();
  const schoolId = pageParams?.id;

  async function handleGetRecruits() {
    const recruits = await getRecruits({ school_id: schoolId });

    // TODO: Fix the endpoint to eliminate excess path steps
    setRecruits(recruits?.data.data);
  }

  useEffect(() => {
    if (schoolId) {
      handleGetRecruits();
    }
  }, [schoolId]);

  return (
    <>
      <PageHeader title="Recruits" />
      <PageContent>
        <DataTable
          title="Recruits"
          columns={RECRUITER_COLUMNS}
          data={recruits}
          isLoading={isLoading}
        />
      </PageContent>
    </>
  );
}
