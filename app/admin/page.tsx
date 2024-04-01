"use client"

import { useState } from "react";
import CreateSchoolManagerForm from "./_components/CreateSchoolAdmin";
import CreateSiteAdmin from "./_components/CreateSiteAdmin";
import InviteLink from "./_components/InviteLink";

export default function AdminPage() {
    const [claimUrl, setClaimUrl] = useState("")

    return (
    <div className="container p-0 pt-6">
        <h1 className="text-2xl font-bold mb-4">Site Admin</h1>
        <div className="flex w-full rows p-0 mt-2 space-x-6 self-center">
          <CreateSchoolManagerForm setClaimUrl={setClaimUrl} />
          <CreateSiteAdmin setClaimUrl={setClaimUrl} />
        </div>
        <InviteLink claimUrl={claimUrl}  />
    </div>
    )
}