"use client";

import { useState } from "react";
import CreateSchoolManagerForm from "./_components/CreateSchoolAdmin";
import CreateSiteAdmin from "./_components/CreateSiteAdmin";
import InviteLink from "components/ui/invite-link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IconInput } from "@/components/ui/icon-input";
import { FaSearch } from "react-icons/fa";
import { useLazyGetSchoolsQuery } from "@/redux/services/admin/adminApi";
import Link from "next/link";
import { PageHeader, PageContent } from "@/components/common-page";

export default function AdminPage() {
  const [claimUrl, setClaimUrl] = useState("");
  const router = useRouter();
  const [schools, setSchools] = useState([]);
  const [getMatchingSchools, {isLoading}] = useLazyGetSchoolsQuery();
  const [schoolId, setSchoolId] = useState(7001);

  let filterTimeout;

  function handleOnChange (e){
    clearTimeout(filterTimeout)
    const matchText = e.target.value;

    if (!matchText) {
      setSchools([]);
      return;
    }

    // Minimal debounce
    filterTimeout = setTimeout(async () => {
      const matches = await getMatchingSchools(matchText).unwrap();
      setSchools(matches.data);
    }, 300)
  }

  return (
    <>
    <PageHeader title="Site Admin" />
    <PageContent>
      <div className="flex w-full rows p-0 mt-2 space-x-6 self-center">
        <CreateSchoolManagerForm setClaimUrl={setClaimUrl} />
        <CreateSiteAdmin setClaimUrl={setClaimUrl} />
      </div>

      <InviteLink claimUrl={claimUrl} />

      <div className="mt-6">
        <h1 className="text-xl font-bold mb-4">User Portals</h1>
        <div className="flex flex-wrap gap-4 mb-4">
          <Button
            onClick={() => router.push("/student/onboarding/vitals")}
            type="button"
            variant="outline"
          >
            Student Portal
          </Button>
          <Button
            onClick={() => router.push("/recruiter/dashboard")}
            type="button"
            variant="outline"
          >
            Recruiter Portal
          </Button>
          <Button
            onClick={() => router.push(`/school/${schoolId}/dashboard`)}
            type="button"
            variant="outline"
          >
            Manager Portal
          </Button>
          <Button
            onClick={() => router.push(`/api-doc`)}
            type="button"
            variant="outline"
          >
            Developer API
          </Button>

        </div>

        <IconInput
              type="text"
              id='q'
              label='Schools'
              name="search"
              onChange={handleOnChange}
              icon={<FaSearch className="w-4 h-4" />}
            />
          { isLoading && <div className="my-2 py-3 px-4 rounded bg-gray-100 ">Loading..</div>}
          {
            schools && schools.map(({id, name}, index) => (
              <div key={index} className="my-2 py-3 px-4 rounded bg-gray-100 hover:bg-blue-100" onClick={() => setSchoolId(id)}>
                <Link className="underline cursor-pointer " href={`/school/${id}/my-school`}>{name}</Link>
              </div>))
          }
      </div>
    </PageContent>
    </>
  );
}
