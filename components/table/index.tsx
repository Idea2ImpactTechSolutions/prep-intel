import { cn } from '@/lib/utils';
import { Dictionary } from '@/types/dictionary'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { off } from 'process';
import React from 'react'

interface TableProps {
    title?:string;
    titleNode?:React.ReactNode
    columns:Dictionary[];
    children:React.ReactNode
    columnHeaderStyle?:string
    page?: number;
    totalPages?: number;
    nextPage?: ()=>void;
    prevPage?: ()=>void;
    offset: number;
}

const Table = ({title, columns, children, columnHeaderStyle, titleNode, page, totalPages, nextPage, prevPage, offset=10}:TableProps) => {

  const minusOne = page-1;
  const start = minusOne * offset + 1;
  const end = minusOne * offset + 10;

  return (
    <><div className='overflow-x-auto sm:rounded-lg'>
    <div className='border p-'>
      <div className='flex items-center p-4 bg-[#F6F8FA] border border-[#E6EBF0] gap-x-2'>
        <span className='text-[#141111] '>{title} {titleNode} </span>
      </div>
      <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
        <thead className='text-xs text-gray-700 uppercase bg-[#F6F8FA] border-b border-[#E6EBF0] '>
          <tr className=''>
            {columns?.map((column) =>(
              <th scope='col' className={cn('px-4 py-5 whitespace-nowrap', columnHeaderStyle)} key={column?.id}>
                  {column?.title}
              </th>
            ))}
          </tr>
        </thead>
        {children}
      </table>
      <nav className='flex items-center flex-column flex-wrap md:flex-row justify-between p-4'>
        <span className='text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto'>
          Showing{" "}
          <span className='font-semibold text-gray-900 dark:text-white'>
            {start}-{end}
          </span>{" "}
          of{" "}
          <span className='font-semibold text-gray-900 dark:text-white'>
            {totalPages*offset}
          </span>
        </span>
        <ul className='inline-flex -space-x-px rtl:space-x-reverse text-sm h-8 gap-x-2'>
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
                            )}/>
        </ul>
      </nav>
    </div>
  </div></>
  )
}

export default Table