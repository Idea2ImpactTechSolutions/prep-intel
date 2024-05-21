"use client";
import Table from "@/components/table";
import LoadingSpinner from "components/loading-spinner";

interface PageProps {
  title?: string;
  titleNode?: React.ReactNode;
  isLoading: boolean;
  columns: any[];
  data: any[];
  page?: number;
  className?: string;
  totalPages?: number;
  nextPage?: ()=>void;
  prevPage?: ()=>void;
}

export default function DataTable({ title, titleNode, className, isLoading, columns, data, page, totalPages, nextPage, prevPage }: PageProps) {
  return (
    <>
    {
      isLoading ? <LoadingSpinner/> :
      (<Table
        title={title}
        titleNode={titleNode}
        columns={columns}
        className={className}
        page={page}
        totalPages={totalPages}
        nextPage={nextPage}
        prevPage={prevPage}
      >
        <tbody>
          {
            data?.map((row, index) => (
              <tr key={index} className="bg-white border-b border-[#E6EBF0] hover:bg-gray-50">
                { columns.map(function(col, colIndex) {
                  // Conditionally invoke the custom render function, or the given field
                  let cellValue = col.render ? col.render(row) : row[col.field];
                  return <td className="w-4 p-4" key={colIndex}>{cellValue}</td>
                })}
              </tr>))
          }
        </tbody>
      </Table>)
      }
    </>)
}
