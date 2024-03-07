"use client"
import PageTitleContainer from "@/components/page-title";
import { useState } from "react";
import AcademicInformationForm from "./_components/create-profile-form/academic-information";
import BasicInformationForm from "./_components/create-profile-form/basic-information";
import CampusInformation from "./_components/create-profile-form/campus-information";
import ExtraCurricularsForm from "./_components/create-profile-form/extra-curriculars-information";
import NewsFeedEventForm from "./_components/create-profile-form/newsfeed-event-information";
import ProfileCreationProgress from "./_components/profile-creation-progress";
import EmptyStateContainer from "@/components/empty-state";
import PreviewSchoolInformation from "./_components/create-profile-form/preview-school-information";
import { Button } from "@/components/ui/button";
import BottomBar from "../shared/bottom-bar";
import { CompletionPanel } from "@/components/completion-panel";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Facebook, Instagram, Twitter } from "lucide-react";
import SingleStat from "@/components/single-stat";
import Link from "next/link";


type PROGRESS_TYPE = 'BASIC_INFORMATION' | 'ACADEMIC_INFORMATION' | 'CAMPUS_INFORMATION' | 'EXTRA_CURRICULAR_INFORMATION' | 'NEWS_FEED_EVENT' | 'PREVIEW_INFORMATION'


