"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import DiscoverPanel from "../_components/discover-panel";
import StudentPanel from "../_components/student-panel";
import Link from "next/link";
import { GoChevronRight } from "react-icons/go";
import PageTitleContainer from "@/components/page-title";
import { cn } from "@/lib/utils";

export default function Page() {
  const { data: session } = useSession();
  const recruiterId = session?.user?.roleId || "";
  const [studentId, setStudentId] = useState("");

  return (
    <>
      <PageTitleContainer
        title={
          <div className="flex items-center gap-2">
          {
            !studentId ? "Discover New Recruits" : <>
              <Link href="#" className="underline" onClick={() => { setStudentId(''); return false;}}>Search Results</Link>
              <GoChevronRight className="mt-1" />
              <span>Student Profile</span>
            </>
          }
          </div>
        }
        titleClass="text-sm"
      />
      <div className="pi-container">
        <DiscoverPanel
          recruiterId={recruiterId}
          onStudentSelected={id => setStudentId(id)}
          className={cn(
            studentId && 'hidden',
          )} />
        {
          /* Conditionally details view */
          studentId && <StudentPanel goBack={() => setStudentId('')} studentId={studentId} recruiterId={recruiterId} />
        }
      </div>
    </>
  );
}
