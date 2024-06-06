"use client";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/loading-spinner";
import { useGetRecruitsQuery } from "@/redux/services/recruiter/recruiterApi";
import { useState } from "react";
import Link from "next/link";
import { GoChevronRight } from "react-icons/go";
import { PageHeader, PageContent } from "@/components/common-page";
import DataTable from "@/components/ui/data-table";
import StudentPanel from "../_components/student-panel";

export default function Page() {
  const session = useSession();
  const recruiterId = session?.data?.user?.roleId;
  const schoolId = session?.data?.user?.schoolID;
  const [studentId, setStudentId] = useState("");
  const acceptedConnection = "";
  const applicants = "";

  // Conditionally query the API only if schoolId and recruiterId are defined
  const { data: recruitsResponse, isLoading } = useGetRecruitsQuery(
    { schoolId, recruiterId, acceptedConnection, applicants },
    { skip: !schoolId || !recruiterId }
  );

  const COLUMNS = [
    {
      title: "FIRST NAME",
      render: (row: any) => row?.student?.user?.first_name,
    },
    {
      title: "LAST NAME",
      render: (row: any) => row?.student?.user?.last_name,
    },
    {
      title: "ACT",
      render: (row: any) => row?.student?.act_score,
    },
    {
      title: "GPA",
      render: (row: any) => row?.student?.gpa,
    },
    {
      title: "SAT",
      render: (row: any) => row?.student?.sat_score,
    },
    {
      title: "Major Interests",
      render: (row: any) => (row.student.majors ? row.student.majors.join(", ") : "N/A"),
    },
    {
      title: "Extracurriculars",
      render: (row: any) => (row.student.extracurriculars ? row.student.extracurriculars.join(", ") : "N/A"),
    },
    {
      title: "Grad Year",
      render: (row: any) => `${row.student.graduation_year}`,
    },
    {
      title: "Action",
      render: (row) => (
        <span
          className="border border-primary p-1.5 px-4 rounded-sm text-primary cursor-pointer text-sm hover:bg-primary hover:text-white"
          onClick={() => setStudentId(row?.student_id)}
        >
          View
        </span>
      ),
    },
  ];

  if (!recruiterId || !schoolId) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageHeader
        title={
          <div className="flex items-center gap-2">
            {!studentId ? (
              <span>Recruiter</span>
            ) : (
              <>
                <Link href="#" className="underline" onClick={() => { setStudentId(''); return false; }}>
                  Connections
                </Link>
                <GoChevronRight className="mt-1" />
                <span>Student Profile</span>
              </>
            )}
          </div>
        }
        titleClass="text-sm"
      />
       <PageContent className="p-4">
           {!studentId ? (
           <DataTable
             title="Connections"
             columns={COLUMNS}
             data={recruitsResponse?.data}
             emptyMessage="No recruits found."
             isLoading={isLoading}
           />
            ) :( 
            <StudentPanel goBack={() => setStudentId("")} studentId={studentId} recruiterId={recruiterId} />
         )}
       </PageContent>
     </>
   );
 }