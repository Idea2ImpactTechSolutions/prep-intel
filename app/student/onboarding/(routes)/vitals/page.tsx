"use client"
import OnboardingFooter from "@/app/student/_components/onboarding-footer";
import CustomDatePicker from "@/components/custom-date-picker";
import CustomSelect from "@/components/custom-select";
import SectionContainer from "@/components/section-container";
import { Input } from "@/components/ui/input";
import { getCityByStateName, getStateData } from "@/utils/helpers/get-state-data";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function VitalsPage() {
  const [state, setState] = useState('')
  const [city, setCity] = useState('')

  const router = useRouter()

  const STATES = useMemo(() => getStateData(), [])
  const CITIES = useMemo(() => {
    setCity('')
    return getCityByStateName(state)
  }, [state])

  return (
    <>
    <form>
      <div className="flex-1 px-6 md:px-12 lg:px-20">
        <SectionContainer
          title="About You"
        >   
            <>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2 md:gap-x-8 lg:grid-cols-">
                <Input
                  label="First Name"
                  className="mb-4 md:mb-6"
                />
                <Input
                  label="Last Name"
                  className="mb-4 md:mb-6"
                />
                <CustomDatePicker
                  label="Birth Date"
                  className="mb-4"
                  handleChange={() => null}
                />
                <Input
                  label="Expected Graduation Year"
                  className="mb-4 md:mb-6"
                  type=""
                />
                <div className="mb-4 md:mb-6">
                  <CustomSelect
                    label='State'
                    options={STATES}
                    selected={state}
                    setSelected={setState}
                    error={""}
                  />
                </div>
                <div className="mb-4 md:mb-6">
                  <CustomSelect
                    label="City"
                    options={CITIES}
                    selected={city}
                    setSelected={setCity}
                    disabled={state === ''}
                    error={""}
                  />
                </div>
              </div>
              <Input
                label="High School Name"
                className="mb-4"
                type=""
              />
            </>
        </SectionContainer>

        <SectionContainer
          title="About Your Gaurdian"
        >
            <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2 md:gap-x-8 lg:grid-cols-">
              <Input
                label="First Name"
                className="mb-4 md:mb-6"
              />
              <Input
                label="Last Name"
                className="mb-4 md:mb-6"
              />
              <Input
                label="Email Address"
                className="mb-4 md:mb-6"
                type=""
              />
            </div>
        </SectionContainer>
      </div>
      <OnboardingFooter
        prevPageHandler={() => router.push('/register')}
        nextPageHandler={() => router.push('/student/onboarding/schools')}
      />
    </form>
    </>
  );
}
