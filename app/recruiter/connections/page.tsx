"use client";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/loading-spinner";
import { useGetRecruitsQuery } from "@/redux/services/recruiter/recruiterApi";
import { useState } from "react";
import Link from "next/link";
import { GoChevronRight } from "react-icons/go";
import PageTitleContainer from "@/components/page-title";
import DataTable from "@/components/ui/data-table";
import StudentPanel from "../_components/student-panel";
import { cn } from "@/lib/utils";

export default function Page() {
  const session = useSession();
  const recruiterId = session?.data?.user?.roleId;
  const schoolId = session?.data?.user?.schoolID;
  const [studentId, setStudentId] = useState("");
  const acceptedConnection = ""
  const applicants = ""
  const {data:recruitsResponse, isLoading}  = useGetRecruitsQuery({schoolId, recruiterId, acceptedConnection, applicants})

  const COLUMNS = [
    {
      title:"FIRST NAME",
      render: (row:any) => row?.student?.user?.first_name,
    },
    {
      title:"LAST NAME",
      render: (row:any) => row?.student?.user?.last_name,
    },
    {
      title:"ACT",
      render: (row:any) => row?.student?.act_score,
    },
    {
      title:"GPA",
      render: (row:any) => row?.student?.gpa,
    },
    {
      title:"SAT",
      render: (row:any) => row?.student?.sat_score,
    },
    {
      title:"Major Interests",
      render: (row:any) => row.student.majors ? row.student.majors.join(', ') : 'N/A',
    },
    {
      title:"Extracurriculars",
      render: (row:any) => row.student.majors ? row.student.extracurriculars.join(', ') : 'N/A',
    },
    {
      title:"Grad Year",
      render: (row:any) => `${row.student.graduation_year}`,
    },
    {
      title: "Action",
      render: (row) => (
        <span
          className="border border-primary p-1.5 px-4 rounded-sm text-primary cursor-pointer text-sm hover:bg-primary hover:text-white"
          onClick={() => setStudentId(row?.student_id)}>
          View
        </span>
      ),
    },
  ]

  if (!recruiterId || !schoolId) {
    return <LoadingSpinner />
  }

  return (
    <>
      <PageTitleContainer
        title={
          <div className="flex items-center gap-2">
          {
            !studentId ? <span>Recruiter</span> : <>
              <Link href="#" className="underline" onClick={() => { setStudentId(''); return false;}}>Connections</Link>
              <GoChevronRight className="mt-1" />
              <span>Student Profile</span>
            </>
          }
          </div>
        }
        titleClass="text-sm"
      />
      <div className="pi-container">
        { recruitsResponse ?
            <DataTable
              title="Connections"
              columns={COLUMNS}
              data={recruitsResponse.data}
              className={cn(studentId && 'hidden')}
              isLoading={isLoading} />
            :
            <div>Empty</div>
        }
        {
          /* Conditionally details view */
          studentId && <StudentPanel goBack={() => setStudentId('')} studentId={studentId} recruiterId={recruiterId} />
        }
      </div>
    </>
  );
}