export default function MySchool() {
    const [currentProgress, setCurrentProgress] = useState<PROGRESS_TYPE>('BASIC_INFORMATION')

    const router = useRouter()

    return (
        <>
            {/* <section className="hidden">
                <PageTitleContainer
                    title={`${currentProgress !== 'PREVIEW_INFORMATION' ? "Create Your School’s Profile" : "Preview of Your School’s Profile"}`}
                    titleClass="text-sm"
                    rightContent={
                        <ProfileCreationProgress
                            progressValue={currentProgress === 'PREVIEW_INFORMATION' ? 100 : 0}
                            step={currentProgress === 'PREVIEW_INFORMATION' ? 5 : 1}
                        />
                    }
                />
                <section className="">

                   {currentProgress === 'BASIC_INFORMATION' && <BasicInformationForm/>}
                   {currentProgress === 'ACADEMIC_INFORMATION' && <AcademicInformationForm/>}
                   {currentProgress === 'CAMPUS_INFORMATION' && <CampusInformation/>}
                   {currentProgress === 'EXTRA_CURRICULAR_INFORMATION' && <ExtraCurricularsForm/>}
                   {currentProgress === 'NEWS_FEED_EVENT' && <NewsFeedEventForm/>}
                   {currentProgress === 'PREVIEW_INFORMATION' && <PreviewSchoolInformation/>}

                </section>
            </section> */}
            <div className="">
                <div className=" flex flex-col overflow-y-auto">
                    <div className="container mx-auto p-4 pt-6 px-0 md:px-11 ">
                        <CompletionPanel percentCompleted={100} title={"5/5"}></CompletionPanel>
                        <h1 className="p-4 text-xl font-bold text-gray-800 mb-6 md:p-0">
                            Preview of Your School’s Profile
                        </h1>
                    </div>
                    <div className="border-t"> </div>
                    <PageTitleContainer
                        title={
                            <>
                                University of Saturn
                                <div className="flex flex-col text-xs font-normal">
                                    <span>“You’re going to love it out here”</span>
                                    <span className="italic">Founded 2046</span>
                                </div>
                            </>
                        }
                        titleClass="text-sm"
                        className="md:px-16"
                        rightContent={
                            <Button
                                variant={"outline"}
                                className="text-xs h-8 rounded-sm px-3"
                                onClick={() => router.push('/school/school-profile')}
                            >
                                Edit School
                            </Button>
                        }
                    />
                    <section className="p-4 pt-6 pb-16 md:px-16">
                        {/* <div className="grid grid-cols-1 gap-4 lg:flex">
                            <div className="bg-gray-100 p-4 w-32 h-32 flex justify-center md:w-40 md:h-40 lg:w-[40%] lg:h-64">
                                <Image src="/images/logo/logo-saturn.png"
                                    alt="logo"
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                                />
                            </div>
                            <div className="grid grid-cols-4 gap-4 lg:w-3/4">
                                {
                                    Array.from({ length: 8 }, function (_, idx) {
                                        return (
                                            <div className="bg-gray-100 flex justify-center p-4 h-16 md:h-20 lg:h-32">
                                                <Image src="/images/logo/logo.png"
                                                    alt="logo"
                                                    width={0}
                                                    height={0}
                                                    sizes="100vw"
                                                    style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                                                />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div> */}
                        <div className="rounded-lg shadow-md">
                            <div className="relative bg-gray-200 h-32 rounded-ss-lg rounded-se-lg lg:h-44 xl:h-52">
                                <div className="absolute left-8 -bottom-10 w-24 h-24 bg-white rounded-full border grid place-content-center md:w-28 md:h-28 md:-bottom-12 lg:w-32 lg:h-32">
                                    <Image src="/images/logo/logo-saturn.png"
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
                                <h2 className="mt-1.5 font-medium md:text-lg lg:text-xl xl:text-2xl">University of Georgia</h2>
                                <div className="mt-2 my-1 mb-6 text-gray-500 flex">
                                    <span className="border-r-2 border-gray-400 pr-2 flex gap-2">
                                        <Image
                                            src="/images/logo/usa-icon.png"
                                            alt="logo"
                                            width={20}
                                            height={20}
                                        /> Gorgia</span> 
                                    <span className="border-r-2 border-gray-400 pr-2 pl-2"> Athens, GA 3060 </span> 
                                    <span className="pl-2"> (706) 542-3000 </span>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className="mt-8 flex flex-col gap-4 lg:flex-row">
                            <div>
                                <div>
                                    <h2 className="text-[#030712] font-bold text-sm md:text-lg">School Overview</h2>
                                    <div className="text-xs text-[#312B2B] md:text-sm lg:w-4/5">Welcome to the University of Saturn, a pioneering institution nestled amidst the ethereal rings of the sixth planet from the Sun. Renowned for its celestial engineering programs and interstellar humanities courses, our university offers a truly unique academic experience, blending cutting-edge research with unparalleled cosmic views. Here, students embark on an educational journey that transcends the bounds of Earthly knowledge, cultivating intellects ready to shape the galaxies of tomorrow.</div>
                                </div>
                                <div className="mt-4">
                                    <h2 className="text-[#030712] font-bold text-sm md:text-lg">Contact Information</h2>
                                    <div className="mt-1 overflow-auto xl:w-3/4">
                                        <table className="whitespace-nowrap border-separate border-spacing-y-2" style={{ boxShadow: "none", margin: "0" }}>
                                            {/* <th className="bg-transparent">
                                            </th> */}
                                            <tbody>
                                                <tr className="bg-transparent">
                                                    <td className="text-[#030712] text-sm font-bold border-b-transparent p-0">Physical Address:</td>
                                                    <td className="border-b-transparent p-0 pl-8">10583 Saturn Pkwy, Saturn, Space 20499</td>
                                                </tr>
                                                <tr className="bg-transparent">
                                                    <td className="text-[#030712] text-sm font-bold border-b-transparent p-0">Admissions Office:</td>
                                                    <td className="border-b-transparent p-0 pl-8">Phone: (382) 821-3873</td>
                                                    <td className="border-b-transparent p-0 pl-8">Email: admissions@saturn.edu</td>
                                                </tr>
                                                <tr className="bg-transparent">
                                                    <td className="text-[#030712] text-sm font-bold border-b-transparent p-0">Financial Aid Office:</td>
                                                    <td className="border-b-transparent p-0 pl-8">Phone: (382) 821-3847</td>
                                                    <td className="border-b-transparent p-0 pl-8">Email: financialaid@saturn.edu</td>
                                                </tr>
                                                <tr className="bg-transparent">
                                                    <td className="text-[#030712] text-sm font-bold border-b-transparent p-0">Campus Life Office:</td>
                                                    <td className="border-b-transparent p-0 pl-8">Phone: (382) 821-3894</td>
                                                    <td className="border-b-transparent p-0 pl-8">Email: campuslife@saturn.edu</td>
                                                </tr>
                                                <tr className="bg-transparent">
                                                    <td className="text-[#030712] text-sm font-bold border-b-transparent p-0">Social Media Accounts:</td>
                                                    <td className="border-b-transparent p-0 pl-8">
                                                        <div className="flex gap-4">
                                                            <Link href="#" className="w-6 h-6 border border-primary rounded-full grid place-content-center text-primary"><Facebook width={15} height={15} /></Link>
                                                            <Link href="#" className="w-6 h-6 border border-primary rounded-full grid place-content-center text-primary"><Instagram width={15} height={15}/></Link>
                                                            <Link href="#" className="w-6 h-6 border border-primary rounded-full grid place-content-center text-primary"><Twitter width={15} height={15} /></Link>
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
                                        <SingleStat title="ACT Required" value="21"/>
                                        <SingleStat title="SAT Required" value="1050"/>
                                        <SingleStat title="Diploma/GED Required" value="Yes"/>
                                        <SingleStat title="In-State Tuition" value="$7,381.46"/>
                                        <SingleStat title="Out-of-State Tuition" value="$24,291.27"/>
                                        <SingleStat title="Fees" value="$3,272"/>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-200 p-4 lg:w-[60rem]">
                                
                            </div>
                        </div>
                    </section>
                </div>
                <BottomBar
                    onBack={() => null}
                    onSaveForLater={() => null}
                    isBackDisabled={true}
                    isSubmitting={false}
                />
            </div>
        </>
    )
}
