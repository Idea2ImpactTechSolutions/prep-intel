"use client"
import OnboardingFooter from "@/app/student/_components/onboarding-footer";
import CustomCheckbox from "@/components/custom-checkbox";
import SectionContainer from "@/components/section-container";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { EXTRACURRICULAR_ACTIVITIES, EXTRACURRICULAR_INTEREST } from "../data";

export default function ExtracurricularPage() {
  const router = useRouter()

  return (
    <form>
      <div className="flex-1 px-6 md:px-12 lg:px-20">
        <SectionContainer
          title="Current High School Extracurricular Activities"
        >
          <>
            <Input
              label="Search Extracurricular Activities"
              placeholder="ex. Computer Science"
            />
            <SectionContainer
              className="my-6"
              title=""
              titleClass="mb-1 md:text-sm"
            >
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-8">
                  {
                    EXTRACURRICULAR_ACTIVITIES.map(({ id, name, icon }) => (
                      <CustomCheckbox
                        key={id}
                        id={id}
                        label={name}
                        icon={icon}
                        hasBorder
                      />
                    ))
                  }
                </div>
              </>
            </SectionContainer>

            <SectionContainer
              className="my-6"
              title="Collegiate Extracurricular Interests"
              titleClass="mb-2 "
            >
              <>
                <Input
                  label="Search Extracurricular Activities"
                  placeholder="ex. Computer Science"
                  className="mb-4"
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-8">
                  {
                    EXTRACURRICULAR_INTEREST.map(({ id, name, icon }) => (
                      <CustomCheckbox
                        key={id}
                        id={id}
                        label={name}
                        icon={icon}
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
        prevPageHandler={() => router.push('/student/onboarding/majors')}
        nextPageHandler={() => router.push('/student/onboarding/transcripts')}
      />
    </form>
  )
}
