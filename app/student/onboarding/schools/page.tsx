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
import { PageContent } from "@/components/common-page";

export default function SchoolPage() {
    const [schools, setSchools] = useState([]);
    const [selectedSchools, setSelectedSchools] = useState<Dictionary[]>([]);
    const router = useRouter()

    const { data: session } = useSession()
    const studentId = session?.user.roleId
    const profileComplete = session?.user.profileComplete;

    const { delayedFunction } = useDelayedFunction(500)

    const [getMatchingSchools, { isLoading, isFetching }] = useLazyGetSchoolsQuery();
    const [addStudentSchools, { isLoading: isAddingStudentSchool, isSuccess }] = useAddStudentSchoolsMutation()
    const [getStudentSchools, { isLoading: isGettingStudentSchool, isFetching: isFetchingStudentSchool }] = useLazyGetStudentSchoolsQuery()

    // fetch student interested schools
    const handleGetStudentSchools = async (studentId) => {
        getStudentSchools(studentId)
          .unwrap()
          .then(response => {
              // Assume .interested is not set on school initiated connections and thus filtering
              // to interested only to ensure user's wouldn't be removing those connections here
              const interestedSchools = response.data.filter(s => s.interested).map((data) => {
                // Map to { id: n, name: x }
                return {
                    id: data.school.id,
                    name: data.school.name,
                }
            })
            setSelectedSchools([...selectedSchools, ...interestedSchools])
          })
      }

    // submit student school of interest
    const handleSubmitSchool = async () => {
        // Map to an array of school ids and update
        const schools = selectedSchools.map((school) => school.id)
        addStudentSchools({ data: schools, studentId: studentId })
            .unwrap()
            .then(data => {
              if (!profileComplete) {
                toast.success(data.message)
                router.push('/student/onboarding/majors')
              } else {
                router.push('/student/explore');
              }
            })
    }

    // handle school change
    const handleSelectSchool = useCallback((school) => {
        const index = selectedSchools.findIndex((s) => s.id === school.id);
        if (index === -1) {
            // Add School
            setSelectedSchools([...selectedSchools, school]);
        } else {
            // Remove school
            setSelectedSchools(selectedSchools.filter(s => s.id !== school.id));
        }
    }, [selectedSchools]);

    // search for interested schools
    const handleGetMatchingSchools = async (matchText) => {
        setSchools([])
        await getMatchingSchools(matchText)
            .unwrap()
            .then((payload) => {
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
            <OnboardingTabs active_step="Schools" useSteppedWizard={!profileComplete} />
            <PageContent>
                <OnboardingTitle
                    title="Choose the Institution you are interested in"
                    subtitle="Where Will Your Curiosity Take You?"
                    visible={!profileComplete}
                />
                <div className="">
                    <form>
                        <div className="flex-1">
                            <SectionContainer
                                title="Your Interested University"
                                subTitle="Search and Choose the Institution you are interested in"
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
                                                            checked={true}
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
                            nextPageHandler={handleSubmitSchool}
                            useSteppedWizard={!profileComplete}
                            loading={isAddingStudentSchool || isSuccess}
                        />
                    </form>
                </div>
            </PageContent>
        </>
    )
}
