import SingleStat from '@/components/single-stat'
import { Dictionary } from '@/types/dictionary'
import { Facebook, Instagram, Twitter } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface SchoolInformationProps {
    schoolData: Dictionary
}

export default function SchoolInformation({ schoolData }: SchoolInformationProps) {
  function cachedBust(url) {
    if (!url) {
      return '';
    }
    return  `${url}?v=${(new Date()).getTime()}`;
}
    return (
        <section>
            <div className="rounded-lg shadow-md">
                <div className="relative bg-gray-200 h-32 rounded-ss-lg rounded-se-lg lg:h-44 xl:h-52"
                  style={{backgroundImage: `url("${cachedBust( schoolData?.assets?.filter((f) => f.category === 'school-banner-image')?.[0]?.location)}")`}}>
                    <div className="absolute left-8 -bottom-10 w-24 h-24 bg-white rounded-full border grid place-content-center md:w-28 md:h-28 md:-bottom-12 lg:w-32 lg:h-32">
                        <Image src={cachedBust(schoolData?.assets?.filter((f) => f.category === 'school-profile-image')?.[0]?.location)}
                            alt="logo"
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                        />
                    </div>
                </div>
                <div>
                    <div className="bg-white rounded-lg p-4 pt-16 px-10">
                        <span className="text-gray-500"> STATE UNIVERSITY </span>
                        <h2 className="mt-1.5 font-medium md:text-lg lg:text-xl xl:text-2xl">{schoolData?.name || "University of Georgia"}</h2>
                        <div className="mt-2 my-1 mb-6 text-gray-500 flex">
                            <span className="border-r-2 border-gray-400 pr-2 flex gap-2 capitalize">
                                <Image
                                    src={"/images/logo/usa-icon.png"}
                                    alt="logo"
                                    width={20}
                                    height={20}
                                /> {schoolData?.school_address?.state || "Gorgia"}</span>
                            <span className="border-r-2 border-gray-400 pr-2 pl-2"> {`${schoolData?.school_address?.city} ${schoolData?.school_address?.postal}` || 'Athens, GA 3060'} </span>
                            <span className="pl-2"> { schoolData?.school_contacts?.[0]?.phone || "(706) 542-3000"} </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-8 flex flex-col gap-4 lg:flex-row">
                <div className="xl:w-[calc(100vw_-_30rem)]">
                    <div>
                        <h2 className="text-[#030712] font-bold text-sm md:text-lg">School Overview</h2>
                        <div className="text-xs text-[#312B2B] md:text-sm lg:w-4/5">
                            {schoolData?.intro_paragraph || "Welcome to the University of ABC"}</div>
                    </div>
                    <div className="mt-4">
                        <h2 className="text-[#030712] font-bold text-sm md:text-lg">Contact Information</h2>
                        <div className="mt-1 overflow-auto xl:w-[90%]">
                            <table className="whitespace-nowrap border-separate border-spacing-y-2" style={{ boxShadow: "none", margin: "0" }}>
                                <tbody>
                                    <tr className="bg-transparent">
                                        <td className="text-[#030712] text-sm font-bold border-b-transparent p-0">Physical Address:</td>
                                        <td className="border-b-transparent p-0 pl-8">{schoolData?.school_address?.street_address_1 || "10583 Saturn Pkwy, Saturn, Space 20499"}</td>
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
                <div className="bg-gray-200 p-4 lg:w-[60rem] xl:w-[30rem]">

                </div>
            </div>
        </section>
    )
}
