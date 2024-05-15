"use client"
import LoadingSpinner from "@/components/loading-spinner";
import SingleRecruiterCard from "@/components/single-recruiter-card";
import { Button } from "@/components/ui/button";
import { useLazyGetStudentRecruiterConnectionsQuery } from "@/redux/services/student/studentApi";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import PageTitleContainer from "@/components/page-title";

export default function StudentConnection() {
  const [availableConnections, setAvailableConnections] = useState([])

  const [getStudentRecruiterConnections, { isLoading, isFetching }] = useLazyGetStudentRecruiterConnectionsQuery()

  const { data } = useSession()
  const studentId = data?.user?.roleId

  const handleGetStudentRecruiterConnections = async (studentId) => {
    getStudentRecruiterConnections(studentId)
      .unwrap()
      .then((payload) => {
        setAvailableConnections(payload.data)
      })
  }

  useEffect(() => {
    if (studentId) {
      handleGetStudentRecruiterConnections(studentId)
    }
  }, [studentId])

  if (isLoading || isFetching) {
    return <LoadingSpinner />
  }

  return (
    <>
    <PageTitleContainer
        title={
            <>
              <span>Recruiter Connections</span>
              <div className="flex flex-col text-xs font-normal">
                  <span className="capitalize">Discover your ideal university match here.</span>
              </div>
            </>
        }
        titleClass="text-sm"
    />
        <section className="pi-container">
          {
            availableConnections?.length > 0 ?
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
                {
                  availableConnections?.map(({ recruiter, school }: { recruiter: any, school: any }, idx) => (
                    <SingleRecruiterCard
                      key={idx}
                      imgUrl=""
                      name={`${recruiter?.user?.first_name} ${recruiter?.user?.last_name}`}
                      school_name={school?.name}
                      school_state={school?.school_address?.state}
                      school_email=""
                      phone={recruiter?.user?.phone}
                      email={recruiter?.user?.email}
                    />
                  ))
                }
              </div> :
              <section className='h-[calc(100vh_-_20rem)] bg-[#F0F4F7] rounded-[6px] flex justify-center items-center text-center'>
                <div>
                  <p className="pb-4"> No Connection Found</p>
                  <Button
                    className="font-light h-8 text-xs px-6"
                    onClick={() => window.location.reload()}
                  >Refresh</Button>
                </div>
              </section>
          }
        </section>
      </>
  )
}