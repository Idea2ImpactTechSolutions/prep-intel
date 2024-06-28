"use client";
import { useState } from "react";
import { PageHeader, PageContent } from "@/components/common-page";
import { useParams } from "next/navigation";
import { useGetRecruitsQuery } from "@/redux/services/school/managerApi";
import DataTable from "@/components/ui/data-table";
import StudentInformation from "@/components/student/student-information";
import Link from "next/link";
import { GoChevronRight } from "react-icons/go";

interface RouteParams {
  id: string; // Asserting that id will always be a string
}

export default function Page() {
  const [studentId, setStudentId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageParams = useParams() as unknown as RouteParams;
  const schoolId = pageParams.id;
  const { data: {data: { recruits, totalItems, totalPages} = {}} = {}, isLoading: recruitsLoading  } = useGetRecruitsQuery({school_id: schoolId, searchTerm, currentPage});

  const COLUMNS = [
    {
      title: "Name",
      render: (row) => `${row.student.user.first_name} ${row.student.user.last_name}`,
    },
    {
      title: "High School",
      render: (row) => `${row.student.high_school}`,
    },
    {
      title: "Application Status",
      render: (row) =>
        row.applicant_status ? row.applicant_status :
        row.application_status ? row.application_status :
        "Not Applied",
    },
    {
      title: "Application Date",
      render: (row) => row.application_date ? row.application_date : 'N/A',
    },
    {
      title: "Recruiter Name",
      render: (row) => {
        const recruiterName = row.recruiter.user.first_name ? `${row.recruiter.user.first_name} ${row.recruiter.user.last_name}` : 'N/A';
        return row.recruiter.user.first_name ? recruiterName : <strong>{recruiterName}</strong>;
      }
    },
    {
      title: "Program of Interest",
      render: (row) => row.student.majors ? row.student.majors.join(', ') : 'N/A',
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

  return (
    <>
      <PageHeader
        title={
            !studentId ? "Recruits" : <div className="flex items-center gap-2">
              <Link href="#" className="underline" onClick={() => { setStudentId(''); return false;}}>Recruits</Link>
              <GoChevronRight className="mt-1" />
              <span>Student Profile</span>
            </div>} />
      <PageContent>
      {!studentId ? (
          <DataTable
            title="Recruits"
            columns={COLUMNS}
            data={recruits}
            page={currentPage}
            totalPages={totalPages}
            nextPage={() => setCurrentPage(currentPage + 1)}
            prevPage={() => setCurrentPage(currentPage - 1)}
            isLoading={recruitsLoading}
            onSearchChange={(x:any) => setSearchTerm(x.target.value)}
          />
            ) :(
            <StudentInformation studentId={studentId} schoolId={schoolId} />
         )}
      </PageContent>
    </>
  );
}
