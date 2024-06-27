"use client";
import { cn } from '@/lib/utils';
import { Dictionary } from '@/types/dictionary'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'
import LoadingSpinner from "components/loading-spinner";
import { SearchInput } from './search-input';

interface PageProps {
  title?:string;
  className?:string;
  titleNode?:React.ReactNode;
  isLoading: boolean;
  columns:Dictionary[];
  emptyMessage?:string;
  data: any[];
  columnHeaderStyle?:string
  page?: number;
  offset?: number;
  totalPages?: number;
  nextPage?: ()=>void;
  prevPage?: ()=>void;
  onSearchChange?: (event: any) => void;
}

export default function DataTable({ title, titleNode, className, isLoading, columnHeaderStyle, columns, data, page=1, totalPages=0, nextPage, prevPage, onSearchChange, offset=10, emptyMessage="No results." }: PageProps) {
  const minusOne = page-1;
  const start = minusOne * offset + 1;
  const end = minusOne * offset + 10;

   return (
    <div className={cn("overflow-hidden rounded-lg border", className)}>
      <div className='flex items-center p-4 py-3 bg-[#F6F8FA] border-b gap-x-2'>
        <div className="text-md text-[#141111]">{title} {titleNode} </div>
        <div className="flex flex-grow justify-end">
          {
            onSearchChange && <SearchInput
                type="text"
                id='q'
                name="search"
                containerClass="mb-0"
                className="py-1 bg-[#F6F8FA] focus:bg-white w-[0px] focus:w-[300px]"
                onChange={onSearchChange}
              />
          }
        </div>
      </div>
      <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
        <thead className='text-xs text-gray-700 uppercase bg-[#F6F8FA] border-b'>
          <tr className=''>
            {columns?.map((column, index) =>(
              <th scope='col' className={cn('px-4 py-5 whitespace-nowrap', columnHeaderStyle)} key={column?.id || index}>
                  {column?.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          { isLoading && <tr><td colSpan={columns.length}><LoadingSpinner className="h-[200px] m-auto" /></td></tr> }
          { !isLoading && data?.length === 0 &&
            <tr className='bg-white'>
              <td colSpan={columns.length} className='p-4'>{emptyMessage}</td>
            </tr>
          }
          {
            !isLoading && data?.map((row, index) => (
              <tr key={index} className={cn(
                "bg-white hover:bg-gray-50",
                (totalPages > 0 || index < (data.length -1)) && "border-b" // Prevent bottom border on last row
                )}>
                { columns.map(function(col, colIndex) {
                  // Conditionally invoke the custom render function, or the given field
                  let cellValue = col.render ? col.render(row) : row[col.field];
                  return <td className="p-4" key={colIndex}>{cellValue}</td>
                })}
              </tr>))
          }
        </tbody>
      </table>
      { totalPages > 0 &&
        <nav className='flex items-center flex-column flex-wrap md:flex-row justify-between px-4 py-3'>
          <span className='flex text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 w-full md:inline md:w-auto'>
            Showing{" "}
            <span className='font-semibold text-gray-900 dark:text-white'>
              {start}-{end}
            </span>{" "}
            of{" "}
            <span className='font-semibold text-gray-900 dark:text-white'>
              {totalPages*offset}
            </span>
          </span>
          <ul className='inline-flex items-center -space-x-px rtl:space-x-reverse text-sm h-8 gap-x-2'>
            <ChevronLeft size={18} onClick={() => prevPage && prevPage()}
                            className={cn(
                              "text-gray-400 bg-gray-200 rounded-md p-0.5",
                              "cursor-pointer",
                              page <= 1 && "pointer-events-none opacity-40"
                              )} />

            <ChevronRight size={18} onClick={() => nextPage && nextPage()}
                            className={cn(
                              "text-gray-400 bg-gray-200 rounded-md p-0.5",
                              "cursor-pointer",
                              page >= totalPages && "pointer-events-none opacity-40"
                              )}/>
          </ul>
        </nav>
      }
    </div>
  )
}