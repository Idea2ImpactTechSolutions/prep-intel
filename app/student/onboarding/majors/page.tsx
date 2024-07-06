"use client"
import OnboardingFooter from "@/app/student/_components/onboarding-footer";
import CustomCheckbox from "@/components/custom-checkbox";
import LoadingSpinner from "@/components/loading-spinner";
import SectionContainer from "@/components/section-container";
import { Input } from "@/components/ui/input";
import { useAddStudentMajorsMutation, useLazyGetStudentMajorsQuery } from "@/redux/services/student/studentApi";
import useDelayedFunction from "@/utils/hooks/useDelayedFunction";
import { LoaderCircle, LucideSearch } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import AVAILABLE_MAJORS from "../../../../data/majors.json";
import OnboardingTabs from "../../_components/onboarding-tabs";
import OnboardingTitle from "../../_components/onboarding-title";
import { POPULAR_MAJOR, PROFESSIONAL_PT_PROGRAMS } from "../data";
import { PageContent } from "@/components/common-page";

export default function MajorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [majors, setMajors] = useState<string[]>([]);
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);

  const [addStudentMajors, { isLoading: isAddingStudentMajor }] = useAddStudentMajorsMutation()
  const [getStudentMajors, { isLoading: isGettingStudentMajor, isFetching: isFetchingStudentMajor }] = useLazyGetStudentMajorsQuery()

  const router = useRouter()

  const { data } = useSession()
  const studentId = data?.user?.roleId
  const profileComplete = data?.user?.profileComplete;


  const { delayedFunction } = useDelayedFunction(500)

  // fetch student interested schools
  const handleGetStudentMajors = async (studentId) => {
    getStudentMajors(studentId)
      .unwrap()
      .then(body => {
        const existingMajors = body.data;
        setSelectedMajors([...selectedMajors, ...existingMajors])
      })
  }

  // submit student majors
  const handleSubmitMajors = async () => {
    addStudentMajors({ data: selectedMajors, studentId: studentId })
      .unwrap()
      .then(data => {
        if (!profileComplete) {
          toast.success('Record submitted successfully')
          router.push('/student/onboarding/extracurricular')
        } else {
          router.push('/student/explore');
        }
      })
  }

  // handle school change
  const handleSelectMajor = useCallback((major) => {
    const index = selectedMajors.findIndex((s) => s === major);
    if (index === -1) {
      // Add the item to the list
      setSelectedMajors([...selectedMajors, major]);
    } else {
      // Remove the item from the list
      setSelectedMajors(selectedMajors.filter(m => m != major));
    }
  }, [selectedMajors]);

  // search for interested majors
  const handleGetMatchingMajors = (matchText) => {
    setIsLoading(true)
    setMajors([])
    const filteredMajors = AVAILABLE_MAJORS.filter((f) => f.name.includes(matchText))
    setMajors(filteredMajors.map(f => f.name))
    setIsLoading(false)
  }

  // set a delay for the search
  const handleOnChange = (e) => {
    const matchText = e.target.value;
    if (!matchText) {
      setMajors([]);
      return;
    }
    delayedFunction(() => handleGetMatchingMajors(matchText))
  }

  useEffect(() => {
    if (studentId) {
      handleGetStudentMajors(studentId)
    }
  }, [studentId])

  if (isGettingStudentMajor || isFetchingStudentMajor) {
    return <LoadingSpinner />
  }
  return (
    <>
      <OnboardingTabs className="pi-container" active_step="Majors" />
      <PageContent>
        <OnboardingTitle
          title="Choose your interested Major"
          subtitle="Where Will Your Curiosity Take You?"
        />
        <div className="mt-10">
          <form>
            <div className="flex-1">
              <SectionContainer
                title="What do you want to Major In?"
              >
                <>
                  <div className="relative">
                    <Input
                      label="Search Majors"
                      placeholder="ex. Computer Science"
                      className="rounded-lg p-[1.4rem] pl-8 placeholder:text-[#AAAAAA]"
                      onChange={handleOnChange}
                    />
                    <LucideSearch width={15} height={15} className="text-[#AAAAAA]  top-10 left-3 absolute" />
                  </div>
                  <SectionContainer
                    className="hidden my-6"
                    title="Popular"
                    titleClass="mb-1 md:text-sm"
                  >
                    <>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-8">
                        {
                          POPULAR_MAJOR.map(({ id, name }) => (
                            <CustomCheckbox
                              key={id}
                              id={id}
                              label={name}
                              hasBorder
                            />
                          ))
                        }
                      </div>
                    </>
                  </SectionContainer>

                  <SectionContainer
                    className="hidden my-6"
                    title="Professional Pre-Track Programs"
                    titleClass="mb-2 "
                  >
                    <>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-8">
                        {
                          PROFESSIONAL_PT_PROGRAMS.map(({ id, name }) => (
                            <CustomCheckbox
                              key={id}
                              id={id}
                              label={name}
                              hasBorder
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
                    className="hidden"
                  />

                  {/* Interested Schools */}
                  <SectionContainer
                    className="my-6"
                    title="Interested Majors"
                    titleClass="mb-1 md:text-sm"
                  >
                    <>{selectedMajors?.length ?
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-8">
                        {
                          selectedMajors.map((item) => (
                            <CustomCheckbox
                              key={item}
                              id={item}
                              label={item}
                              hasBorder
                              className="rounded-lg p-[1.4rem"
                              checked={true}
                              onClick={() => handleSelectMajor(item)}
                            />
                          ))
                        }
                      </div> : <div className="border border-dashed rounded-sm p-6 text-sm text-center">
                        No Major Selected
                      </div>}
                    </>
                  </SectionContainer>

                  {/* This section contain the searched majors */}
                  <SectionContainer
                    className="my-6"
                    title="Search Results"
                    titleClass="mb-1 md:text-sm"
                  >
                    <>
                      {(isLoading) ?
                        <div className="h-20 grid place-content-center">
                          <LoaderCircle width={40} height={40} className="animate-spin text-primary/60" />
                        </div>
                        : <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-8">
                          {
                            majors.map((item) => (
                              <CustomCheckbox
                                key={item}
                                id={item}
                                label={item}
                                hasBorder
                                className="rounded-lg p-[1.4rem"
                                onClick={() => handleSelectMajor(item)}
                                checked={selectedMajors.some((s) => s === item)}
                              />
                            ))
                          }
                        </div>}
                    </>
                  </SectionContainer>
                </>
              </SectionContainer>
            </div>
            <OnboardingFooter
              prevPageHandler={() => router.push('/student/onboarding/schools')}
              nextPageHandler={handleSubmitMajors}
              preventGoBack={false}
              loading={isAddingStudentMajor}
            />
          </form>
        </div>

      </PageContent>
    </>
  )
}
