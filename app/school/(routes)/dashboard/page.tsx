"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageTitleContainer from "@/components/page-title";
import Image from "next/image";

export default function Page() {
  const router = useRouter();

 const dashInfo = {
    applicationCount: 13.299,
    admissionsCount: 8339,
    enrollmentCount: 5399,
    admissionRate: 60.0,
    pendingCount: 849,
    growthRate: 5.7
 }

  return (
    <section>
        <PageTitleContainer title="My Dashboard" />
        <hr className="border-t border-gray-300 my-4" />

        <section className="p-4 flex items-center justify-between md:px-16 md:mt-4">
        <div className="grid grid-cols-4 grid-rows-3 gap-4 w-full" style={{gridTemplateColumns: '1fr 1fr 1fr 2fr'}}>
            <div className="bg-gray-100 p-4 rounded">
                <label className="font-bold">Total Applications</label>
                <h2>{ dashInfo.applicationCount }</h2>
            </div>
            <div className="bg-gray-100 p-4 rounded">
                <label className="font-bold">Total Admissions</label>
                <h2>{ dashInfo.admissionsCount}</h2>
            </div>
            <div className="bg-gray-100 p-4 rounded">
                <label className="font-bold">Total Enrollments</label>
                <h2>{ dashInfo.enrollmentCount}</h2>
            </div>
            <div className="row-span-2 bg-gray-100 p-4 rounded">
                <label className="font-bold">Student Interest</label>
                <Image src="/images/us-map.svg" alt="US Map" />
            </div>
            <div className="bg-gray-100 p-4 rounded">
                <label className="font-bold">Admission Rate</label>
                <h2>{ dashInfo.admissionRate }%</h2>
            </div>
            <div className="bg-gray-100 p-4 rounded">
                <label className="font-bold">Pending Applications</label>
                <h2>{ dashInfo.pendingCount }</h2>
            </div>
            <div className="bg-gray-100 p-4 rounded">
                <label className="font-bold">Application Growth Rate</label>
                <h2>{ dashInfo.growthRate }%</h2>
                </div>
            <div className="bg-gray-100 p-4 rounded col-span-4">
                <label className="font-bold">Student Funnel</label>
            </div>
        </div>
        </section>
    </section>
  );
}
