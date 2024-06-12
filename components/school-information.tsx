import SingleStat from '@/components/single-stat'
import { Button } from '@/components/ui/button'
import { useConnectWithRecruiterMutation, useGetSchoolPrepScoresQuery } from '@/redux/services/student/studentApi'
import { Dictionary } from '@/types/dictionary'
import { Facebook, Instagram, Twitter } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { toast } from 'sonner'
import { FaSchool } from "react-icons/fa6";
import { cacheBust } from '@/app/config/helpers'
import LoadingSpinner from './loading-spinner'

interface SchoolInformationProps {
    schoolData: Dictionary;
}

export default function SchoolInformation({ schoolData }: SchoolInformationProps) {
    const session = useSession();
    const studentId = session.data?.user?.roleId;
    const userRole = session.data?.user?.role;
    const schoolId = schoolData?.id;

    const [connectWithRecruiter, {isLoading}] = useConnectWithRecruiterMutation();
    const {data: scoreResponse, isLoading: isScoreLoading } = useGetSchoolPrepScoresQuery(
      {studentId, schoolId}, {
        skip: !studentId || !schoolId
      }
    );

    const handleConnectWithRecruiter = async()=>{
       connectWithRecruiter({school_id:schoolData?.id, studentId})
       .unwrap().then((payload)=>{
           if(payload?.status === 200){
               toast.success(payload?.message)
           }
       }).catch((err)=>{
            toast.error(err?.message)
       })
    }

    function profileImage(schoolData) {
      return schoolData?.assets?.filter((f) => f.category === 'school-profile-image')?.[0]?.location;
    }

    function bannerImage(schoolData) {
      return schoolData?.assets?.filter((f) => f.category === 'school-banner-image')?.[0]?.location;
    }

    return (
        <section>
            <div className="rounded-lg shadow-md">
                <div className="relative bg-gray-200 h-32 rounded-ss-lg rounded-se-lg lg:h-44 xl:h-52"
                  style={{backgroundImage: `url("${cacheBust(bannerImage(schoolData))}")`}}>
                    <div className="absolute left-8 -bottom-10 w-24 h-24 bg-white rounded-full border grid place-content-center md:w-28 md:h-28 md:-bottom-12 lg:w-32 lg:h-32">

                    {profileImage(schoolData) ? (
                      <Image src={cacheBust(profileImage(schoolData))}
                        alt="logo"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-gray-500 text-6xl">
                        <FaSchool />
                      </div>
                    )}
                    </div>
                </div>
                <div>
                    <div className="bg-white rounded-lg p-4 pt-16 px-10">
                        <span className="text-gray-500"> STATE UNIVERSITY </span>
                        <h2 className="mt-1.5 font-medium md:text-lg lg:text-xl xl:text-2xl">{schoolData?.name}</h2>
                        <div className="mt-2 my-1 mb-6 text-gray-500 flex">
                            <span className="border-r-2 border-gray-400 pr-2 flex gap-2 capitalize">
                                <Image
                                    src={"/images/logo/usa-icon.png"}
                                    alt="logo"
                                    width={20}
                                    height={20}
                                /> {schoolData?.school_address?.state || ""}</span>
                            <span className="border-r-2 border-gray-400 pr-2 pl-2"> {`${schoolData?.school_address?.city || ""}  ${schoolData?.school_address?.postal || ""}`} </span>
                            <span className="pl-2"> { schoolData?.school_contacts?.[0]?.phone} </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-8 flex flex-col gap-4 lg:flex-row">
                <div className="xl:w-[calc(100vw_-_30rem)]">
                    <div>
                        <h2 className="text-[#030712] font-bold text-sm md:text-lg">School Overview</h2>
                        <div className="text-xs text-[#312B2B] md:text-sm lg:w-4/5">
                            {schoolData?.intro_paragraph}</div>
                    </div>
                    <div className="mt-4">
                        <h2 className="text-[#030712] font-bold text-sm md:text-lg">Contact Information</h2>
                        <div className="mt-1 overflow-auto xl:w-[90%]">
                            <table className="whitespace-nowrap border-separate border-spacing-y-2" style={{ boxShadow: "none", margin: "0" }}>
                                <tbody>
                                    <tr className="bg-transparent">
                                        <td className="text-[#030712] text-sm font-bold border-b-transparent p-0">Physical Address:</td>
                                        <td className="border-b-transparent p-0 pl-8">{schoolData?.school_address?.street_address_1}</td>
                                    </tr>
                                    {
                                        schoolData?.school_contacts?.map(({ contact_type, email, id, phone }) => (
                                            <tr key={id} className="bg-transparent">
                                                <td className="text-[#030712] text-sm font-bold border-b-transparent p-0 capitalize">{contact_type}:</td>
                                                <td className="border-b-transparent p-0 pl-8">Phone: {phone}</td>
                                                <td className="border-b-transparent p-0 pl-8">Email: {email}</td>
                                            </tr>
                                        ))
                                    }
                                    <tr className="bg-transparent">
                                        <td className="text-[#030712] text-sm font-bold border-b-transparent p-0">Social Media Accounts:</td>
                                        <td className="border-b-transparent p-0 pl-8">
                                            <div className="flex gap-4">
                                                <Link href={
                                                    schoolData?.school_social_medias?.filter((f) => f.social_media === 'facebook')[0]?.url || '#'
                                                } target="_blank" className="w-6 h-6 border border-primary rounded-full grid place-content-center text-primary"><Facebook width={15} height={15} /></Link>
                                                <Link href={
                                                    schoolData?.school_social_medias?.filter((f) => f.social_media === 'twitter')[0]?.url || '#'
                                                } target="_blank" className="w-6 h-6 border border-primary rounded-full grid place-content-center text-primary"><Instagram width={15} height={15} /></Link>
                                                <Link href={
                                                    schoolData?.school_social_medias?.filter((f) => f.social_media === 'instagram')[0]?.url || '#'
                                                } target="_blank" className="w-6 h-6 border border-primary rounded-full grid place-content-center text-primary"><Twitter width={15} height={15} /></Link>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="lg:w-4/5">
                        <h2 className="mt-2 text-[#030712] font-bold text-sm md:text-lg">Admissions Information</h2>
                        <div className="mt-2 grid grid-cols-2 gap-4 md:grid-cols-3">
                            <SingleStat title="ACT Required" value={schoolData?.min_act_score || 'NA'} />
                            <SingleStat title="SAT Required" value={schoolData?.min_sat_score || 'NA'} />
                            <SingleStat title="High School GPA Required" value={schoolData?.gpa_requirement || "NA"} />
                            <SingleStat title="In-State Tuition" value={`$${schoolData?.in_state_tuition}` || 'NA'} />
                            <SingleStat title="Out-of-State Tuition" value={`$${schoolData?.out_state_tuition}` || 'NA'} />
                            <SingleStat title="Fees" value={`$${schoolData?.fees_per_semester}` || 'NA'} />
                        </div>
                    </div>
                </div>
                <div className="bg-gray-200 p-4 lg:w-[60rem] xl:w-[30rem] rounded-xl">
                    <div className="w-full flex gap-2 p-4 border border-dashed border-[#333] mb-10 rounded-lg bg-white">
                      { isScoreLoading ?  <LoadingSpinner className="h-200 w-full" />
                        :  (scoreResponse && <>
                        <SingleStat title="Prep Score" value={scoreResponse?.data.prepScore} />
                        </>)
                      }
                      </div>
                    {
                        userRole === "student"?
                            <>
                                <Button variant="orange" size="lg" className="w-full" onClick={handleConnectWithRecruiter} loading={isLoading} loadingText='Connecting...' disabled={isLoading}>
                                    Connect with Recruiter
                                </Button>
                                <Button variant="outline" size="lg" className="w-full mt-5 font-bold bg-transparent" asChild>
                                    <Link href={`https://${schoolData?.application_url}`} target="_blank">Apply to the School</Link>
                                </Button>
                            </>: null
                    }
                </div>
            </div>
        </section>
    )
}
