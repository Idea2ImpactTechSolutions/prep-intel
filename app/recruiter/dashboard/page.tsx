"use client";
import React, { useEffect, useState } from "react";
import { RecruiterDashboardUsers as users }  from "../../ui/mock-data/Users"
import StatusLabel from "@/components/status-label";
import ConnectedLabel from "@/components/connected-label";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CircleAlert, EyeIcon } from "lucide-react";
import Table from "@/components/table";
import { TBODY, TR , TD} from "@/components/table/table-element";
import { useSession } from "next-auth/react";
import { useGetRecruitsQuery } from "@/redux/services/recruiter/recruiterApi";
import LoadingSpinner from "@/components/loading-spinner";
import Header from "./_components/Header";
import CustomCheckbox from "@/components/custom-checkbox";
import { Checkbox } from "@/components/ui/checkbox";

export default function Page() {
  const session = useSession()

  const [searchData, setSearchData] = useState([])

  const schoolId = session?.data?.user?.schoolID
  // const recruiterId = session?.data?.user?.roleId
  const recruiterId = "57e2c5c8-a963-4713-a4d8-e832e79b48e4"

  const acceptedConnection = ""
  const applicants = ""

  const recruiter = {
    name: 'Jay'
  };

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
      id: 4,
      title:"Major Interests",
    },
    {
      id: 5,
      title:"Extracurriculars",
    },
    {
      id: 6,
      title:"Grad Year",
    },
    {
      id: 11,
      title:"",
    },
  ]

  const {data, isLoading}  = useGetRecruitsQuery({schoolId, recruiterId, acceptedConnection, applicants})

  useEffect(()=>{
    setSearchData(data?.data)
  },[data])

  return (
    <div className="pi-container">
      <Header title="Recruiter" recruites={data?.data} setSearchData={(data)=>setSearchData(data)} data={searchData}/>
      <h1 className="text-xl lg:text-2xl font-bold mb-">Hello {recruiter?.name}, welcome!</h1>
      <h2 className="text-[#8E8E8E]">Here are students that match your profile</h2>

      <div className='mt-5'>
        {
          !isLoading ?
        (<Table
        title="Recruits"
        columns={RECRUITS_COLUMNS}
        >
          <TBODY>
            {
              searchData?.map((recruits:any, index) => (
                <TR key={index}>
                  <TD><Checkbox/></TD>
                  <TD>{recruits?.student?.act_score}</TD>
                  <TD>3.7</TD>
                  <TD>{recruits?.student?.sat_score}</TD>
                  <TD>Business and Sports</TD>
                  <TD>Student Government</TD>
                  <TD>{recruits?.student?.graduation_year}</TD>
                  <TD><Button variant="outlinePrimary" className="text-[#A81D28] gap-x-1 text-sm h-7"><EyeIcon size={16}/> <span>View</span></Button></TD>
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