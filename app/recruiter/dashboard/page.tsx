"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import DiscoverPanel from "../_components/discover-panel";
import StudentPanel from "../_components/student-panel";
import Link from "next/link";
import { GoChevronRight } from "react-icons/go";
import { PageHeader, PageContent } from "@/components/common-page";
import { cn } from "@/lib/utils";

export default function Page() {
  const { data: session } = useSession();
  const recruiterId = session?.user?.roleId || "";
  const [studentId, setStudentId] = useState("");

  return (
    <>
      <PageHeader
        title={
            !studentId ? "Discover New Recruits" : <div className="flex items-center gap-2">
              <Link href="#" className="underline" onClick={() => { setStudentId(''); return false;}}>Search Results</Link>
              <GoChevronRight className="mt-1" />
              <span>Student Profile</span>
            </div>} />
      <PageContent>
        <DiscoverPanel
          recruiterId={recruiterId}
          onStudentSelected={id => setStudentId(id)}
          className={cn(studentId && 'hidden')} />
        {
          /* Conditionally details view */
          studentId && <StudentPanel goBack={() => setStudentId('')} studentId={studentId} recruiterId={recruiterId} />
        }
      </PageContent>
    </>
  );
}
