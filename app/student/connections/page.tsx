"use client"
import LoadingSpinner from "@/components/loading-spinner";
import SectionContainer from "@/components/section-container";
import SingleRecruiterCard from "@/components/single-recruiter-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLazyGetStudentRecruiterConnectionsQuery } from "@/redux/services/student/studentApi";
import { useSession } from "next-auth/react";
import { Space_Grotesk } from "next/font/google";
import { useEffect, useState } from "react";
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });


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
    <section className="p-5 overflow-y-auto pb-32 h-[calc(100vh_-_5rem)]">
      <SectionContainer
        title="Recruiter Connections"
        subTitle="Discover your ideal university match here."
        titleClass={cn(
          spaceGrotesk.className,
          "mb-0"
        )}
      >
        <section className="pt-4">
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
      </SectionContainer>
    </section>
  )
}