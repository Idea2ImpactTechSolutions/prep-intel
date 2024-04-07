import { Dictionary } from '@/types/dictionary'
import { ChevronLeft, ChevronRight, CircleAlert } from 'lucide-react'
import React from 'react'

interface TableProps {
    title:string;
    columns:Dictionary[];
    children:React.ReactNode
}

const Table = ({title, columns, children}:TableProps) => {
  return (
    <><div className='overflow-x-auto sm:rounded-lg'>
            
    <div className='border p-'>
      <div className='flex items-center p-4 bg-[#F6F8FA] border border-[#E6EBF0] gap-x-2'>
        <span className='text-[#141111] '>{title}</span>
        <span>
          <CircleAlert width={17} height={17} />
        </span>
      </div>
      <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
        <thead className='text-xs text-gray-700 uppercase bg-[#F6F8FA] border-b border-[#E6EBF0] '>
          <tr className=''>
            {columns?.map((column, key) =>(
                <th scope='col' className='px-4 py-5 whitespace-nowrap' key={key}>
                    {column?.title}
                </th>
            ))}
            {/* <th scope='col' className='px-4 py-5 whitespace-nowrap'>
              SCHOOL NAME
            </th>
            <th scope='col' className='px-4 py-5 whitespace-nowrap '>
              LOCATION
            </th>
            <th scope='col' className='px-4 py-5 whitespace-nowrap'>
              APPLIED
            </th>
            <th scope='col' className='px-4 py-5 whitespace-nowrap'>
              STATUS
            </th>
            <th scope='col' className='px-4 py-5 whitespace-nowrap'> 
              RECRUITER
            </th> */}
          </tr>
        </thead>
        
            {children}
          {/* <tr className='bg-white border-b border-[#E6EBF0] hover:bg-gray-50'>
            <td className='w-4 p-4'>
              <div className='flex items-center  gap-x-2'>
                <input
                  id='checkbox-table-search-1'
                  type='checkbox'
                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                />
                <label
                  htmlFor='checkbox-table-search-1'
                  className='sr-only'
                >
                  checkbox
                </label>
                <span>99%</span>
              </div>
            </td>
            <th
              scope='row'
              className='px-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
            >
              Apple MacBook Pro 17"
            </th>
            <td className='px-4 py-4'>Silver</td>
            <td className='px-4 py-4'>Laptop</td>
            <td className='px-4 py-4'>
              <StatusLabel status='waitlisted' />
            </td>
            <td className='px-4 py-4'>
              <Button variant='outlinePrimary' className='h-7'>
                <span className='sr-only'>connect</span>
                <span className='text-[#A81D28]'>Connect</span>
              </Button>
            </td>
          </tr> 
          <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'>
            <td className='w-4 p-4'>
              <div className='flex items-center gap-x-2'>
                <input
                  id='checkbox-table-search-2'
                  type='checkbox'
                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                />
                <label
                  htmlFor='checkbox-table-search-2'
                  className='sr-only'
                >
                  checkbox
                </label>
                <span>99%</span>
              </div>
            </td>
            <th
              scope='row'
              className='px-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
            >
              Microsoft Surface Pro
            </th>
            <td className='px-4 py-4'>White</td>
            <td className='px-4 py-4'>Laptop PC</td>
            <td className='px-4 py-4'>$1999</td>
            <td className='px-4 py-4'>
              <ConnectedLabel />
            </td>
          </tr> */}
      </table>
      <nav className='flex items-center flex-column flex-wrap md:flex-row justify-between p-4'>
        <span className='text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto'>
          Showing{" "}
          <span className='font-semibold text-gray-900 dark:text-white'>
            1-10
          </span>{" "}
          of{" "}
          <span className='font-semibold text-gray-900 dark:text-white'>
            1000
          </span>
        </span>
        <ul className='inline-flex -space-x-px rtl:space-x-reverse text-sm h-8 gap-x-2'>
            <ChevronLeft className="text-gray-400 bg-gray-200 rounded-md p-0.5" size={18}/>
         
          <ChevronRight className="text-gray-400 bg-gray-200 rounded-md p-0.5" size={18}/>
        </ul>
      </nav>
    </div>
  </div></>
  )
}

export default Table