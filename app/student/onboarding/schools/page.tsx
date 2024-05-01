"use client"
import OnboardingFooter from "@/app/student/_components/onboarding-footer";
import CustomCheckbox from "@/components/custom-checkbox";
import SectionContainer from "@/components/section-container";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { POPULAR_UNIVERSITIES, UNIVERSITIES_NEAR_BY } from "../data";
import OnboardingTabs from "../../_components/onboarding-tabs";
import OnboardingTitle from "../../_components/onboarding-title";
import { useLazyGetSchoolsQuery } from "@/redux/services/admin/adminApi";
import { cn } from "@/lib/utils";
import { Space_Grotesk } from "next/font/google";
import { LoaderCircle, LucideSearch } from "lucide-react";
import useDelayedFunction from "@/utils/hooks/useDelayedFunction";
import { Dictionary } from "@/types/dictionary";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useAddStudentSchoolsMutation, useLazyGetStudentSchoolsQuery } from "@/redux/services/student/studentApi";
import LoadingSpinner from "@/components/loading-spinner";
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export default function SchoolPage() {
    const [schools, setSchools] = useState([]);
    const [selectedSchools, setSelectedSchools] = useState<Dictionary[]>([]);
    const router = useRouter()

    const { data } = useSession()
    const studentId = data?.user?.roleId

    const { delayedFunction } = useDelayedFunction(500)

    const [getMatchingSchools, { isLoading, isFetching }] = useLazyGetSchoolsQuery();
    const [addStudentSchools, { isLoading: isAddingStudentSchool }] = useAddStudentSchoolsMutation()
    const [getStudentSchools, { isLoading: isGettingStudentSchool, isFetching: isFetchingStudentSchool }] = useLazyGetStudentSchoolsQuery()

    // fetch student interested schools
    const handleGetStudentSchools = async (studentId) => {
        getStudentSchools(studentId)
          .unwrap()
          .then(data => {
              const default_schools = data.data.map((school) => {
                return {
                    id: school.school_id,
                    name: school.name,
                    selected: true
                }
            })
            setSelectedSchools([...selectedSchools, ...default_schools])
          })
      }

    // submit student school of interest
    const handleSubmitSchool = async () => {
        if (selectedSchools.length === 0) {
            toast.error("Please select a school")
            return
        }
        const schools = selectedSchools.map((school) => school.id)
        addStudentSchools({ data: schools, studentId: studentId })
            .unwrap()
            .then(data => {
                toast.success(data.message)
                router.push('/student/onboarding/majors')
            })
    }

    // handle school change
    const handleSelectSchool = useCallback((school) => {
        const index = selectedSchools.findIndex((s) => s.id === school.id);
        if (index === -1) {
            setSelectedSchools([...selectedSchools, { ...school, selected: true }]);
        } else {
            const updatedSelectedSchools = [...selectedSchools];
            updatedSelectedSchools[index].selected = !updatedSelectedSchools[index].selected;
            updatedSelectedSchools.splice(index, 1);
            setSelectedSchools(updatedSelectedSchools);
        }
    }, [selectedSchools]);

    // search for interested schools
    const handleGetMatchingSchools = async (matchText) => {
        setSchools([])
        await getMatchingSchools(matchText)
            .unwrap()
            .then((payload) => {
                // console.log(payload.data.map((f) => f.id))
                setSchools(payload.data);
            })
    }

    // set a delay for the search
    function handleOnChange(e) {

        const matchText = e.target.value;

        if (!matchText) {
            setSchools([]);
            return;
        }
        delayedFunction(() => handleGetMatchingSchools(matchText))
    }

    useEffect(() => {
        if (studentId) {
          handleGetStudentSchools(studentId)
        }
      }, [studentId])
    
      if (isGettingStudentSchool || isFetchingStudentSchool) {
        return <LoadingSpinner/>
      }

    return (
        <>
            <OnboardingTabs active_step="Schools" />
            <div className="overflow-y-auto pb-32 h-[calc(100vh_-_10rem)]">
                <OnboardingTitle
                    title="Choose the University you are interested in"
                    subtitle="Where Will Your Curiosity Take You?"
                />
                <div className="mt-10">
                    <form>
                        <div className="flex-1 px-6 md:px-12 lg:px-20">
                            <SectionContainer
                                title="Your Interested University"
                                subTitle="Search and Choose your Interested University"
                                titleClass={cn(
                                    spaceGrotesk.className,
                                    "mb-0"
                                )}
                            >
                                <div className="pt-6">
                                    <div className="relative">
                                        <Input
                                            label="Search Schools"
                                            placeholder="Search"
                                            className="rounded-lg p-[1.4rem] pl-8 placeholder:text-[#AAAAAA]"
                                            onChange={handleOnChange}
                                        />
                                        <LucideSearch width={15} height={15} className="text-[#AAAAAA]  top-10 left-3 absolute" />
                                    </div>
                                    <SectionContainer
                                        className="hidden my-6"
                                        title="Popular university"
                                        titleClass="mb-1 md:text-sm"
                                    >
                                        <>
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-8">
                                                {
                                                    POPULAR_UNIVERSITIES.map(({ id, name }) => (
                                                        <CustomCheckbox
                                                            key={id}
                                                            id={id}
                                                            label={name}
                                                            hasBorder
                                                            className="rounded-lg p-[1.4rem"
                                                        />
                                                    ))
                                                }
                                            </div>
                                        </>
                                    </SectionContainer>

                                    <SectionContainer
                                        className="hidden my-6"
                                        title="Near You"
                                        titleClass="mb-1 md:text-sm"
                                    >
                                        <>
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-8">
                                                {
                                                    UNIVERSITIES_NEAR_BY.map(({ id, name }) => (
                                                        <CustomCheckbox
                                                            key={id}
                                                            id={id}
                                                            label={name}
                                                            hasBorder
                                                            className="rounded-lg p-[1.4rem"
                                                        />
                                                    ))
                                                }
                                            </div>
                                        </>
                                    </SectionContainer>

                                    <CustomCheckbox
                                        label="I am undecided on what school"
                                        id="undecided"
                                        hasBorder
                                        className="hidden rounded-lg p-[1.4rem"
                                    />
                                    {/* Interested Schools */}
                                    <SectionContainer
                                        className="my-6"
                                        title="Interested Schools"
                                        titleClass="mb-1 md:text-sm"
                                    >
                                        <>{selectedSchools?.length ?
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-8">
                                                {
                                                    selectedSchools.map((item: Dictionary) => (
                                                        <CustomCheckbox
                                                            key={item.id}
                                                            id={item.id}
                                                            label={item.name}
                                                            hasBorder
                                                            className="rounded-lg p-[1.4rem"
                                                            checked={item.selected}
                                                            onClick={() => handleSelectSchool(item)}
                                                        />
                                                    ))
                                                }
                                            </div> : <div className="border border-dashed rounded-sm p-6 text-sm text-center">
                                                No School Selected
                                            </div>}
                                        </>
                                    </SectionContainer>

                                    {/* This section contain the searched schools */}
                                    <SectionContainer
                                        className="my-6"
                                        title="Search Results"
                                        titleClass="mb-1 md:text-sm"
                                    >
                                        <>
                                           {(isLoading || isFetching )?
                                            <div className="h-20 grid place-content-center">
                                                 <LoaderCircle width={40} height={40} className="animate-spin text-primary/60" />
                                            </div>
                                           : <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-8">
                                                {
                                                    schools.map((item: Dictionary) => (
                                                        <CustomCheckbox
                                                            key={item.id}
                                                            id={item.id}
                                                            label={item.name}
                                                            hasBorder
                                                            className="rounded-lg p-[1.4rem"
                                                            onClick={() => handleSelectSchool(item)}
                                                            checked={selectedSchools.some((s) => s.id === item.id && s.selected)}
                                                        />
                                                    ))
                                                }
                                            </div>}
                                        </>
                                    </SectionContainer>
                                </div>
                            </SectionContainer>
                        </div>
                        <OnboardingFooter
                            prevPageHandler={() => router.push('/student/onboarding/vitals')}
                            nextPageHandler={() => handleSubmitSchool()}
                            preventGoBack={false}
                            loading={isAddingStudentSchool}
                        />
                    </form>
                </div>
            </div>
        </>
    )
}
