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
import { buildAssetUrl, cacheBust } from '@/app/config/helpers'
import LoadingSpinner from './loading-spinner'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import "react-circular-progressbar/dist/styles.css";
import { cn } from "@/lib/utils";

interface SchoolInformationProps {
    schoolData: Dictionary;
}

export default function SchoolInformation({ schoolData }: SchoolInformationProps) {
    const session = useSession();
    const studentId = session.data?.user?.roleId;
    const userRole = session.data?.user?.role;
    const schoolId = schoolData?.id;
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primaryCC');
    const [connectWithRecruiter, {isLoading}] = useConnectWithRecruiterMutation();
    const {data: scoreResponse, isLoading: isScoreLoading } = useGetSchoolPrepScoresQuery(
      {studentId, schoolId}, {
        skip: !studentId || !schoolId
      }
    );

    const scoreMax = 5;
    const prepScore = parseFloat(scoreResponse?.data?.prepScore || "0");
    const prepScorePercent = prepScore/scoreMax * 100;

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
      return buildAssetUrl(schoolData?.assets?.find(f => f.category === 'school-profile-image')?.id);
    }

    function bannerImage(schoolData) {
      return buildAssetUrl(schoolData?.assets?.find(f => f.category === 'school-banner-image')?.id);
    }

    function formatNumber(num: number, precision: number = 1): number {
      // Use toFixed to format the number to the desired precision
      const formatted = num.toFixed(precision);
      // Convert the string back to a number to remove trailing zeros
      return parseFloat(formatted);
    }

    const socialMediaLogos = {
      facebook: <Facebook width={15} height={15} />,
      twitter: <Instagram width={15} height={15} />,
      instagram: <Twitter width={15} height={15} />,
    };

    return (
        <section>
            <div className="rounded-lg shadow-md shadow-gray-100">
                <div className="relative bg-gray-200 h-32 rounded-ss-lg rounded-se-lg lg:h-44 xl:h-52"
                  style={{backgroundImage: `url("${cacheBust(bannerImage(schoolData))}")`}}>
                    <div className="absolute left-8 -bottom-10 w-24 h-24 bg-white rounded-full border grid place-content-center md:w-28 md:h-28 md:-bottom-12 lg:w-32 lg:h-32">

                    {profileImage(schoolData) ? (
                      <Image src={cacheBust(profileImage(schoolData))}
                        className="rounded-full object-cover w-28 h-28"
                        alt="logo"
                        width={32}
                        height={32}
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
            <div className="mt-4 flex flex-col gap-4 lg:flex-row">
                <div className="w-full bg-white rounded-xl p-6 pt-4">
                    <div >
                        <h2 className={cn(
                          "text-[#030712] font-bold text-sm md:text-lg",
                          !schoolData?.intro_paragraph && "hidden")}
                          >Overview</h2>
                        <div className="text-xs text-[#312B2B] md:text-sm lg:w-4/5">
                            {schoolData?.intro_paragraph}</div>
                    </div>
                    <div className="mt-4">
                        <h2 className="text-[#030712] font-bold text-sm md:text-lg">Contact</h2>
                        <div className="mt-1 overflow-auto xl:w-[90%] px-4 py-2">

                            <div>{schoolData?.school_address?.street_address_1}</div>
                            <div>{schoolData?.school_address?.street_address_2}</div>
                            <div>{schoolData?.school_address?.city}, {schoolData?.school_address?.state} {schoolData?.school_address?.postal}</div>
                              {
                                schoolData?.school_contacts?.map(({ contact_type, email, id, phone }) => (
                                  <div key={id}>
                                      <div>{contact_type}</div>
                                      <div>{phone}</div>
                                      <div>{email}</div>
                                  </div>))
                              }
                              <div className="flex gap-4 mt-2">
                                {
                                  // Loop over defined social media accounts, outputting a link for each if the URL is present
                                  schoolData?.school_social_medias?.map((info: any) => {
                                    return info?.url ? (
                                      <Link key={info.id} href={info.url} target="_blank" className="w-6 h-6 border border-primary rounded-full grid place-content-center text-primary">
                                        { socialMediaLogos[info.social_media] }
                                      </Link>)
                                      : null;
                                    })
                                }
                              </div>
                        </div>
                    </div>
                    <div className="lg:w-4/5 mt-6">
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
                <div className="border-gray bg-white p-4 md:w-[25rem] rounded-xl">
                    <div className="w-full flex gap-2 border mb-8 p-10 rounded-lg bg-white">
                      { isScoreLoading ?  <LoadingSpinner className="h-200 w-full" />
                        :  (scoreResponse && <>
                            <CircularProgressbar
                              className="h-[120px] font-bold"
                              text={`${formatNumber(prepScore, 1)}`}
                              strokeWidth={14}
                              value={prepScorePercent}
                              styles={ buildStyles({
                                pathColor: `${primaryColor}`,
                                textColor: `${primaryColor}`,
                                trailColor: '#D6D6D6',
                                textSize: '20px',
                                pathTransitionDuration: 3.15,
                              })}
                              />

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
