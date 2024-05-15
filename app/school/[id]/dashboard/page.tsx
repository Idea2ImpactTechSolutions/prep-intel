"use client";
import React from "react";
import { useParams } from "next/navigation";
import PageTitleContainer from "@/components/page-title";

export default function Page() {
  const pageParams = useParams();

  // TODO: Use schoolId to query for data matching the given id
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const schoolId = pageParams?.id;
  const dashInfo = {
    applicationCount: 13.299,
    admissionsCount: 8339,
    enrollmentCount: 5399,
    admissionRate: 60.0,
    pendingCount: 849,
    growthRate: 5.7,
  };

  return (
    <section>
      <PageTitleContainer title="My Dashboard" />
      <section className="pi-container flex items-center justify-between">
        <div
          className="grid grid-cols-4 grid-rows-3 gap-4 w-full"
          style={{ gridTemplateColumns: "1fr 1fr 1fr 2fr" }}
        >
          <div className="bg-gray-100 p-4 rounded">
            <label className="font-bold">Total Applications</label>
            <h2>{dashInfo.applicationCount}</h2>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <label className="font-bold">Total Admissions</label>
            <h2>{dashInfo.admissionsCount}</h2>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <label className="font-bold">Total Enrollments</label>
            <h2>{dashInfo.enrollmentCount}</h2>
          </div>
          <div className="row-span-2 bg-gray-100 p-4 rounded">
            <label className="font-bold">Student Interest</label>
            <img src="/images/us-map.svg" alt="US Map" />
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <label className="font-bold">Admission Rate</label>
            <h2>{dashInfo.admissionRate}%</h2>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <label className="font-bold">Pending Applications</label>
            <h2>{dashInfo.pendingCount}</h2>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <label className="font-bold">Application Growth Rate</label>
            <h2>{dashInfo.growthRate}%</h2>
          </div>
          <div className="bg-gray-100 p-4 rounded col-span-4">
            <label className="font-bold">Student Funnel</label>
          </div>
        </div>
      </section>
    </section>
  );
}
