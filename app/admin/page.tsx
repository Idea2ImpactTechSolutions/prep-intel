"use client";

import { useState } from "react";
import CreateSchoolManagerForm from "./_components/CreateSchoolAdmin";
import CreateSiteAdmin from "./_components/CreateSiteAdmin";
import InviteLink from "./_components/InviteLink";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import PageList  from "@/components/page-list"

export default function AdminPage() {
  const [claimUrl, setClaimUrl] = useState("");
  const router = useRouter();

  // School is hard-coded and decoupled from sign-in; links give admin users a starting point
  const defaultSampleSchool = "2e0f768e-c887-4945-8cd7-96f96a07a3eb";

  return (
    <div className="container p-0 pt-6">
      <h1 className="text-2xl font-bold mb-4">Site Admin</h1>
      <div className="flex w-full rows p-0 mt-2 space-x-6 self-center">
        <CreateSchoolManagerForm setClaimUrl={setClaimUrl} />
        <CreateSiteAdmin setClaimUrl={setClaimUrl} />
      </div>

      <InviteLink claimUrl={claimUrl} />

      <div className="mt-6">
        <h1 className="text-xl font-bold mb-4">User Portals</h1>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() => router.push("/student/onboarding/vitals")}
            type="button"
            variant="outline"
          >
            Student Portal
          </Button>
          <Button
            onClick={() => router.push("/recruiter/profile/welcome")}
            type="button"
            variant="outline"
          >
            Recruiter Portal
          </Button>
          <Button
            onClick={() => router.push(`/school/${defaultSampleSchool}/dashboard`)}
            type="button"
            variant="outline"
          >
            Manager Portal
          </Button>
        </div>
        <PageList schoolId={defaultSampleSchool} />
      </div>
    </div>
  );
}
