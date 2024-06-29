"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/loading-spinner";
import { useGetConnectionsQuery } from "@/redux/services/recruiter/recruiterApi";
import Link from "next/link";
import { GoChevronRight } from "react-icons/go";
import { PageHeader, PageContent } from "@/components/common-page";
import DataTable from "@/components/ui/data-table";
import StudentInformation from "@/components/student/student-information";
import { SearchInput } from "@/components/ui/search-input";

export default function Page() {
  const session = useSession();
  const recruiterId = session?.data?.user?.roleId;
  const schoolId = session?.data?.user?.schoolID;
  const [studentId, setStudentId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // const acceptedConnection = false;  // TODO: Current behavior passes recruiterId, which bypasses accepedConnected behavior
  // const applicants = "";

  const { data: {data: response} = {}, isLoading, isFetching } = useGetConnectionsQuery({
      schoolId,
      recruiterId,
      searchTerm,
      currentPage,
    },
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

  // Anytime the search term changes, the page index must reset, to ensure we scroll
  // to the first page of results.
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (!recruiterId || !schoolId) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageHeader
        title={
          <div className="flex items-center gap-2">
            {!studentId ? (
              <span>Connections</span>
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
        rightContent={
          <SearchInput
            type="text"
            id='q'
            name="search"
            containerClass="mb-0"
            iconClass={searchTerm && "hidden"}
            variant="right"
            className="w-[450px]"
            placeholder="Type to search..."
            onChange={(x:any) => setSearchTerm(x.target.value)}
          />}

        titleClass="text-sm"
      />
       <PageContent className="p-4">
           {!studentId ? (
           <DataTable
             title="Connections"
             columns={COLUMNS}
             data={response?.recruits}
             emptyMessage="No recruits found."
             page={currentPage}
             totalPages={response?.totalPages}
             totalItems={response?.totalItems}
             nextPage={() => setCurrentPage(currentPage + 1)}
             prevPage={() => setCurrentPage(currentPage - 1)}
             isLoading={isLoading || isFetching}
           />
            ) :(
            <StudentInformation studentId={studentId} schoolId={schoolId} recruiterId={recruiterId} />
         )}
       </PageContent>
     </>
   );
 }