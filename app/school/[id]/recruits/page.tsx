"use client";
import { useState, useEffect } from "react";
import PageTitleContainer from "@/components/page-title";
import { useParams } from "next/navigation";
import { useLazyGetRecruitsQuery } from "@/redux/services/school/managerApi";
import DataTable from "components/ui/data-table";

const RECRUITER_COLUMNS = [
  {
    title: "Name",
    render: (row) => `Student ${row.id}`,
  },
  {
    title: "Application Status",
    render: (row) => `-`,
  },
  {
    title: "Recruitment Source",
    render: (row) => `-`,
  },
  {
    title: "Application Date",
    render: (row) => `-`,
  },
  {
    title: "Recruiter Name",
    render: (row) => `Recruiter ${row.recruiter_id}`,
  },
  {
    title: "Program of Interest",
    render: (row) => `${row.high_school}`,
  },
  {
    title: "Email Address",
    render: (row) => `-`,
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
  }, []);

  return (
    <section>
      <PageTitleContainer title="Recruits" />
      <hr className="border-t border-gray-300" />

      <section className="pi-container pt-0 items-center justify-between">
        <DataTable
          title="Recruits"
          columns={RECRUITER_COLUMNS}
          data={recruits}
          isLoading={isLoading}
        />
      </section>
    </section>
  );
}
