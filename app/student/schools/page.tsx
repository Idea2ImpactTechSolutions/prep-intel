"use client"
import { useState } from "react";
import PageTitleContainer from "@/components/page-title";
import DataTable from "components/ui/data-table";

export default function StudentConnection() {
  const [schools ] = useState([]);
  const COLUMNS = [
    {
      title: "% Match",
      render: (row) => ``,
    },
    {
      title: "School Name",
      render: (row) => `-`,
    },
    {
      title: "Location",
      render: (row) => `-`,
    },
    {
      title: "Applied",
      render: (row) => `-`,
    },
    {
      title: "Status",
      render: (row) => `-`,
    },
    {
      title: "Recruiter",
      render: (row) => `-`,
    },
    {
      title: "Email Address",
      render: (row) => `-`,
    },
  ];

  return (
    <>
      <PageTitleContainer title="Schools" />
      <hr className="border-t border-gray-300 mb-6"  />

      <section className="pi-container">
        <DataTable
          title="Schools"
          columns={COLUMNS}
          data={schools}
          isLoading={false}
        />
      </section>
    </>
  )
}