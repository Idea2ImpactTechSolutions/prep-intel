"use client"
import OnboardingFooter from "@/app/student/_components/onboarding-footer";
import CustomCheckbox from "@/components/custom-checkbox";
import LoadingSpinner from "@/components/loading-spinner";
import SectionContainer from "@/components/section-container";
import { Input } from "@/components/ui/input";
import { useAddStudentMajorsMutation, useLazyGetStudentMajorsQuery } from "@/redux/services/student/studentApi";
import { Dictionary } from "@/types/dictionary";
import useDelayedFunction from "@/utils/hooks/useDelayedFunction";
import { LoaderCircle, LucideSearch } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import AVAILABLE_MAJORS from "../../../../data/majors.json";
import OnboardingTabs from "../../_components/onboarding-tabs";
import OnboardingTitle from "../../_components/onboarding-title";
import { POPULAR_MAJOR, PROFESSIONAL_PT_PROGRAMS } from "../data";
import { toast } from "sonner";

export default function MajorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [majors, setMajors] = useState<Dictionary[]>([]);
  const [selectedMajors, setSelectedMajors] = useState<Dictionary[]>([]);

  const [addStudentMajors, { isLoading: isAddingStudentMajor }] = useAddStudentMajorsMutation()
  const [getStudentMajors, { isLoading: isGettingStudentMajor, isFetching: isFetchingStudentMajor }] = useLazyGetStudentMajorsQuery()

  const router = useRouter()

  const { data } = useSession()
  const studentId = data?.user?.roleId

  const { delayedFunction } = useDelayedFunction(500)


  // fetch student interested schools
  const handleGetStudentMajors = async (studentId) => {
    getStudentMajors(studentId)
      .unwrap()
      .then(data => {
        console.log(data)
          const default_majors = data.data.map((major) => {
            return {
                ...major,
                selected: true
            }
        })
        setSelectedMajors([...selectedMajors, ...default_majors])
      })
  }

  // submit student majors
  const handleSubmitMajors = async () => {
    if (selectedMajors.length === 0) {
      toast.error("Please select a major")
      return
    }
    const majors = selectedMajors.map((major) => major.name)
    addStudentMajors({ data: majors, studentId: studentId })
      .unwrap()
      .then(data => {
        toast.success('Record submitted successfully')
        router.push('/student/onboarding/extracurricular')
      })
  }

  // handle school change
  const handleSelectMajor = useCallback((major) => {
    const index = selectedMajors.findIndex((s) => s.name === major.name);
    if (index === -1) {
      setSelectedMajors([...selectedMajors, { ...major, selected: true }]);
    } else {
      const updatedSelectedMajors = [...selectedMajors];
      updatedSelectedMajors[index].selected = !updatedSelectedMajors[index].selected;
      updatedSelectedMajors.splice(index, 1);
      setSelectedMajors(updatedSelectedMajors);
    }
  }, [selectedMajors]);

  // search for interested majors
  const handleGetMatchingMajors = (matchText) => {
    setIsLoading(true)
    setMajors([])
    const filteredMajors = AVAILABLE_MAJORS.filter((f) => f.name.includes(matchText))
    setMajors(filteredMajors)
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
      <OnboardingTabs active_step="Majors" />
      <div className="overflow-y-auto pb-32 h-[calc(100vh_-_10rem)]">
        <OnboardingTitle
          title="Choose your interested Major"
          subtitle="Where Will Your Curiosity Take You?"
        />
        <div className="mt-10">
          <form>
            <div className="flex-1 px-6 md:px-12 lg:px-20">
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
                          selectedMajors.map((item: Dictionary) => (
                            <CustomCheckbox
                              key={item.name}
                              id={item.name}
                              label={item.name}
                              hasBorder
                              className="rounded-lg p-[1.4rem"
                              checked={item.selected}
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
                            majors.map((item: Dictionary) => (
                              <CustomCheckbox
                                key={item.name}
                                id={item.name}
                                label={item.name}
                                hasBorder
                                className="rounded-lg p-[1.4rem"
                                onClick={() => handleSelectMajor(item)}
                                checked={selectedMajors.some((s) => s.name === item.name && s.selected)}
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
              nextPageHandler={() => handleSubmitMajors()}
              preventGoBack={false}
              loading={isAddingStudentMajor}
            />
          </form>
        </div>

      </div>
    </>
  )
}
