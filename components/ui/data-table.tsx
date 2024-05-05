"use client";
import Table from "@/components/table";
import { TBODY, TD, TR } from "@/components/table/table-element";
import LoadingSpinner from "components/loading-spinner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface PageProps {
  title?: string;
  titleNode?: React.ReactNode;
  isLoading: boolean;
  columns: any[];
  data: any[];
  page?: number;
  totalPages?: number;
  nextPage?: ()=>void;
  prevPage?: ()=>void;
}

export default function DataTable({ title, titleNode, isLoading, columns, data, page, totalPages, nextPage, prevPage }: PageProps) {
  const { data: session } = useSession()
  const router = useRouter()

  const handleViewStudentProfile = (data) => {
    const recruiterId = session?.user?.roleId
    const studentId = data?.studentId
    router.push(`/recruiter/${recruiterId}/student/${studentId}/student-profile`)
  }

  return (
    <>
    {
      isLoading ? <LoadingSpinner/> :
      (<Table
        title={title}
        titleNode={titleNode}
        columns={columns}
        page={page}
        totalPages={totalPages}
        nextPage={nextPage}
        prevPage={prevPage}
      >
        <TBODY>
          {
            data?.map((row, index) => (
              <TR key={index}>
                { columns.map(function(col) {
                  // Conditionally invoke the custom render function, or the given field
                  let cellValue = col.render ? col.render(row) : row[col.field];
                    return (
                     col.field !== "viewBtn" 
                     ? <TD key={index}>{cellValue}</TD>
                     : col.field === "viewBtn" && <TD> <span className="border border-primary p-1.5 px-4 rounded-sm text-primary cursor-pointer text-sm hover:bg-primary hover:text-white" onClick={() => handleViewStudentProfile(row)}> View </span> </TD>
                    )
                })}
              </TR>))
          }
        </TBODY>
      </Table>)
      }
    </>)
}
