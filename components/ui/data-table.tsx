"use client";
import Table from "@/components/table";
import { TBODY, TD, TR } from "@/components/table/table-element";
import LoadingSpinner from "components/loading-spinner";

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
                    return (<TD key={index}>{cellValue}</TD>)
                })}
              </TR>))
          }
        </TBODY>
      </Table>)
      }
    </>)
}
