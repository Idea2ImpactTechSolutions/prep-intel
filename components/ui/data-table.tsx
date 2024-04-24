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
                { columns.map((col) => <TD key={index}>{row[col.field]}</TD>   ) }
              </TR>))
          }
        </TBODY>
      </Table>)
      }
    </>)
}
