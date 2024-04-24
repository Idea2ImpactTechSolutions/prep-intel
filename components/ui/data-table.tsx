"use client";
import Table from "@/components/table";
import { TBODY, TD, TR } from "@/components/table/table-element";
import LoadingSpinner from "components/loading-spinner";

interface PageProps {
    title: string;
  isLoading: boolean;
  columns: any[];
  data: any[];
}

export default function DataTable({ title, isLoading, columns, data }: PageProps) {
  return (
    <>
    {
      isLoading ? <LoadingSpinner/> :
      (<Table
      title={title}
      columns={columns}
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
