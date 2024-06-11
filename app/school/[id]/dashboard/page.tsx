"use client";
import React from "react";
import { useParams } from "next/navigation";
import { PageHeader, PageContent } from "@/components/common-page";
import { useGetSchoolMetricsQuery } from "@/redux/services/school/managerApi";
import LoadingSpinner from "@/components/loading-spinner";


export default function Page() {
  const pageParams = useParams();

  const schoolId = pageParams?.id;
  const { data: schoolMetrics, isLoading } = useGetSchoolMetricsQuery({ school_id: schoolId });

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="h-fit w-full">
        <LoadingSpinner className="mt-5 h-full" />
      </div>
    );
  }

  const {
    totalRecruits,
    pendingApplicants,
    admittedStudents,
    schoolAdmissionConversionRate,
    enrolledStudents,
  } = schoolMetrics?.data || {};

  const dashInfo = {
    applicationCount: totalRecruits || 0,
    admissionsCount: admittedStudents || 0,
    enrollmentCount: enrolledStudents || 0,
    admissionRate: (schoolAdmissionConversionRate * 100).toFixed(2) || 0,
    pendingCount: pendingApplicants,
  };

  return (
    <>
    <PageHeader title="My Dashboard" />
    <PageContent>
      <section className="flex items-center justify-between">
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
            <h2>NA</h2>
          </div>
        </div>
      </section>
    </PageContent>
    </>
  );
}
