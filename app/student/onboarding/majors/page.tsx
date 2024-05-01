"use client"
import OnboardingFooter from "@/app/student/_components/onboarding-footer";
import CustomCheckbox from "@/components/custom-checkbox";
import SectionContainer from "@/components/section-container";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { POPULAR_MAJOR, PROFESSIONAL_PT_PROGRAMS } from "../data";

export default function MajorPage() {
  const router = useRouter()

  return (
    <form>
      <div className="flex-1 px-6 md:px-12 lg:px-20">
        <SectionContainer
          title="What do you want to Major In?"
        >
          <>
            <Input
              label="Search Majors"
              placeholder="ex. Computer Science"
            />
            <SectionContainer
              className="my-6"
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
              className="my-6"
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
            />
          </>
        </SectionContainer>
      </div>
      <OnboardingFooter
        prevPageHandler={() => router.push('/student/onboarding/schools')}
        nextPageHandler={() => router.push('/student/onboarding/extracurricular')}
        preventGoBack={false}
      />
    </form>
  )
}
