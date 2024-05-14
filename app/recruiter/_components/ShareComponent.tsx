"use client";
import LoadingSpinner from "@/components/loading-spinner";
import Table from "@/components/table";
import { TBODY, TD, TR } from "@/components/table/table-element";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetRecruitsQuery } from "@/redux/services/recruiter/recruiterApi";
import { EyeIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Header from "./Header";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface SharedComponentProps {
  tableTitle?: string
  headerTitle:string
}

export default function SharedComponent({tableTitle, headerTitle}:SharedComponentProps) {
  const session:any = useSession()
  const pathName = usePathname()
  
  const [searchData, setSearchData] = useState<[]>([]);
  
  const isConnections = pathName === "/recruiter/connections"
  const schoolId = session?.data?.user?.schoolID
  const recruiterId = session?.data?.user?.roleId

  const acceptedConnection = ""
  const applicants = ""

  const RECRUITS_COLUMNS = [  
    {
      id: 1,
      title: <Checkbox/>,
    },
    {
      id: 2,
      title:"ACT",
    },
    {
      id: 3,
      title:"GPA",
    },
    {
      id: 4,
      title:"SAT",
    },
    {
      id: 5,
      title:"Major Interests",
    },
    {
      id: 6,
      title:"Extracurriculars",
    },
    {
      id: 7,
      title:"Grad Year",
    },
    {
      id: 8,
      title:"",
    },
  ]

  const CONNECTIONS_COLUMNS = [  
    {
      id: 1,
      title: <Checkbox/>,
    },
    {
      id: 2,
      title:"FIRST NAME",
    },
    {
      id: 3,
      title:"LAST NAME",
    },
    {
      id: 4,
      title:"ACT",
    },
    {
      id: 5,
      title:"GPA",
    },
    {
      id: 6,
      title:"SAT",
    },
    {
      id: 7,
      title:"Major Interests",
    },
    {
      id: 8,
      title:"Extracurriculars",
    },
    {
      id: 9,
      title:"Grad Year",
    },
    {
      id: 10,
      title:"",
    },
  ]

  const {data, isLoading}  = useGetRecruitsQuery({schoolId, recruiterId, acceptedConnection, applicants})

  useEffect(()=>{
    setSearchData(data?.data)
  },[data])

  return (
    <div className="pi-container">
      <Header title={headerTitle} recruits={data?.data} setSearchData={(data)=>setSearchData(data)} data={searchData}/>
      <h1 className="text-xl lg:text-2xl font-bold mb-">Hello {session?.data?.user?.firstName}, welcome!</h1>
      <h2 className="text-[#8E8E8E]">Here are students that match your profile</h2>

      <div className='mt-5'>
        {
          !isLoading ?
        (<Table
        title={tableTitle}
        columns={!isConnections? RECRUITS_COLUMNS: CONNECTIONS_COLUMNS}
        >
          <TBODY>
            {
              searchData?.map((recruits:any, index) => (
                <TR key={index}>
                  <TD><Checkbox/></TD>
                  {isConnections && Object.keys(recruits?.student?.user).length !== 0 && (
                    <>
                      <TD>{recruits?.student?.user?.first_name}</TD>
                      <TD>{recruits?.student?.user?.last_name}</TD>
                    </>
                  )}
                  <TD>{recruits?.student?.act_score}</TD>
                  <TD>3.7</TD>
                  <TD>{recruits?.student?.sat_score}</TD>
                  <TD>Business and Sports</TD>
                  <TD>Student Government</TD>
                  <TD>{recruits?.student?.graduation_year}</TD>
                  <TD>
                    <Button variant="outlinePrimary" className="text-[#A81D28] gap-x-1 text-sm h-7" asChild>
                      <Link href={`/recruiter/${recruiterId}/student/${recruits?.student_id}/student-profile`}>
                        <EyeIcon size={16}/> <span>View</span>
                      </Link>
                    </Button>
                  </TD>
                </TR>))
            }
          </TBODY>
        </Table>): <LoadingSpinner/>
        // (<div>No data available</div>)
        }
      </div>
    </div>
  );
}