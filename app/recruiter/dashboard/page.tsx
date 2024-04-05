"use client";
import React from "react";
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

export default function Page() {
const session = useSession()

  const schoolId = session?.data?.user?.schoolID
  const recruiterId = "57e2c5c8-a963-4713-a4d8-e832e79b48e4" 
  const acceptedConnection = ""
  const applicants = ""

  const recruiter = {
    name: 'Jay'
  };

  const RECRUITS_COLUMNS = [
    
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

  return (
    <div className="pi-container">
      <Header title="Recruiter" />
        <h1 className="text-xl lg:text-2xl font-bold mb-">Hello {recruiter.name}, welcome!</h1>
        <h2 className="text-[#8E8E8E]">Here are students that match your profile</h2>

        <div className='mt-5'>
          {
            !isLoading ?
          (<Table
          title="Schools"
          columns={RECRUITS_COLUMNS}
          >
            <TBODY>
              {
                users.map((user, index) => (
                  <TR key={index}>
                    <TD>{user.ACT}</TD>
                    <TD>{user.GPA}</TD>
                    <TD>{user.SAT}</TD>
                    <TD>{user['Major Interests']}</TD>
                    <TD>{user.Extracurriculars}</TD>
                    <TD>{user['Grad Year']}</TD>
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